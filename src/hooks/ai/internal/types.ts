export type AiTask = "reservation" | "ledger";

export type AiAssistantRequest = {
  task: AiTask;
  //  서버는 text를 받도록 구현되어 있을 가능성이 높지만
  // 현재 타입은 input으로 되어 있으니, 훅에서 요청 시 { task, text }로 보낼 것(Commit 3).
  input: string;
};

export type AiAssistantErrorCode =
  | "INPUT_REQUIRED"
  | "INVALID_TASK"
  | "NOT_IMPLEMENTED"
  | "DATE_REQUIRED"
  | "OPENAI_KEY_MISSING"
  | "OPENAI_FAILED"
  | "INVALID_MODEL_OUTPUT";

export type AiAssistantResponse =
  | { ok: true; data: unknown }
  | { ok: false; error: AiAssistantErrorCode };

export type ReservationIntent = {
  kind: "reservation";

  // 필수: 정규화된 YYYY-MM-DD
  date: string;

  department: string | null;
  menu: string | null;

  amount: number | null;
  time: string | null;
  location: string | null;
  memo: string | null;

  confidence: number; // 0~1
  assumptions: string[];
  warnings: string[];

  raw_text: string;
};

export type NormalizedDateResult =
  | { ok: true; date: string; matchedText: string }
  | { ok: false };

export type Scope = AiTask;
export type Step = "pickScope" | "input" | "preview";
