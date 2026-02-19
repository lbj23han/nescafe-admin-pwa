import OpenAI from "openai";

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    return { ok: false as const, error: "OPENAI_KEY_MISSING" as const };
  return { ok: true as const, client: new OpenAI({ apiKey }) };
}

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
}

type JsonSchemaObject = Record<string, unknown>;

export async function runJsonSchema(args: {
  client: OpenAI;
  model: string;
  prompt: string;
  schemaName: string;
  schema: JsonSchemaObject;
  temperature?: number;
}): Promise<
  | { ok: true; data: unknown }
  | { ok: false; error: "OPENAI_FAILED" | "INVALID_MODEL_OUTPUT" }
> {
  const resp = await args.client.responses.create({
    model: args.model,
    input: [{ role: "user", content: args.prompt }],
    temperature: args.temperature ?? 0.2,
    text: {
      format: {
        type: "json_schema",
        name: args.schemaName,
        strict: true,
        schema: args.schema,
      },
    },
  });

  const out = resp.output_text?.trim() ?? "";
  if (!out) return { ok: false, error: "OPENAI_FAILED" };

  try {
    return { ok: true, data: JSON.parse(out) };
  } catch {
    return { ok: false, error: "INVALID_MODEL_OUTPUT" };
  }
}
