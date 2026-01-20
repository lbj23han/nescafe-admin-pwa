"use client";

import type { ReservationItem } from "@/hooks/reservation/internal/reservationItems";
import { ReservationItemRow } from "./ReservationItemRow";

type ItemWithId = ReservationItem & { id: string };

type Props = {
  items: ItemWithId[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onChangeItemField: (
    id: string,
    field: "menu" | "quantity" | "unitPrice",
    value: string
  ) => void;
};

export function ReservationItemsSection({
  items,
  onAddItem,
  onRemoveItem,
  onChangeItemField,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {items.map((it) => (
          <ReservationItemRow
            key={it.id}
            item={it}
            onChangeField={onChangeItemField}
            onDelete={onRemoveItem}
          />
        ))}
      </div>

      <button
        type="button"
        className="w-full h-10 rounded-xl border border-zinc-300 px-3 text-sm font-medium text-zinc-800 active:scale-[0.99]"
        onClick={onAddItem}
        aria-label="항목 추가"
      >
        + 추가
      </button>
    </div>
  );
}
