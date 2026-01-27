import type { ReservationItem } from "./reservationItems";

type ItemWithId = ReservationItem & { id: string };

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function parseMenuToItems(menu: string): ItemWithId[] {
  const text = (menu ?? "").trim();
  if (!text) {
    return [{ id: makeId(), menu: "", quantity: "", unitPrice: "" }];
  }

  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => {
      const m = p.match(/^(.*?)(?:\s*x(\d+))?(?:\((\d+)\))?\s*$/);
      return {
        id: makeId(),
        menu: (m?.[1] ?? p).trim(),
        quantity: m?.[2] ? String(Number(m[2])) : "",
        unitPrice: m?.[3] ? String(Number(m[3])) : "",
      };
    });
}
