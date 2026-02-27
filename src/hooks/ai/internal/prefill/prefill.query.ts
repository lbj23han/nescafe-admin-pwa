import type { DayReservationPrefillQuery, PrefillItem } from "./prefill.types";
import { digitsOnly, safeParam } from "./prefill.utils";
import { safeParseItems } from "./prefill.items";

const KEY_AI = "ai";
const KEY_DEPARTMENT = "department";
const KEY_DEPARTMENT_MODE = "departmentMode";
const KEY_SELECTED_DEPARTMENT_ID = "selectedDepartmentId";
const KEY_TIME = "time";
const KEY_LOCATION = "location";
const KEY_AMOUNT = "amount";
const KEY_ITEMS = "items";
const KEY_MEMO = "memo";

export function toQueryString(q: DayReservationPrefillQuery): string {
  const sp = new URLSearchParams();
  sp.set(KEY_AI, q.ai);

  if (q.department) sp.set(KEY_DEPARTMENT, q.department);
  if (q.departmentMode) sp.set(KEY_DEPARTMENT_MODE, q.departmentMode);
  if (q.selectedDepartmentId)
    sp.set(KEY_SELECTED_DEPARTMENT_ID, q.selectedDepartmentId);
  if (q.time) sp.set(KEY_TIME, q.time);
  if (q.location) sp.set(KEY_LOCATION, q.location);
  if (q.amount) sp.set(KEY_AMOUNT, q.amount);
  if (q.items) sp.set(KEY_ITEMS, q.items);
  if (q.memo) sp.set(KEY_MEMO, q.memo);

  const s = sp.toString();
  return s ? `?${s}` : "";
}

function getOne(
  searchParams: URLSearchParams,
  key: string
): string | undefined {
  const v = searchParams.get(key);
  return safeParam(v);
}

export function parseDayReservationPrefillQuery(
  searchParams: URLSearchParams
): (DayReservationPrefillQuery & { parsedItems: PrefillItem[] | null }) | null {
  const ai = getOne(searchParams, KEY_AI);
  if (ai !== "1") return null;

  const department = getOne(searchParams, KEY_DEPARTMENT);
  const departmentModeRaw = getOne(searchParams, KEY_DEPARTMENT_MODE);
  const departmentMode =
    departmentModeRaw === "select" || departmentModeRaw === "direct"
      ? departmentModeRaw
      : undefined;

  const selectedDepartmentId = getOne(searchParams, KEY_SELECTED_DEPARTMENT_ID);

  const time = getOne(searchParams, KEY_TIME);
  const location = getOne(searchParams, KEY_LOCATION);
  const memo = getOne(searchParams, KEY_MEMO);

  const amount = digitsOnly(getOne(searchParams, KEY_AMOUNT));
  const itemsJson = getOne(searchParams, KEY_ITEMS);
  const parsedItems = safeParseItems(itemsJson);

  return {
    ai: "1",
    department,
    departmentMode,
    selectedDepartmentId,
    time,
    location,
    amount,
    items: itemsJson,
    memo,
    parsedItems,
  };
}

export function toPrefillKey(q: DayReservationPrefillQuery): string {
  return [
    q.ai,
    q.department ?? "",
    q.departmentMode ?? "",
    q.selectedDepartmentId ?? "",
    q.time ?? "",
    q.location ?? "",
    q.amount ?? "",
    q.items ?? "",
    q.memo ?? "",
  ].join("|");
}
