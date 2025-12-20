"use client";

import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import type {
  HistoryListProps,
  HistoryItemProps,
  HistoryContentProps,
  HistoryContainerProps,
} from "../../DepartmentCard.types";

export function HistoryContainer({
  title = DEPARTMENT_CARD_COPY.historyTitle,
  actions,
  children,
  editMode = false,
  stickyHeader = true,
}: HistoryContainerProps) {
  return (
    <div
      className={[
        "rounded-lg border p-3",
        editMode ? "border-zinc-300 bg-zinc-50" : "border-zinc-100 bg-white",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center justify-between",
          stickyHeader ? "sticky top-0 z-10 -mx-3 px-3 py-2" : "mb-2",
          editMode ? "bg-zinc-50" : "bg-white",
          stickyHeader ? "border-b border-zinc-100" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-zinc-700">{title}</h3>

          {editMode && (
            <span className="rounded-full bg-zinc-900 px-2 py-[2px] text-[10px] font-medium text-white">
              {DEPARTMENT_CARD_COPY.historyEdit.badge}
            </span>
          )}
        </div>

        {actions}
      </div>

      <div className={stickyHeader ? "pt-2" : ""}>{children}</div>
    </div>
  );
}

export function HistoryEmpty() {
  return (
    <p className="text-[11px] text-zinc-400">
      {DEPARTMENT_CARD_COPY.historyEmpty}
    </p>
  );
}

export function HistoryList({ items, renderItem }: HistoryListProps) {
  return (
    <ul className="space-y-2 max-h-56 overflow-y-auto">
      {items.map(renderItem)}
    </ul>
  );
}

export function HistoryItem({ left, right }: HistoryItemProps) {
  return (
    <li className="flex items-start justify-between gap-2 text-[11px]">
      {left}
      {right}
    </li>
  );
}

export function HistoryItemContent({
  typeLabel,
  memo,
  dateLabel,
  amountLabel,
  positive,
  actions,
}: HistoryContentProps) {
  return (
    <HistoryItem
      left={
        <div>
          <div className="font-medium text-zinc-700">{typeLabel}</div>
          {memo && <div className="text-zinc-600">{memo}</div>}
          <div className="text-[10px] text-zinc-400">{dateLabel}</div>
        </div>
      }
      right={
        <div className="flex flex-col items-end gap-1">
          <div
            className={`shrink-0 font-semibold ${
              positive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {amountLabel}
          </div>
          {actions}
        </div>
      }
    />
  );
}
