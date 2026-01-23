"use client";

import type { ReservationItem } from "@/hooks/reservation/internal/reservationItems";
import { ReservationItemRow } from "./ReservationItemRow";
import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { RESERVATION_UI } from "./reservation.ui";

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
    <div className={RESERVATION_UI.stack2}>
      <div className={RESERVATION_UI.stack2}>
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
        className={RESERVATION_UI.addRowButton}
        onClick={onAddItem}
        aria-label={DAY_PAGE_COPY.buttons.addRow}
      >
        {DAY_PAGE_COPY.buttons.addRow}
      </button>
    </div>
  );
}
