export const RESERVATION_INTENT_SCHEMA = {
  name: "reservation_intent_v2",
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "kind",
      "date",
      "department",
      "menu",
      "amount",
      "time",
      "location",
      "memo",
      "confidence",
      "assumptions",
      "warnings",
      "raw_text",
    ],
    properties: {
      kind: { type: "string", enum: ["reservation"] },

      // 필수: 정규화된 YYYY-MM-DD
      date: { type: "string" },

      department: { anyOf: [{ type: "string" }, { type: "null" }] },
      menu: { anyOf: [{ type: "string" }, { type: "null" }] },

      amount: { anyOf: [{ type: "number" }, { type: "null" }] },
      time: { anyOf: [{ type: "string" }, { type: "null" }] },
      location: { anyOf: [{ type: "string" }, { type: "null" }] },
      memo: { anyOf: [{ type: "string" }, { type: "null" }] },

      confidence: { type: "number", minimum: 0, maximum: 1 },
      assumptions: { type: "array", items: { type: "string" } },
      warnings: { type: "array", items: { type: "string" } },

      raw_text: { type: "string" },
    },
  },
} as const;
