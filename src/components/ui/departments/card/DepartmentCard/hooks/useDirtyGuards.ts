"use client";

import { useCallback } from "react";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import type { DepartmentCardProps } from "../../DepartmentCard.types";

export function useDirtyGuards({
  p,
  name,
  row,
}: {
  p: Pick<
    DepartmentCardProps,
    "expanded" | "onToggle" | "department" | "onDelete"
  >;
  name: { dirty: boolean };
  row: { dirty: boolean };
}) {
  // "name.dirty / row.dirty" 체이닝을 원시값으로 고정
  const nameDirty = name.dirty;
  const rowDirty = row.dirty;

  // 원시 deps로 고정
  const expanded = p.expanded;
  const onToggle = p.onToggle;
  const onDelete = p.onDelete;
  const departmentId = p.department.id;

  const confirmDiscard = useCallback(() => {
    if (!nameDirty && !rowDirty) return true;
    return window.confirm(DEPARTMENT_CARD_COPY.dialog.confirm.discardOnClose);
  }, [nameDirty, rowDirty]);

  const guardedToggle = useCallback(() => {
    if (expanded && !confirmDiscard()) return;
    onToggle();
  }, [expanded, onToggle, confirmDiscard]);

  const confirmSwitchHistory = useCallback(() => {
    return window.confirm(
      DEPARTMENT_CARD_COPY.dialog.confirm.discardOnSwitchHistory
    );
  }, []);

  const handleDelete = useCallback(() => {
    if (!onDelete) return;
    const ok = window.confirm(
      DEPARTMENT_CARD_COPY.dialog.confirm.deleteDepartment
    );
    if (!ok) return;
    onDelete(departmentId);
  }, [onDelete, departmentId]);

  return { confirmDiscard, confirmSwitchHistory, guardedToggle, handleDelete };
}
