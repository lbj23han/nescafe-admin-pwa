import type { LedgerIntent, ReservationIntent } from "./types";

export function isReservationIntent(v: unknown): v is ReservationIntent {
  if (!v || typeof v !== "object") return false;
  const obj = v as Record<string, unknown>;
  return (
    obj.kind === "reservation" &&
    typeof obj.date === "string" &&
    "assumptions" in obj &&
    "warnings" in obj
  );
}

export function isLedgerIntent(v: unknown): v is LedgerIntent {
  if (!v || typeof v !== "object") return false;
  const obj = v as Record<string, unknown>;
  return (
    obj.kind === "ledger" &&
    "assumptions" in obj &&
    "warnings" in obj &&
    "raw_text" in obj
  );
}
