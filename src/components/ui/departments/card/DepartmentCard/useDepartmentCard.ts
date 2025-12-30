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
  const name = useNameEditor(p);
  const row = useHistoryRowEditor(p);
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
