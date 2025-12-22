"use client";

import { useCallback, useMemo, useState, useRef } from "react";
import type { DepartmentCardProps } from "../../DepartmentCard.types";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import { DepartmentsRepo } from "@/lib/data";

export function useNameEditor(
  p: Pick<DepartmentCardProps, "department" | "onChange">
) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(p.department.name);
  const [loading, setLoading] = useState(false);

  const savingRef = useRef(false);

  const dirty = useMemo(() => {
    if (!editing) return false;
    const t = draft.trim();
    return t.length > 0 && t !== p.department.name;
  }, [draft, editing, p.department.name]);

  const save = useCallback(async () => {
    const t = draft.trim();
    if (!t) {
      alert(DEPARTMENT_CARD_COPY.dialog.alert.nameRequired);
      return;
    }
    if (savingRef.current) return;

    try {
      savingRef.current = true;
      setLoading(true);

      // 서버 반영
      const updated = await DepartmentsRepo.renameDepartment(p.department, t);

      // UI에 반영 (history는 유지)
      p.onChange({
        ...p.department,
        ...updated,
        history: p.department.history,
      });

      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("부서명 저장에 실패했습니다.");
    } finally {
      savingRef.current = false;
      setLoading(false);
    }
  }, [draft, p]);

  const toggle = useCallback(() => {
    if (editing) {
      if (dirty) {
        const ok = window.confirm(
          DEPARTMENT_CARD_COPY.dialog.confirm.discardOnClose
        );
        if (!ok) return;
      }
      setEditing(false);
      return;
    }

    setDraft(p.department.name);
    setEditing(true);
  }, [editing, dirty, p.department.name]);

  const reset = useCallback(() => {
    setEditing(false);
    setDraft(p.department.name);
  }, [p.department.name]);

  return { editing, draft, setDraft, dirty, save, toggle, reset, loading };
}
