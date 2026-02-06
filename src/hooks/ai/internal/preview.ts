import type { ReservationIntent } from "./types";

function formatWon(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

function digitsOnly(v: string) {
  return (v ?? "").replace(/[^\d]/g, "");
}

type PreviewLineItem = {
  menu: string;
  quantity: string; // digits only or ""
  unitPrice: string; // digits only or ""
};

function extractLineItemsFromRawText(rawText: string): PreviewLineItem[] {
  const text = rawText.trim();
  if (!text) return [];

  // (메뉴)(수량)(단위)[(단가)원]
  const re =
    /([^0-9,]+?)\s*(\d+)\s*(잔|개|명|건)\s*(?:(\d{1,3}(?:,\d{3})+|\d+)\s*원)?(?=\s|,|$)/g;

  const out: PreviewLineItem[] = [];
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    const menu = (m[1] ?? "").trim();
    const q = digitsOnly(m[2] ?? "");
    const p = digitsOnly(m[4] ?? "");

    if (!menu) continue;
    if (!q) continue;

    out.push({
      menu,
      quantity: q,
      unitPrice: p,
    });
  }

  if (out.length > 0) return out;

  //  "아메 3000원" 같이 메뉴+단가만 있는 케이스 (보수적으로 1개만)
  const re2 = /([가-힣A-Za-z]+)\s*(\d{1,3}(?:,\d{3})+|\d+)\s*원/;
  const m2 = text.match(re2);
  if (!m2) return [];

  const menu = (m2[1] ?? "").trim();
  const p = digitsOnly(m2[2] ?? "");
  if (!menu || !p) return [];

  return [{ menu, quantity: "", unitPrice: p }];
}

function computeExpectedTotal(items: PreviewLineItem[]) {
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

function formatMenuWithUnitPrices(intent: ReservationIntent) {
  const items = extractLineItemsFromRawText(intent.raw_text);

  if (items.length === 0) {
    return intent.menu ?? "메뉴 미지정";
  }

  // 여러 줄로 보기 쉽게
  const parts = items.map((it) => {
    const q = it.quantity ? ` x${Number(it.quantity)}` : "";
    const p = it.unitPrice ? ` (${formatWon(Number(it.unitPrice))})` : "";
    return `${it.menu}${q}${p}`.trim();
  });

  return parts.join(", ");
}

export function toReservationPreviewText(intent: ReservationIntent) {
  const lines: string[] = [];

  const lineItems = extractLineItemsFromRawText(intent.raw_text);
  const expectedTotal =
    intent.amount == null ? computeExpectedTotal(lineItems) : null;

  lines.push("예약 등록 미리보기");
  lines.push(`- 날짜: ${intent.date}`);
  lines.push(`- 부서: ${intent.department ?? "부서 미지정"}`);
  lines.push(`- 메뉴: ${formatMenuWithUnitPrices(intent)}`);

  if (intent.amount == null) {
    if (expectedTotal != null) {
      lines.push(
        `- 금액: 총액은 입력되지 않았어요 (예상 합계: ${formatWon(
          expectedTotal
        )})`
      );
    } else {
      lines.push(`- 금액: 총액은 입력되지 않았어요`);
    }
  } else {
    lines.push(`- 금액: ${formatWon(intent.amount)}`);
  }

  lines.push(`- 시간: ${intent.time ?? "시간 없음"}`);
  lines.push(`- 장소: ${intent.location ?? "장소 없음"}`);

  if (intent.memo) lines.push(`- 메모: ${intent.memo}`);

  if (intent.warnings?.length) {
    lines.push("");
    lines.push("⚠️ 확인 필요");
    for (const w of intent.warnings) lines.push(`- ${w}`);
  }

  if (intent.assumptions?.length) {
    lines.push("");
    lines.push("ℹ️ 해석 근거");
    for (const a of intent.assumptions) lines.push(`- ${a}`);
  }

  return lines.join("\n");
}
