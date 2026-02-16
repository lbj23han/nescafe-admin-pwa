import type { ReservationIntent } from "./types";
import { removeRelativeDateNoise } from "./textNoise";

export type PrefillItem = {
  menu: string;
  quantity: string; // digits only, can be "" if unknown
  unitPrice?: string; // digits only (optional)
};

export type DayReservationPrefillQuery = {
  ai: "1";
  department?: string;
  departmentMode?: "select" | "direct";
  selectedDepartmentId?: string;
  time?: string;
  location?: string;
  amount?: string;
  items?: string; // JSON string of PrefillItem[]
  memo?: string;
};

const KEY_AI = "ai";
const KEY_DEPARTMENT = "department";
const KEY_DEPARTMENT_MODE = "departmentMode";
const KEY_SELECTED_DEPARTMENT_ID = "selectedDepartmentId";
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

function normalizeKoreanWon(text: string) {
  let t = text;
  t = t.replace(/(\d+)\s*천\s*원/g, (_, n) => `${Number(n) * 1000}원`);
  t = t.replace(/(\d+)\s*만\s*원/g, (_, n) => `${Number(n) * 10000}원`);
  t = t.replace(/(\d+)\s*백\s*원/g, (_, n) => `${Number(n) * 100}원`);
  return t;
}

/**
 * 총액 키워드가 명시된 경우만 amount로 인정
 */
function hasExplicitTotal(text: string) {
  return /(총액|합계|총\s*금액|총\s*계|총\s*[:：]?)/.test(text);
}

function sanitizeForItemParsing(text: string) {
  let t = normalizeKoreanWon(text);

  // 라벨류 제거 (부서/장소/시간/메모 등)
  t = t
    .replace(/(^|\s)(부서|장소|위치|시간|메모)\s*[:：]\s*/g, " ")
    .replace(/\s+/g, " ");

  t = removeRelativeDateNoise(t);

  // 절대 날짜 제거
  t = t
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, " ")
    .replace(/\b\d{1,2}\s*[./-]\s*\d{1,2}\b/g, " ")
    .replace(/\b\d{1,2}\s*월\s*\d{1,2}\s*일\b/g, " ");

  // 시간 제거 (한글 경계 문제로 "시" 남는 것 방지)
  t = t
    .replace(/(?:^|[\s,])\d{1,2}\s*:\s*\d{2}(?=\s|,|$)/g, " ")
    .replace(
      /(?:^|[\s,])(오전|오후)\s*\d{1,2}\s*시(\s*\d{1,2}\s*분)?(?=\s|,|$)/g,
      " "
    )
    .replace(/(?:^|[\s,])\d{1,2}\s*시(\s*\d{1,2}\s*분)?(?=\s|,|$)/g, " ");

  return t.replace(/\s+/g, " ").trim();
}

function inferDepartmentFromLocation(intent: ReservationIntent): string | null {
  const dep = (intent.department ?? "").trim();
  if (dep) return null;

  const loc = (intent.location ?? "").trim();
  if (!loc) return null;

  const cleaned = sanitizeForItemParsing(intent.raw_text);
  if (!cleaned) return null;

  const first = cleaned.split(/\s+/)[0] ?? "";
  if (!first) return null;

  if (first === loc) return loc;
  return null;
}

function removeKnownNoise(intent: ReservationIntent): string {
  let t = intent.raw_text;

  const inferredDept = inferDepartmentFromLocation(intent);

  const dep = safeParam(intent.department) ?? inferredDept ?? undefined;
  const locRaw = safeParam(intent.location);

  // location이 inferredDept와 동일하면 "장소"로 취급하지 않음
  const loc =
    inferredDept && locRaw === inferredDept ? undefined : locRaw ?? undefined;

  const time = safeParam(intent.time);

  // 값 자체 제거(모델이 뽑아준 값이 raw_text에 그대로 있을 때)
  if (dep) t = t.replaceAll(dep, " ");
  if (loc) t = t.replaceAll(loc, " ");
  if (time) t = t.replaceAll(time, " ");

  // 라벨/시간/날짜 등 일반 노이즈 제거 (+ 상대날짜 제거 포함)
  t = sanitizeForItemParsing(t);

  return t.replace(/\s+/g, " ").trim();
}

function stripLeadingToken(menu: string, token: string) {
  const m = menu.trim();
  const t = token.trim();
  if (!m || !t) return m;

  if (m === t) return "";
  if (m.startsWith(`${t} `)) return m.slice(t.length).trim();
  return m;
}

/**
 * 전역 매칭:
 * (메뉴 텍스트) + (수량 숫자) + (단위) + [옵션: (단가/개당/@) + (금액)원]
 */
function extractItemsFromText(
  text: string,
  leadingStripToken?: string
): PrefillItem[] {
  const t = normalizeKoreanWon(text);

  const re =
    /([^0-9,]+?)\s*(\d+)\s*(잔|개|명|건)\s*(?:(?:단가|개당|@)\s*)?(?:(\d{1,3}(?:,\d{3})+|\d+)\s*원)?(?=\s|,|$)/g;

  const out: PrefillItem[] = [];
  let m: RegExpExecArray | null;

  while ((m = re.exec(t)) !== null) {
    const menuRaw = (m[1] ?? "").trim();
    const q = digitsOnly(m[2]) ?? "";
    const p = digitsOnly(m[4]);

    let menu = menuRaw
      // ✅ 단일 상대토큰 확장
      .replace(/^(오늘|내일|모레|어제)\s*/g, "")
      .replace(/\s*(에서|으로|에)\s*$/g, "")
      .trim();

    if (leadingStripToken) {
      menu = stripLeadingToken(menu, leadingStripToken);
    }

    if (!menu) continue;
    if (!q) continue;

    out.push({
      menu,
      quantity: q,
      ...(p ? { unitPrice: p } : {}),
    });
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
    const unitPriceRaw =
      typeof obj.unitPrice === "string"
        ? obj.unitPrice
        : String(obj.unitPrice ?? "");

    const quantity = digitsOnly(quantityRaw) ?? "";
    const unitPrice = digitsOnly(unitPriceRaw);

    if (!menu) continue;

    out.push({
      menu,
      quantity,
      ...(unitPrice ? { unitPrice } : {}),
    });
  }

  return out.length > 0 ? out : null;
}

export function buildDayReservationPrefillQuery(
  intent: ReservationIntent,
  extra?: {
    departmentMode?: "select" | "direct";
    selectedDepartmentId?: string;
  }
): DayReservationPrefillQuery {
  const inferredDept = inferDepartmentFromLocation(intent);

  const effectiveDepartment =
    safeParam(intent.department) ?? inferredDept ?? undefined;

  const effectiveLocationRaw = safeParam(intent.location);
  const effectiveLocation =
    inferredDept && effectiveLocationRaw === inferredDept
      ? undefined
      : effectiveLocationRaw;

  const cleaned = removeKnownNoise(intent);
  const leadingStripToken = inferredDept ?? undefined;
  const extracted = extractItemsFromText(cleaned, leadingStripToken);

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
