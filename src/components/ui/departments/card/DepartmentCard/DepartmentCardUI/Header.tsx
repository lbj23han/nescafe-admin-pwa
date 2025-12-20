"use client";

import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import type { HeaderProps } from "../../DepartmentCard.types";

export function Header({
  name,
  nameNode,
  deposit,
  debt,
  expanded,
  onToggleClick,
  onDeleteClick,
  onEditNameToggleClick,
  editingName,
}: HeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        {nameNode ?? (
          <h2 className="text-base font-semibold text-black">{name}</h2>
        )}
      </div>

      <div className="text-right text-xs text-zinc-700">
        {(onEditNameToggleClick || onDeleteClick) && (
          <div className="flex items-center justify-end gap-2">
            {onEditNameToggleClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditNameToggleClick();
                }}
                className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-[2px] text-[10px] text-zinc-600"
              >
                {editingName
                  ? DEPARTMENT_CARD_COPY.headerAction.cancelEditName
                  : DEPARTMENT_CARD_COPY.headerAction.editName}
              </button>
            )}

            {onDeleteClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick();
                }}
                className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-[2px] text-[10px] text-zinc-600"
              >
                {DEPARTMENT_CARD_COPY.headerAction.deleteDepartment}
              </button>
            )}
          </div>
        )}

        <div className="mt-2">
          {DEPARTMENT_CARD_COPY.summary.depositPrefix}{" "}
          {deposit.toLocaleString()}
          {DEPARTMENT_CARD_COPY.summary.currencySuffix}
        </div>

        <div className="text-[11px] text-zinc-500">
          {DEPARTMENT_CARD_COPY.summary.debtPrefix} {debt.toLocaleString()}
          {DEPARTMENT_CARD_COPY.summary.currencySuffix}
        </div>

        <div className="mt-1 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleClick();
            }}
            className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-[2px] text-[10px] text-zinc-600"
          >
            {expanded
              ? DEPARTMENT_CARD_COPY.toggle.collapse
              : DEPARTMENT_CARD_COPY.toggle.expand}
            <span className="ml-1 text-[9px]">
              {expanded
                ? DEPARTMENT_CARD_COPY.toggle.icon.expanded
                : DEPARTMENT_CARD_COPY.toggle.icon.collapsed}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
