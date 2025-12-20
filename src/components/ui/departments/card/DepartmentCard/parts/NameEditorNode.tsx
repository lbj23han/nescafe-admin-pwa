"use client";

import * as UI from "../DepartmentCardUI";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";

export function NameEditorNode({
  value,
  onChange,
  onSave,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-[220px] rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-900 placeholder:text-zinc-500"
        onClick={(e) => e.stopPropagation()}
      />
      <UI.TinyButton
        variant="primary"
        type="button"
        onClick={(e) => (e.stopPropagation(), onSave())}
      >
        {DEPARTMENT_CARD_COPY.headerAction.save}
      </UI.TinyButton>
    </div>
  );
}
