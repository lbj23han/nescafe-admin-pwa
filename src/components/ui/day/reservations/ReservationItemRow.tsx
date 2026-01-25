"use client";

import { digitsOnly } from "@/hooks/reservation/internal/reservationItems";
import type { ReservationItem } from "@/hooks/reservation/internal/reservationItems";
import { RESERVATION_UI } from "./reservation.ui";

type ItemWithId = ReservationItem & { id: string };

type Props = {
  item: ItemWithId;
  disabled?: boolean;
  onChangeField: (
    id: string,
    field: "menu" | "quantity" | "unitPrice",
    value: string
  ) => void;
  onDelete: (id: string) => void;
};

export function ReservationItemRow({
  item,
  disabled = false,
  onChangeField,
  onDelete,
}: Props) {
  return (
    <div className={RESERVATION_UI.row}>
      <div className="flex-1 min-w-0">
        <input
          className={`${RESERVATION_UI.inputBase} ${RESERVATION_UI.inputMenu}`}
          value={item.menu}
          onChange={(e) => onChangeField(item.id, "menu", e.target.value)}
          placeholder="메뉴 (예: 아메리카노)"
          disabled={disabled}
        />
      </div>

      <div className={RESERVATION_UI.qtyWrap}>
        <input
          inputMode="numeric"
          className={`${RESERVATION_UI.inputBase} ${RESERVATION_UI.inputQty}`}
          value={item.quantity}
          onChange={(e) =>
            onChangeField(item.id, "quantity", digitsOnly(e.target.value))
          }
          placeholder="수량"
          disabled={disabled}
        />
      </div>

      <div className={RESERVATION_UI.priceWrap}>
        <input
          inputMode="numeric"
          className={`${RESERVATION_UI.inputBase} ${RESERVATION_UI.inputPrice}`}
          value={item.unitPrice}
          onChange={(e) =>
            onChangeField(item.id, "unitPrice", digitsOnly(e.target.value))
          }
          placeholder="단가(원)"
          disabled={disabled}
        />
      </div>

      <button
        type="button"
        className={RESERVATION_UI.deleteButton}
        onClick={() => onDelete(item.id)}
        disabled={disabled}
        aria-label="항목 삭제"
      >
        {RESERVATION_UI.deleteIcon}
      </button>
    </div>
  );
}
