import type OpenAI from "openai";
import { extractNormalizedDate } from "@/hooks/ai/internal/date/date";
import { extractAmountKRW } from "@/hooks/ai/internal/utils/amount";
import { RESERVATION_INTENT_SCHEMA } from "@/hooks/ai/internal/pipeline/schema";
import { buildReservationPrompt } from "@/hooks/ai/internal/pipeline/prompt";
import { parseReservationIntent } from "@/hooks/ai/internal/pipeline/parser";
import { runJsonSchema } from "./openaiJson";

export async function handleReservation(args: {
  client: OpenAI;
  model: string;
  input: string;
  resolvedDateIso?: unknown;
}) {
  const normalized =
    typeof args.resolvedDateIso === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(args.resolvedDateIso)
      ? {
          ok: true as const,
          date: args.resolvedDateIso,
          matchedText: "resolved",
        }
      : extractNormalizedDate(args.input);

  if (!normalized.ok) {
    return { ok: false as const, error: "DATE_REQUIRED" as const };
  }

  // 예약은 "총액 키워드" 있을 때만 확정
  const extractedAmount = extractAmountKRW(args.input);

  const prompt = buildReservationPrompt({
    rawText: args.input,
    normalizedDate: normalized.date,
    extractedAmount,
  });

  const r = await runJsonSchema({
    client: args.client,
    model: args.model,
    prompt,
    schemaName: RESERVATION_INTENT_SCHEMA.name,
    schema: RESERVATION_INTENT_SCHEMA.schema,
    temperature: 0.2,
  });

  if (!r.ok) return { ok: false as const, error: r.error };

  const intent = parseReservationIntent({
    data: r.data,
    rawText: args.input,
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
    return { ok: false as const, error: "UNRECOGNIZED_INPUT" as const };
  }

  return { ok: true as const, data: intent };
}
