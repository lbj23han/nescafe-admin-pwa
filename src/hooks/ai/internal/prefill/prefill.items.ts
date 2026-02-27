import { digitsOnly } from "./prefill.utils";
import { normalizeWonText, stripLeadingToken } from "./prefill.text";
import type { PrefillItem } from "./prefill.types";

/**
 * 전역 매칭:
 * (메뉴 텍스트) + (수량 숫자) + (단위) + [옵션: (단가/개당/@) + (금액)원]
 */
export function extractItemsFromText(
  text: string,
  leadingStripToken?: string
): PrefillItem[] {
  const t = normalizeWonText(text);

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

    out.push({ menu, quantity: q, ...(p ? { unitPrice: p } : {}) });
  }

  return out;
}

export function safeStringifyItems(items: PrefillItem[]): string | undefined {
  if (items.length === 0) return undefined;
  try {
    return JSON.stringify(items);
  } catch {
    return undefined;
  }
}

export function safeParseItems(json: string | undefined): PrefillItem[] | null {
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

    out.push({ menu, quantity, ...(unitPrice ? { unitPrice } : {}) });
  }

  return out.length > 0 ? out : null;
}
