"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import type {
  DepartmentCardProps,
  HistoryEditDraft,
} from "../../DepartmentCard.types";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import { DepartmentHistoryRepo } from "@/lib/data";
import type { HistoryType } from "@/lib/storage/departments.local";

export function useHistoryRowEditor(
  p: Pick<DepartmentCardProps, "department" | "onChange">
) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<HistoryEditDraft>({
    type: "deposit",
    amount: "",
    memo: "",
  });
  const [loading, setLoading] = useState(false);

  const savingRef = useRef(false);

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

  const start = useCallback(
    (id: string) => {
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

  const cancel = useCallback(() => {
    if (dirty) {
      const ok = window.confirm(
        DEPARTMENT_CARD_COPY.dialog.confirm.discardOnClose
      );
      if (!ok) return;
    }
    setEditingId(null);
  }, [dirty]);

  const save = useCallback(async () => {
    if (!editingId) return;
    if (savingRef.current) return;

    const parsed = Number(draft.amount);
    if (!parsed || parsed <= 0) {
      alert(DEPARTMENT_CARD_COPY.dialog.alert.amountMustBePositive);
      return;
    }

    try {
      savingRef.current = true;
      setLoading(true);

      const res = await DepartmentHistoryRepo.updateDepartmentHistory({
        departmentId: p.department.id,
        historyId: editingId,
        patch: {
          type: draft.type as HistoryType,
          amount: parsed,
          memo: draft.memo,
        },
      });

      p.onChange({
        ...p.department,
        deposit: res.next.deposit,
        debt: res.next.debt,
        history: res.next.history,
      });

      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("내역 수정에 실패했습니다.");
    } finally {
      savingRef.current = false;
      setLoading(false);
    }
  }, [draft, editingId, p]);

  const reset = useCallback(() => {
    setEditingId(null);
  }, []);

  return {
    editingId,
    draft,
    setDraft,
    dirty,
    start,
    cancel,
    save,
    reset,
    loading,
  };
}
