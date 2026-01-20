"use client";

import {
  computeItemsTotal,
  digitsOnly,
} from "@/hooks/reservation/internal/reservationItems";
import type { ReservationItem } from "@/hooks/reservation/internal/reservationItems";

type AmountMode = "auto" | "manual";

type Props = {
  items: ReservationItem[];
  amount: string;
  amountMode: AmountMode;
  onChangeAmount: (v: string) => void;
  onChangeAmountMode: (m: AmountMode) => void;
};

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR");
}

function toNumberLike(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function AmountSection({
  items,
  amount,
  amountMode,
  onChangeAmount,
  onChangeAmountMode,
}: Props) {
  const rawTotal = computeItemsTotal(items);
  const totalOrNull = toNumberLike(rawTotal);
  const total = totalOrNull ?? 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-black">총액</div>

          <div className="mt-1 text-base font-semibold text-black">
            {amountMode === "auto"
              ? totalOrNull == null
                ? "0원"
                : `${formatWon(total)}원`
              : `${amount || "0"}원`}
          </div>
        </div>

        {amountMode === "auto" ? (
          <button
            type="button"
            className="h-10 shrink-0 rounded-xl border border-zinc-300 px-3 text-sm font-medium text-zinc-800 active:scale-[0.99]"
            onClick={() => onChangeAmountMode("manual")}
          >
            편집
          </button>
        ) : (
          <button
            type="button"
            className="h-10 shrink-0 rounded-xl border border-zinc-300 px-3 text-sm font-medium text-zinc-800 active:scale-[0.99]"
            onClick={() => onChangeAmountMode("auto")}
          >
            자동
          </button>
        )}
      </div>

      {amountMode === "manual" && (
        <div className="mt-3">
          <label className="block text-xs text-black mb-1">수동 금액</label>
          <input
            inputMode="numeric"
            className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-sm text-black placeholder:text-zinc-400 outline-none focus:border-zinc-400 disabled:bg-zinc-50 disabled:text-zinc-500"
            value={amount}
            onChange={(e) => onChangeAmount(digitsOnly(e.target.value))}
            placeholder="예: 12000"
          />
        </div>
      )}
    </div>
  );
}
