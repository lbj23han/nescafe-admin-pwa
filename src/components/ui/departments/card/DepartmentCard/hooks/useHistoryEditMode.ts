"use client";

import { useState } from "react";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";

export function useHistoryEditMode({
  row,
}: {
  row: { editingId: string | null; dirty: boolean; reset: () => void };
}) {
  const [enabled, setEnabled] = useState(false);

  const toggle = () => {
    if (enabled && row.editingId && row.dirty) {
      const ok = window.confirm(
        DEPARTMENT_CARD_COPY.dialog.confirm.discardOnClose
      );
      if (!ok) return;
    }
    setEnabled((prev) => !prev);
    row.reset();
  };

  const reset = () => setEnabled(false);

  return { enabled, toggle, reset };
}
