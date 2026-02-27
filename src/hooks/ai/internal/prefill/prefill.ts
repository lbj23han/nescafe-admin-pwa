import type { ReservationIntent } from "../types";
import type { DayReservationPrefillQuery } from "./prefill.types";

import { safeParam, toDigitsFromNumber } from "./prefill.utils";
import { extractItemsFromText, safeStringifyItems } from "./prefill.items";
import { hasExplicitTotal, removeKnownNoise } from "./prefill.text";

export type { PrefillItem, DayReservationPrefillQuery } from "./prefill.types";
export {
  toQueryString,
  parseDayReservationPrefillQuery,
  toPrefillKey,
} from "./prefill.query";

export function buildDayReservationPrefillQuery(
  intent: ReservationIntent,
  extra?: {
    departmentMode?: "select" | "direct";
    selectedDepartmentId?: string;
  }
): DayReservationPrefillQuery {
  const { cleanedText, inferredDept, effectiveDepartment, effectiveLocation } =
    removeKnownNoise(intent);

  const leadingStripToken = inferredDept ?? undefined;
  const extracted = extractItemsFromText(cleanedText, leadingStripToken);

  const items =
    extracted.length > 0
      ? extracted
      : intent.menu
      ? [{ menu: intent.menu, quantity: "" }]
      : [];

  const explicitTotal = hasExplicitTotal(intent.raw_text);

  return {
    ai: "1",
    department: effectiveDepartment,
    departmentMode: extra?.departmentMode,
    selectedDepartmentId: extra?.selectedDepartmentId,
    time: safeParam(intent.time),
    location: effectiveLocation,
    amount: explicitTotal ? toDigitsFromNumber(intent.amount) : undefined,
    items: safeStringifyItems(items),
    memo: safeParam(intent.memo),
  };
}
