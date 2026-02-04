import type { ReservationIntent } from "./types";

export type PrefillItem = {
  menu: string;
  quantity: string; // digits only, can be "" if unknown
};

export type DayReservationPrefillQuery = {
  ai: "1";
  department?: string;
  time?: string;
  location?: string;
  amount?: string;
  items?: string; // JSON string of PrefillItem[]
  memo?: string;
};

const KEY_AI = "ai";
const KEY_DEPARTMENT = "department";
const KEY_TIME = "time";
const KEY_LOCATION = "location";
const KEY_AMOUNT = "amount";
const KEY_ITEMS = "items";
const KEY_MEMO = "memo";

function safeParam(v: string | null): string | undefined {
  if (!v) return undefined;
  const t = v.trim();
  return t ? t : undefined;
}

function digitsOnly(v: string | undefined): string | undefined {
  if (!v) return undefined;
  const out = v.replace(/[^\d]/g, "");
  return out ? out : undefined;
}

function toDigitsFromNumber(v: number | null): string | undefined {
  if (v === null) return undefined;
  if (!Number.isFinite(v)) return undefined;
  const n = Math.floor(v);
  if (n <= 0) return undefined;
  return String(n);
}

function removeKnownNoise(intent: ReservationIntent): string {
  let t = intent.raw_text;

  const dep = safeParam(intent.department);
  const loc = safeParam(intent.location);
  const time = safeParam(intent.time);

  if (dep) t = t.replaceAll(dep, " ");
  if (loc) t = t.replaceAll(loc, " ");
  if (time) t = t.replaceAll(time, " ");

  // 날짜 패턴 제거(대략)
  t = t
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, " ")
    .replace(/\b\d{1,2}[./]\d{1,2}\b/g, " ")
    .replace(/\b\d{1,2}\s*월\s*\d{1,2}\s*일\b/g, " ");

  // 금액 패턴 제거(대략)
  t = t
    .replace(/\b\d{1,3}(?:,\d{3})+\s*원\b/g, " ")
    .replace(/\b\d+\s*원\b/g, " ")
    .replace(/\b\d+\s*만원\b/g, " ")
    .replace(/\b\d+\s*천원\b/g, " ");

  return t.replace(/\s+/g, " ").trim();
}

function extractItemsFromText(text: string): PrefillItem[] {
  // 전역 매칭: (메뉴 텍스트) + (수량 숫자) + (단위) + (다음이 공백/콤마/끝)
  const re = /([^0-9,]+?)\s*(\d+)\s*(잔|개|명|건)(?=\s|,|$)/g;

  const out: PrefillItem[] = [];
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    const menuRaw = (m[1] ?? "").trim();
    const q = digitsOnly(m[2]) ?? "";

    // 메뉴 쪽 불필요 접미/접두 약간 정리
    const menu = menuRaw
      .replace(/^(오늘|내일|어제)\s*/g, "")
      .replace(/\s*(에서|으로|에)\s*$/g, "")
      .trim();

    if (!menu) continue;
    if (!q) continue;

    out.push({ menu, quantity: q });
  }

  return out;
}

function safeStringifyItems(items: PrefillItem[]): string | undefined {
  if (items.length === 0) return undefined;
  try {
    return JSON.stringify(items);
  } catch {
    return undefined;
  }
}

function safeParseItems(json: string | undefined): PrefillItem[] | null {
  if (!json) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }

  if (!Array.isArray(parsed)) return null;

  const out: PrefillItem[] = [];
  for (const it of parsed) {
    if (!it || typeof it !== "object") continue;
    const obj = it as Record<string, unknown>;
    const menu = typeof obj.menu === "string" ? obj.menu.trim() : "";
    const quantityRaw =
      typeof obj.quantity === "string"
        ? obj.quantity
        : String(obj.quantity ?? "");
    const quantity = digitsOnly(quantityRaw) ?? "";

    if (!menu) continue;
    out.push({ menu, quantity });
  }

  return out.length > 0 ? out : null;
}

export function buildDayReservationPrefillQuery(
  intent: ReservationIntent
): DayReservationPrefillQuery {
  const cleaned = removeKnownNoise(intent);
  const extracted = extractItemsFromText(cleaned);

  const items =
    extracted.length > 0
      ? extracted
      : intent.menu
      ? [{ menu: intent.menu, quantity: "" }]
      : [];

  return {
    ai: "1",
    department: safeParam(intent.department),
    time: safeParam(intent.time),
    location: safeParam(intent.location),
    amount: toDigitsFromNumber(intent.amount),
    items: safeStringifyItems(items),
    memo: safeParam(intent.memo),
  };
}

export function toQueryString(q: DayReservationPrefillQuery): string {
  const sp = new URLSearchParams();
  sp.set(KEY_AI, q.ai);

  if (q.department) sp.set(KEY_DEPARTMENT, q.department);
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
  if (!v) return undefined;
  const t = v.trim();
  return t ? t : undefined;
}

export function parseDayReservationPrefillQuery(
  searchParams: URLSearchParams
): (DayReservationPrefillQuery & { parsedItems: PrefillItem[] | null }) | null {
  const ai = getOne(searchParams, KEY_AI);
  if (ai !== "1") return null;

  const department = getOne(searchParams, KEY_DEPARTMENT);
  const time = getOne(searchParams, KEY_TIME);
  const location = getOne(searchParams, KEY_LOCATION);
  const memo = getOne(searchParams, KEY_MEMO);

  const amount = digitsOnly(getOne(searchParams, KEY_AMOUNT));
  const itemsJson = getOne(searchParams, KEY_ITEMS);
  const parsedItems = safeParseItems(itemsJson);

  return {
    ai: "1",
    department,
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
    q.time ?? "",
    q.location ?? "",
    q.amount ?? "",
    q.items ?? "",
    q.memo ?? "",
  ].join("|");
}
