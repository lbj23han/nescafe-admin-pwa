export type AiTask = "reservation" | "ledger";

export type AiAssistantRequest = {
  task: AiTask;
  input: string;
  todayIso?: string;
  resolvedDateIso?: string;
};

export type AiAssistantErrorCode =
  | "INPUT_REQUIRED"
  | "INVALID_TASK"
  | "NOT_IMPLEMENTED"
  | "DATE_REQUIRED"
  | "UNRECOGNIZED_INPUT"
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

export type LedgerAction =
  | "deposit" // 예치금 입금
  | "withdraw" // 예치금 차감
  | "createDebt" // 미수금 생성
  | "settleDebt"; // 미수금 정산

export type LedgerIntent = {
  kind: "ledger";

  department: string | null;
  action: LedgerAction | null;
  amount: number | null;

  confidence: number; // 0~1
  assumptions: string[];
  warnings: string[];

  raw_text: string;
};

export type AiIntent = ReservationIntent | LedgerIntent;

export type NormalizedDateResult =
  | { ok: true; date: string; matchedText: string }
  | { ok: false };

export type Scope = AiTask;
export type Step = "pickScope" | "input" | "preview";
