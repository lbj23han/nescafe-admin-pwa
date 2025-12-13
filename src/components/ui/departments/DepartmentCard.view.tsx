"use client";

import type { ReactNode, FormHTMLAttributes } from "react";
import type { DepartmentHistory } from "@/lib/departmentStorage";
import { DEPARTMENT_CARD_COPY } from "@/constants/department";

type RootProps = {
  expanded: boolean;
  onClick: () => void;
  children: ReactNode;
};

type HeaderProps = {
  name: string;
  deposit: number;
  debt: number;
  expanded: boolean;
  onToggleClick: () => void;
};

type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
};
type HistoryListProps = {
  items: DepartmentHistory[];
  renderItem: (h: DepartmentHistory) => ReactNode;
};

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
  deposit,
  debt,
  expanded,
  onToggleClick,
}: HeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <h2 className="text-base font-semibold text-black">{name}</h2>
      </div>
      <div className="text-right text-xs text-zinc-700">
        <div>예치금 {deposit.toLocaleString()}원</div>
        <div className="text-[11px] text-zinc-500">
          미수금 {debt.toLocaleString()}원
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleClick();
          }}
          className="mt-1 inline-flex items-center rounded-full bg-zinc-100 px-2 py-[2px] text-[10px] text-zinc-600"
        >
          {expanded
            ? DEPARTMENT_CARD_COPY.toggle.collapse
            : DEPARTMENT_CARD_COPY.toggle.expand}
          <span className="ml-1 text-[9px]">{expanded ? "▲" : "▼"}</span>
        </button>
      </div>
    </div>
  );
}

export function ExpandedContainer({ children }: { children: ReactNode }) {
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
        입·출금 / 주문 기록 추가
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
      className={`w-full rounded-md border border-zinc-300 px-2 py-1 text-xs text-right placeholder:text-zinc-400 ${
        props.className ?? ""
      }`}
    />
  );
}

export function MemoInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-zinc-300 px-2 py-1 text-xs placeholder:text-zinc-400 ${
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

export function HistoryItem({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <li className="flex items-start justify-between gap-2 text-[11px]">
      {left}
      {right}
    </li>
  );
}
