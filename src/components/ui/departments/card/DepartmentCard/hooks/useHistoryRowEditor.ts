"use client";

import { useMemo, useState, useCallback } from "react";
import {
  updateHistory,
  type HistoryType,
} from "@/lib/storage/departments.local";
import type {
  DepartmentCardProps,
  HistoryEditDraft,
} from "../../DepartmentCard.types";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";

export function useHistoryRowEditor(
  p: Pick<DepartmentCardProps, "department" | "onChange">
) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<HistoryEditDraft>({
    type: "deposit",
    amount: "",
    memo: "",
  });

  const original = useMemo(() => {
    if (!editingId) return null;
    return p.department.history.find((h) => h.id === editingId) ?? null;
  }, [p.department.history, editingId]);

  const dirty = useMemo(() => {
    if (!editingId || !original) return false;

    const da = Number(draft.amount);
    const oa = Number(original.amount);

    const dm = (draft.memo ?? "").trim();
    const om = (original.memo ?? "").trim();

    return (
      draft.type !== original.type ||
      (Number.isFinite(da) ? da : NaN) !== oa ||
      dm !== om
    );
  }, [draft, editingId, original]);

  // ✅ onStartEdit: (id: string) => void 로 맞춤
  const start = useCallback(
    (id: string) => {
      // 다른 row로 넘어가기 전에 dirty면 경고
      if (editingId && editingId !== id && dirty) {
        const ok = window.confirm(
          DEPARTMENT_CARD_COPY.dialog.confirm.discardOnSwitchHistory
        );
        if (!ok) return;
      }

      const t = p.department.history.find((h) => h.id === id);
      if (!t) return;

      setEditingId(id);
      setDraft({
        type: t.type,
        amount: String(t.amount ?? ""),
        memo: t.memo ?? "",
      });
    },
    [editingId, dirty, p.department.history]
  );

  // ✅ onCancel: () => void 로 맞춤
  const cancel = useCallback(() => {
    // 취소 시에도 dirty면 경고
    if (dirty) {
      const ok = window.confirm(
        DEPARTMENT_CARD_COPY.dialog.confirm.discardOnClose
      );
      if (!ok) return;
    }
    setEditingId(null);
  }, [dirty]);

  const save = useCallback(() => {
    if (!editingId) return;

    const parsed = Number(draft.amount);
    if (!parsed || parsed <= 0) {
      alert(DEPARTMENT_CARD_COPY.dialog.alert.amountMustBePositive);
      return;
    }

    p.onChange(
      updateHistory(p.department, editingId, {
        type: draft.type as HistoryType,
        amount: parsed,
        memo: draft.memo,
      })
    );

    setEditingId(null);
  }, [draft, editingId, p]);

  const reset = useCallback(() => {
    setEditingId(null);
  }, []);

  return { editingId, draft, setDraft, dirty, start, cancel, save, reset };
}
