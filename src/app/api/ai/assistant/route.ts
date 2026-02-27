import type {
  AiAssistantRequest,
  AiAssistantResponse,
} from "@/hooks/ai/internal/types";

import { json, safeTrim } from "@/lib/ai/assistant/respond";
import { getOpenAIClient, getOpenAIModel } from "@/lib/ai/assistant/openaiJson";
import { handleLedger } from "@/lib/ai/assistant/ledger";
import { handleReservation } from "@/lib/ai/assistant/reservation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<AiAssistantRequest>;
    const task = body.task;
    const input = safeTrim(body.input);

    if (task !== "reservation" && task !== "ledger") {
      return json(400, { ok: false, error: "INVALID_TASK" });
    }
    if (!input) {
      return json(400, { ok: false, error: "INPUT_REQUIRED" });
    }

    const clientR = getOpenAIClient();
    if (!clientR.ok) {
      return json(500, { ok: false, error: clientR.error });
    }

    const model = getOpenAIModel();

    if (task === "ledger") {
      const r = await handleLedger({ client: clientR.client, model, input });
      if (!r.ok)
        return json(r.error === "UNRECOGNIZED_INPUT" ? 422 : 502, {
          ok: false,
          error: r.error,
        });
      return json(200, { ok: true, data: r.data });
    }

    const r = await handleReservation({
      client: clientR.client,
      model,
      input,
      resolvedDateIso: body.resolvedDateIso,
    });

    if (!r.ok) {
      const status =
        r.error === "DATE_REQUIRED"
          ? 400
          : r.error === "UNRECOGNIZED_INPUT"
          ? 422
          : 502;
      return json(status, { ok: false, error: r.error });
    }

    return json(200, { ok: true, data: r.data });
  } catch (e) {
    console.error("[api/ai/assistant] failed", e);
    return json(500, {
      ok: false,
      error: "OPENAI_FAILED",
    } satisfies AiAssistantResponse);
  }
}
