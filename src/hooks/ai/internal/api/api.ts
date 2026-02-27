import type { AiAssistantResponse, Scope } from "../types";

export type PostAiAssistantArgs = {
  task: Scope;
  text: string;
  todayIso?: string;
  resolvedDateIso?: string;
};

export async function postAiAssistant(
  args: PostAiAssistantArgs
): Promise<AiAssistantResponse> {
  const res = await fetch("/api/ai/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      task: args.task,
      input: args.text,
      ...(args.todayIso ? { todayIso: args.todayIso } : {}),
      ...(args.resolvedDateIso
        ? { resolvedDateIso: args.resolvedDateIso }
        : {}),
    }),
  });

  const json = (await res.json().catch(() => null)) as unknown;

  if (json && typeof json === "object" && "ok" in json) {
    return json as AiAssistantResponse;
  }

  return { ok: false, error: "OPENAI_FAILED" };
}
