"use client";

import { useCallback, useMemo, useState } from "react";
import { renameDepartment } from "@/lib/departmentStorage";
import type { DepartmentCardProps } from "../../DepartmentCard.types";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";

export function useNameEditor(
  p: Pick<DepartmentCardProps, "department" | "onChange">
) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(p.department.name);

  // ✅ dirty는 "편집 중"일 때만 의미 있음
  const dirty = useMemo(() => {
    if (!editing) return false;
    const t = draft.trim();
    return t.length > 0 && t !== p.department.name;
  }, [draft, editing, p.department.name]);

  const save = useCallback(() => {
    const t = draft.trim();
    if (!t) {
      alert(DEPARTMENT_CARD_COPY.dialog.alert.nameRequired);
      return;
    }
    p.onChange(renameDepartment(p.department, t));
    setEditing(false);
  }, [draft, p]);

  // ✅ effect로 동기화하지 말고, "편집 켤 때"만 draft를 최신 name으로 초기화
  const toggle = useCallback(() => {
    if (editing) {
      // 끄려는데 dirty면 경고
      if (dirty) {
        const ok = window.confirm(
          DEPARTMENT_CARD_COPY.dialog.confirm.discardOnClose
        );
        if (!ok) return;
      }
      setEditing(false);
      return;
    }

    // 켤 때: 최신 name으로 draft 초기화
    setDraft(p.department.name);
    setEditing(true);
  }, [editing, dirty, p.department.name]);

  const reset = useCallback(() => {
    setEditing(false);
    // reset은 편집 중에만 의미 있지만, 안전하게 최신값 넣어둠
    setDraft(p.department.name);
  }, [p.department.name]);

  return { editing, draft, setDraft, dirty, save, toggle, reset };
}
