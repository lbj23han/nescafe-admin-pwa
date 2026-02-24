import type { AiIntent, Scope } from "../types";

import { postAiAssistant } from "../api/api";
import { getKstTodayIso } from "../date/kstDate";
import { resolveRelativeDate } from "../date/resolveRelativeDate";
import { isLedgerIntent, isReservationIntent } from "../guards/guards";
import {
  toLedgerPreviewText,
  toReservationPreviewText,
} from "./preview/preview";

type PreviewOk = {
  ok: true;
  intent: AiIntent;
  previewText: string;
};

type PreviewFail = {
  ok: false;
  errorCode: unknown; // 그대로 constants
};

export type RequestAiPreviewResult = PreviewOk | PreviewFail;

export async function requestAiPreview(args: {
  scope: Scope;
  input: string; // trimmed input
}): Promise<RequestAiPreviewResult> {
  const { scope, input } = args;

  const todayIso = getKstTodayIso();

  const resolved = resolveRelativeDate({ input, todayIso });
  const resolvedDateIso = resolved.ok ? resolved.date : undefined;

  const out = await postAiAssistant({
    task: scope,
    text: input,
    todayIso,
    resolvedDateIso,
  });

  if (!out.ok) {
    return { ok: false, errorCode: out.error };
  }

  if (scope === "reservation") {
    if (!isReservationIntent(out.data)) {
      return { ok: false, errorCode: "INVALID_MODEL_OUTPUT" };
    }
    return {
      ok: true,
      intent: out.data,
      previewText: toReservationPreviewText(out.data),
    };
  }

  // scope === "ledger"
  if (!isLedgerIntent(out.data)) {
    return { ok: false, errorCode: "INVALID_MODEL_OUTPUT" };
  }

  return {
    ok: true,
    intent: out.data,
    previewText: toLedgerPreviewText(out.data),
  };
}
