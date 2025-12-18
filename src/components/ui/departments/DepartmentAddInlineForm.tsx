"use client";

import type React from "react";
import { PrimaryButton } from "@/components/PrimaryButton";

type Props = {
  inputRef?: React.RefObject<HTMLInputElement | null>;
  value: string;
  placeholder: string;
  submitText: string;
  canSubmit: boolean;
  onChange: (next: string) => void;
  onSubmit: () => void;
  onEscape: () => void;
};

export function DepartmentAddInlineForm({
  inputRef,
  value,
  placeholder,
  submitText,
  canSubmit,
  onChange,
  onSubmit,
  onEscape,
}: Props) {
  return (
    <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            flex-1 rounded-lg border border-zinc-300
            px-3 py-2 text-sm text-zinc-900
            placeholder:text-zinc-500
            focus:outline-none focus:ring-2 focus:ring-zinc-400
          "
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              onEscape();
            }
          }}
        />

        <PrimaryButton onClick={onSubmit} disabled={!canSubmit}>
          {submitText}
        </PrimaryButton>
      </div>
    </div>
  );
}
