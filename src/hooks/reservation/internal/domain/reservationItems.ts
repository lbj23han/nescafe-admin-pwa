export type ReservationItem = {
  menu: string;
  quantity: string;
  unitPrice: string;
};

export function digitsOnly(v: string): string {
  return (v ?? "").replace(/[^\d]/g, "");
}

function toPosInt(v: string): number {
  const n = Number(digitsOnly(v));
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

export function computeItemsTotal(items: Array<ReservationItem>): string {
  let total = 0;
  for (const it of items) {
    const q = toPosInt(it.quantity);
    const p = toPosInt(it.unitPrice);
    total += q * p;
  }
  return total > 0 ? String(total) : "";
}

export function serializeItemsToMenu(
  items: Array<ReservationItem & { id?: string }>
): string {
  // 기존 DB 호환용 menu 문자열 생성
  // 포맷 예시: "아메리카노 x2(4500), 라떼 x1(5000)"
  const parts: string[] = [];

  for (const it of items) {
    const name = (it.menu ?? "").trim();
    if (!name) continue;

    const q = toPosInt(it.quantity);
    const p = toPosInt(it.unitPrice);

    if (q > 0 && p > 0) parts.push(`${name} x${q}(${p})`);
    else if (q > 0) parts.push(`${name} x${q}`);
    else parts.push(name);
  }

  return parts.join(", ").trim();
}
