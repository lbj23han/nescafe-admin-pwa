import type OpenAI from "openai";
import { extractAmountKRWLoose } from "@/hooks/ai/internal/utils/amount";
import { parseLedgerIntent } from "@/hooks/ai/internal/pipeline/parser";
import { runJsonSchema } from "./openaiJson";

const LEDGER_INTENT_SCHEMA = {
  name: "LedgerIntent",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      department: { anyOf: [{ type: "string" }, { type: "null" }] },
      action: {
        anyOf: [
          {
            type: "string",
            enum: ["deposit", "withdraw", "createDebt", "settleDebt"],
          },
          { type: "null" },
        ],
      },
      amount: { anyOf: [{ type: "number" }, { type: "null" }] },
      confidence: { type: "number" },
      assumptions: { type: "array", items: { type: "string" } },
      warnings: { type: "array", items: { type: "string" } },
    },
    required: [
      "department",
      "action",
      "amount",
      "confidence",
      "assumptions",
      "warnings",
    ],
  },
} as const;

function buildLedgerPrompt(args: {
  rawText: string;
  extractedAmount: number | null;
}) {
  const { rawText, extractedAmount } = args;

  return [
    "너는 카페 내부 장부 입력을 돕는 AI 비서다.",
    "",
    "아래 입력문을 분석해 다음 JSON을 출력하라.",
    "- department: 부서명(있으면). 없으면 null",
    "- action: 아래 중 하나로만 분류. 애매하면 null",
    '  - "deposit": 예치금 입금/충전',
    '  - "withdraw": 예치금 차감/사용',
    '  - "createDebt": 미수금 생성/외상 추가',
    '  - "settleDebt": 미수금 정산/상환',
    "- amount: 금액. 단, 금액 단위를 입력에서 확정할 수 없으면 null",
    "- confidence: 0~1",
    "- assumptions: 해석 근거/가정(배열)",
    "- warnings: 확인이 필요한 점(배열)",
    "",
    "중요 정책:",
    "- 날짜/DB 반영/실제 장부 수정은 하지 않는다.",
    "- 확신 없으면 null로 두고 warnings/assumptions에 남긴다.",
    "- 금액은 입력문에서 확정 가능한 경우만 작성한다. (추정 금지)",
    "",
    `금액 힌트(extractedAmount): ${
      extractedAmount === null ? "null" : extractedAmount
    }`,
    "",
    `입력문(rawText): ${rawText}`,
  ].join("\n");
}

export async function handleLedger(args: {
  client: OpenAI;
  model: string;
  input: string;
}) {
  const extractedAmount = extractAmountKRWLoose(args.input);

  const prompt = buildLedgerPrompt({
    rawText: args.input,
    extractedAmount,
  });

  const r = await runJsonSchema({
    client: args.client,
    model: args.model,
    prompt,
    schemaName: LEDGER_INTENT_SCHEMA.name,
    schema: LEDGER_INTENT_SCHEMA.schema,
    temperature: 0.2,
  });

  if (!r.ok) return { ok: false as const, error: r.error };

  const intent = parseLedgerIntent({
    data: r.data,
    rawText: args.input,
    extractedAmount,
  });

  const hasAnySignal =
    intent.department !== null ||
    intent.action !== null ||
    intent.amount !== null;

  if (!hasAnySignal || intent.confidence < 0.25) {
    return { ok: false as const, error: "UNRECOGNIZED_INPUT" as const };
  }

  return { ok: true as const, data: intent };
}
