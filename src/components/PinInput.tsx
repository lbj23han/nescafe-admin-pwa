// components/PinInput.tsx
"use client";

import { useState } from "react";

type Props = {
  onSubmit: () => void;
};

const CORRECT_PIN = "4976";

export function PinInput({ onSubmit }: Props) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleChange = (value: string) => {
    const onlyNumber = value.replace(/\D/g, "").slice(0, 4);
    setPin(onlyNumber);
    setError("");
  };

  const handleConfirm = () => {
    if (pin === CORRECT_PIN) {
      if (typeof window !== "undefined") {
        localStorage.setItem("cafe-ledger-authed", "true");
      }
      onSubmit();
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="w-full">
      {/* 라벨 */}
      <label className="block text-sm mb-3 text-black">비밀번호 (4자리)</label>

      {/* 비밀번호 칸 */}
      <div
        className="flex gap-3 mb-4"
        onClick={() => {
          const input = document.getElementById("hidden-pin-input");
          input?.focus();
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-12 rounded-xl border border-zinc-200 flex items-center justify-center text-xl font-medium tracking-widest text-black"
          >
            {pin[i] ?? ""}
          </div>
        ))}
      </div>

      <input
        id="hidden-pin-input"
        type="tel"
        inputMode="numeric"
        value={pin}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleConfirm();
        }}
        className="opacity-0 pointer-events-none absolute"
      />

      {/* 에러 메시지 */}
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      {/* 버튼 */}
      <button
        onClick={handleConfirm}
        disabled={pin.length < 4}
        className="w-full h-12 rounded-xl bg-black text-white text-base font-medium disabled:opacity-40"
      >
        들어가기
      </button>
    </div>
  );
}
