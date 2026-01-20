"use client";

import { digitsOnly } from "@/hooks/reservation/internal/reservationItems";
import type { ReservationItem } from "@/hooks/reservation/internal/reservationItems";

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
  const baseInput =
    "h-10 rounded-xl border border-zinc-200 text-sm text-black placeholder:text-zinc-400 outline-none focus:border-zinc-400 disabled:bg-zinc-50 disabled:text-zinc-500";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <input
          className={`${baseInput} w-full px-3`}
          value={item.menu}
          onChange={(e) => onChangeField(item.id, "menu", e.target.value)}
          placeholder="메뉴 (예: 아메리카노)"
          disabled={disabled}
        />
      </div>

      <div className="w-12 shrink-0">
        <input
          inputMode="numeric"
          className={`${baseInput} w-full px-2 text-center`}
          value={item.quantity}
          onChange={(e) =>
            onChangeField(item.id, "quantity", digitsOnly(e.target.value))
          }
          placeholder="수량"
          disabled={disabled}
        />
      </div>

      <div className="w-20 shrink-0">
        <input
          inputMode="numeric"
          className={`${baseInput} w-full px-2 text-center`}
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
        className="
    h-10 w-10 shrink-0
    rounded-xl border border-zinc-300
    text-lg font-semibold text-zinc-600
    hover:text-zinc-800
    active:scale-[0.96]
    disabled:opacity-40
  "
        onClick={() => onDelete(item.id)}
        disabled={disabled}
        aria-label="항목 삭제"
      >
        ×
      </button>
    </div>
  );
}
