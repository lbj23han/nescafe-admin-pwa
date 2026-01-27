"use client";

import { useMemo, useState } from "react";
import { RESERVATION_UI } from "../reservation.ui";
import { DayUI } from "../../DayUI";
import { DAY_PAGE_COPY } from "@/constants/dayPage";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
};

function toHHmm(v: string) {
  const s = (v ?? "").trim();

  if (!s) return "";

  if (s.includes(":")) return s;

  const digits = s.replace(/[^\d]/g, "");
  if (digits.length === 3) {
    const h = digits.slice(0, 1);
    const m = digits.slice(1, 3);
    return `${h.padStart(2, "0")}:${m}`;
  }
  if (digits.length === 4) {
    const h = digits.slice(0, 2);
    const m = digits.slice(2, 4);
    return `${h}:${m}`;
  }
  return s;
}

function isActiveQuick(value: string, quick: string) {
  return (value ?? "").trim() === quick;
}

export function ReservationTimeField({
  value,
  onChange,
  placeholder,
  disabled = false,
}: Props) {
  const quick = useMemo(() => DAY_PAGE_COPY.form.time.quickOptions, []);
  const [open, setOpen] = useState(false);

  const handlePick = (t: string) => {
    onChange(t);
    setOpen(false);
  };

  return (
    <div className={RESERVATION_UI.timeFieldWrap}>
      {/* focus되었을 때만 칩 노출 */}
      <div
        onFocusCapture={() => setOpen(true)}
        onBlurCapture={() => setOpen(false)}
      >
        <DayUI.TextInput
          value={value}
          onChange={(v) => onChange(toHHmm(v))}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      {open && (
        <div
          className={RESERVATION_UI.timeChipsRow}
          aria-label="빠른 시간 선택"
        >
          {quick.map((t) => (
            <button
              key={t}
              type="button"
              className={
                isActiveQuick(value, t)
                  ? RESERVATION_UI.timeChipActive
                  : RESERVATION_UI.timeChip
              }
              // blur가 먼저 발생해서 open이 닫히는 걸 방지
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handlePick(t)}
              disabled={disabled}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
