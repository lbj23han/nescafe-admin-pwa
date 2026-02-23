import type { ReservationIntent } from "../../types";
import { removeRelativeDateNoise } from "../../utils/textNoise";
import { digitsOnly, formatWon } from "./format";

type PreviewLineItem = {
  menu: string;
  quantity: string; // digits only or ""
  unitPrice: string; // digits only or ""
};

function safeParam(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t ? t : null;
}

function removeKnownNoise(intent: ReservationIntent) {
  let t = intent.raw_text ?? "";

  const dep = safeParam(intent.department);
  const loc = safeParam(intent.location);
  const time = safeParam(intent.time);

  if (dep) t = t.replaceAll(dep, " ");
  if (loc) t = t.replaceAll(loc, " ");
  if (time) t = t.replaceAll(time, " ");

  return t.replace(/\s+/g, " ").trim();
}

function sanitizeForItemParsing(rawText: string) {
  let t = rawText;

  t = t.replace(/(^|\s)(부서|장소|위치|시간|메모)\s*[:：]\s*/g, " ");
  t = removeRelativeDateNoise(t);

  t = t
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, " ")
    .replace(/\b\d{1,2}\s*[./-]\s*\d{1,2}\b/g, " ")
    .replace(/\b\d{1,2}\s*월\s*\d{1,2}\s*일\b/g, " ");

  t = t
    .replace(/(?:^|[\s,])\d{1,2}\s*:\s*\d{2}(?=\s|,|$)/g, " ")
    .replace(
      /(?:^|[\s,])(오전|오후)\s*\d{1,2}\s*시(\s*\d{1,2}\s*분)?(?=\s|,|$)/g,
      " "
    )
    .replace(/(?:^|[\s,])\d{1,2}\s*시(\s*\d{1,2}\s*분)?(?=\s|,|$)/g, " ");

  return t.replace(/\s+/g, " ").trim();
}

export function extractLineItemsFromRawText(
  intent: ReservationIntent
): PreviewLineItem[] {
  const noKnown = removeKnownNoise(intent);
  const text = sanitizeForItemParsing(noKnown);
  if (!text) return [];

  const re =
    /([^0-9,]+?)\s*(\d+)\s*(잔|개|명|건)\s*(?:(?:단가|개당|@)\s*)?(?:(\d{1,3}(?:,\d{3})+|\d+)\s*원)?(?=\s|,|$)/g;

  const out: PreviewLineItem[] = [];
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    const menuRaw = (m[1] ?? "").trim();
    const q = digitsOnly(m[2] ?? "");
    const p = digitsOnly(m[4] ?? "");
    if (!menuRaw || !q) continue;
    out.push({ menu: menuRaw, quantity: q, unitPrice: p });
  }

  if (out.length > 0) return out;

  const re2 = /([가-힣A-Za-z]+)\s*(\d{1,3}(?:,\d{3})+|\d+)\s*원/;
  const m2 = text.match(re2);
  if (!m2) return [];

  const menu = (m2[1] ?? "").trim();
  const p = digitsOnly(m2[2] ?? "");
  if (!menu || !p) return [];

  return [{ menu, quantity: "", unitPrice: p }];
}

export function computeExpectedTotal(items: PreviewLineItem[]) {
  let total = 0;
  for (const it of items) {
    const q = Number(digitsOnly(it.quantity));
    const p = Number(digitsOnly(it.unitPrice));
    if (!Number.isFinite(q) || q <= 0) continue;
    if (!Number.isFinite(p) || p <= 0) continue;
    total += q * p;
  }
  return total > 0 ? total : null;
}

export function formatMenuWithUnitPrices(intent: ReservationIntent) {
  const items = extractLineItemsFromRawText(intent);
  if (items.length === 0) return intent.menu ?? "메뉴 미지정";

  return items
    .map((it) => {
      const q = it.quantity ? ` x${Number(it.quantity)}` : "";
      const p = it.unitPrice ? ` (${formatWon(Number(it.unitPrice))})` : "";
      return `${it.menu}${q}${p}`.trim();
    })
    .join(", ");
}
