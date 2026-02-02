import OpenAI from "openai";
import { NextResponse } from "next/server";
import type {
  AiAssistantRequest,
  AiAssistantResponse,
} from "@/hooks/ai/internal/types";
import { extractNormalizedDate } from "@/hooks/ai/internal/date";
import { extractAmountKRW } from "@/hooks/ai/internal/amount";
import { RESERVATION_INTENT_SCHEMA } from "@/hooks/ai/internal/schema";
import { buildReservationPrompt } from "@/hooks/ai/internal/prompt";
import { parseReservationIntent } from "@/hooks/ai/internal/parser";

export const runtime = "nodejs";

function json(status: number, body: AiAssistantResponse) {
  return NextResponse.json(body, { status });
}

function safeTrim(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
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

    if (task === "ledger") {
      return json(501, { ok: false, error: "NOT_IMPLEMENTED" });
    }

    if (!input) {
      return json(400, { ok: false, error: "INPUT_REQUIRED" });
    }

    // 날짜 필수: input에서 먼저 추출/정규화
    const normalized = extractNormalizedDate(input);
    if (!normalized.ok) {
      return json(400, { ok: false, error: "DATE_REQUIRED" });
    }

    //  금액 선추출: 단위가 없으면 null (추정 금지)
    const extractedAmount = extractAmountKRW(input);

    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

    const prompt = buildReservationPrompt({
      rawText: input,
      normalizedDate: normalized.date,
      extractedAmount,
    });

    const openai = new OpenAI({ apiKey });

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

    return json(200, { ok: true, data: intent });
  } catch (e) {
    console.error("[api/ai/assistant] failed", e);
    return json(500, { ok: false, error: "OPENAI_FAILED" });
  }
}
