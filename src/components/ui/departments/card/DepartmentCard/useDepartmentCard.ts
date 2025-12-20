"use client";

import { useMemo } from "react";
import type { DepartmentCardProps } from "../DepartmentCard.types";
import { useAddHistoryForm } from "./hooks/useAddHistoryForm";
import { useNameEditor } from "./hooks/useNameEditor";
import { useHistoryRowEditor } from "./hooks/useHistoryRowEditor";
import { useHistoryEditMode } from "./hooks/useHistoryEditMode";
import { useDirtyGuards } from "./hooks/useDirtyGuards";

export function useDepartmentCard(p: DepartmentCardProps) {
  const form = useAddHistoryForm(p);
  const name = useNameEditor(p); // toggle은 이제 () => void 버전이어야 함
  const row = useHistoryRowEditor(p); // start/cancel도 내부 confirm 처리 버전이어야 함
  const historyEditMode = useHistoryEditMode({ row });

  const guards = useDirtyGuards({
    p,
    name: { dirty: name.dirty },
    row: { dirty: row.dirty },
  });

  const history = useMemo(
    () => ({
      hasHistory: p.department.history.length > 0,
      reversed: p.department.history.slice().reverse(),
    }),
    [p.department.history]
  );

  return {
    guardedToggle: guards.guardedToggle,
    departmentDelete: guards.handleDelete,
    form,
    name,
    history,
    row,
    historyEditMode,
  };
}
