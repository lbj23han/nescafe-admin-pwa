import OpenAI from "openai";
import { NextResponse } from "next/server";
import type {
  AiAssistantRequest,
  AiAssistantResponse,
} from "@/hooks/ai/internal/types";
import { extractNormalizedDate } from "@/hooks/ai/internal/date";
import {
  extractAmountKRW,
  extractAmountKRWLoose,
} from "@/hooks/ai/internal/amount";
import { RESERVATION_INTENT_SCHEMA } from "@/hooks/ai/internal/schema";
import { buildReservationPrompt } from "@/hooks/ai/internal/prompt";
import {
  parseLedgerIntent,
  parseReservationIntent,
} from "@/hooks/ai/internal/parser";

export const runtime = "nodejs";

function json(status: number, body: AiAssistantResponse) {
  return NextResponse.json(body, { status });
}

function safeTrim(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function isIsoDate(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

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

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return json(500, { ok: false, error: "OPENAI_KEY_MISSING" });
    }

    const body = (await req.json()) as Partial<AiAssistantRequest>;
    const task = body.task;
    const input = safeTrim(body.input);

    if (task !== "reservation" && task !== "ledger") {
      return json(400, { ok: false, error: "INVALID_TASK" });
    }

    if (!input) {
      return json(400, { ok: false, error: "INPUT_REQUIRED" });
    }

    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
    const openai = new OpenAI({ apiKey });

    // ledger: 날짜 요구 없음
    if (task === "ledger") {
      // ledger는 총액키워드 없이도 "5만원/5만/2천/50,000원" 같은 명확한 표현을 확정
      const extractedAmount = extractAmountKRWLoose(input);

      const prompt = buildLedgerPrompt({
        rawText: input,
        extractedAmount,
      });

      const resp = await openai.responses.create({
        model,
        input: [{ role: "user", content: prompt }],
        temperature: 0.2,
        text: {
          format: {
            type: "json_schema",
            name: LEDGER_INTENT_SCHEMA.name,
            strict: true,
            schema: LEDGER_INTENT_SCHEMA.schema,
          },
        },
      });

      const out = resp.output_text?.trim() ?? "";
      if (!out) {
        return json(502, { ok: false, error: "OPENAI_FAILED" });
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(out);
      } catch {
        return json(502, { ok: false, error: "INVALID_MODEL_OUTPUT" });
      }

      const intent = parseLedgerIntent({
        data: parsed,
        rawText: input,
        extractedAmount,
      });

      // ledger는 "일단 진입/미리보기"가 목표라 예약처럼 강한 거절 기준은 두지 않음.
      // 그래도 완전 무의미하면 UNRECOGNIZED_INPUT 처리.
      const hasAnySignal =
        intent.department !== null ||
        intent.action !== null ||
        intent.amount !== null;

      if (!hasAnySignal || intent.confidence < 0.25) {
        return json(422, { ok: false, error: "UNRECOGNIZED_INPUT" });
      }

      return json(200, { ok: true, data: intent });
    }

    // reservation: 기존 로직 유지
    const resolvedDateIso = body.resolvedDateIso;
    const normalized = isIsoDate(resolvedDateIso)
      ? { ok: true as const, date: resolvedDateIso, matchedText: "resolved" }
      : extractNormalizedDate(input);

    if (!normalized.ok) {
      return json(400, { ok: false, error: "DATE_REQUIRED" });
    }

    // 예약은 "총액 키워드"가 있을 때만 확정 (단가/라인금액 오인 방지)
    const extractedAmount = extractAmountKRW(input);

    const prompt = buildReservationPrompt({
      rawText: input,
      normalizedDate: normalized.date,
      extractedAmount,
    });

    const resp = await openai.responses.create({
      model,
      input: [{ role: "user", content: prompt }],
      temperature: 0.2,
      text: {
        format: {
          type: "json_schema",
          name: RESERVATION_INTENT_SCHEMA.name,
          strict: true,
          schema: RESERVATION_INTENT_SCHEMA.schema,
        },
      },
    });

    const out = resp.output_text?.trim() ?? "";
    if (!out) {
      return json(502, { ok: false, error: "OPENAI_FAILED" });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(out);
    } catch {
      return json(502, { ok: false, error: "INVALID_MODEL_OUTPUT" });
    }

    const intent = parseReservationIntent({
      data: parsed,
      rawText: input,
      normalizedDate: normalized.date,
      extractedAmount,
    });

    const hasAnySignal =
      intent.department !== null ||
      intent.menu !== null ||
      intent.time !== null ||
      intent.location !== null ||
      intent.memo !== null ||
      intent.amount !== null;

    if (!hasAnySignal || intent.confidence < 0.35) {
      return json(422, { ok: false, error: "UNRECOGNIZED_INPUT" });
    }

    return json(200, { ok: true, data: intent });
  } catch (e) {
    console.error("[api/ai/assistant] failed", e);
    return json(500, { ok: false, error: "OPENAI_FAILED" });
  }
}
