"use client";

import type { ReactNode } from "react";
import { DEPARTMENT_CARD_COPY } from "@/constants/departments/card";
import type {
  RootProps,
  HeaderProps,
  ExpandedContainerProps,
  FormProps,
  HistoryListProps,
  HistoryItemProps,
  HistoryContentProps,
} from "./DepartmentCard.types";

export function Root({ expanded, onClick, children }: RootProps) {
  return (
    <div
      className={`
        border border-zinc-200 rounded-xl p-4 bg-white mb-3 transition-all cursor-pointer
        ${expanded ? "scale-[1.02] shadow-sm" : "scale-100"}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

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
              {editingName ? "이름 취소" : "이름 수정"}
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
              삭제
            </button>
          )}
        </div>

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

export function ExpandedContainer({ children }: ExpandedContainerProps) {
  return (
    <div
      className="mt-4 space-y-3"
      onClick={(e) => e.stopPropagation()} // 내부 클릭은 카드 토글 방지
    >
      {children}
    </div>
  );
}

export function FormContainer({ children, ...formProps }: FormProps) {
  const { className, ...rest } = formProps;

  return (
    <form
      {...rest}
      className={`p-3 border border-zinc-100 rounded-lg bg-zinc-50 space-y-3 ${
        className ?? ""
      }`}
    >
      <p className="text-[11px] font-semibold text-zinc-700">
        {DEPARTMENT_CARD_COPY.formTitle}
      </p>
      {children}
    </form>
  );
}

export function FormRow({ children }: { children: ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1 block text-[11px] text-zinc-500">{children}</label>
  );
}

export function SelectField(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-500 ${
        props.className ?? ""
      }`}
    />
  );
}

export function AmountInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-zinc-300
        px-2 py-1 text-xs text-zinc-500
        placeholder:text-zinc-500
        ${props.className ?? ""}
      `}
    />
  );
}

export function MemoInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-500 placeholder:text-zinc-400 ${
        props.className ?? ""
      }`}
    />
  );
}

export function SubmitButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={`w-full rounded-md bg-zinc-900 py-1.5 text-xs font-medium text-white ${
        props.className ?? ""
      }`}
    />
  );
}

export function TinyButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost";
  }
) {
  const { variant = "ghost", className, ...rest } = props;

  const base =
    "inline-flex items-center rounded-md px-2 py-1 text-[10px] font-medium";
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white"
      : "bg-zinc-100 text-zinc-700";

  return (
    <button {...rest} className={`${base} ${styles} ${className ?? ""}`} />
  );
}

export function HistoryContainer({ children }: { children: ReactNode }) {
  return (
    <div className="p-3 border border-zinc-100 rounded-lg">
      <h3 className="mb-2 text-xs font-semibold text-zinc-700">
        {DEPARTMENT_CARD_COPY.historyTitle}
      </h3>
      {children}
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
