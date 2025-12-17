"use client";

import type { ReactNode } from "react";

type ActionButtonVariant = "complete" | "cancel" | "edit";

export const DayUI = {
  Layout({ children }: { children: ReactNode }) {
    return (
      <div className="flex flex-col min-h-screen px-4 pt-5 pb-6">
        {children}
      </div>
    );
  },

  Main({ children }: { children: ReactNode }) {
    return <main className="flex-1">{children}</main>;
  },

  Section({ children }: { children: ReactNode }) {
    return <section className="mb-4">{children}</section>;
  },

  /** 상단 헤더 레이아웃 (좌측/우측 정렬) */
  HeaderRow({ children }: { children: ReactNode }) {
    return (
      <div className="flex items-center justify-between mb-4">{children}</div>
    );
  },

  /** 헤더 좌측 Back 버튼 */
  BackButton({
    children,
    onClick,
  }: {
    children: ReactNode;
    onClick: () => void;
  }) {
    return (
      <button onClick={onClick} className="text-xs text-black">
        {children}
      </button>
    );
  },

  /** 헤더 우측: 타이틀 + 날짜 묶음 */
  HeaderTitleBlock({ title, dateText }: { title: string; dateText: string }) {
    return (
      <div className="text-right">
        <p className="text-sm text-black">{title}</p>
        <p className="text-lg font-semibold text-black">{dateText}</p>
      </div>
    );
  },

  /** Day 헤더 완전체 */
  Header({
    backLabel,
    title,
    dateText,
    onBack,
  }: {
    backLabel: string;
    title: string;
    dateText: string;
    onBack: () => void;
  }) {
    return (
      <DayUI.HeaderRow>
        <DayUI.BackButton onClick={onBack}>{backLabel}</DayUI.BackButton>
        <DayUI.HeaderTitleBlock title={title} dateText={dateText} />
      </DayUI.HeaderRow>
    );
  },

  Label({ children }: { children: ReactNode }) {
    return <label className="block text-xs text-black mb-1">{children}</label>;
  },

  /** 라벨 + 인풋(혹은 다른 컴포넌트)을 묶는 필드 래퍼 */
  Field({ label, children }: { label: string; children: ReactNode }) {
    return (
      <div>
        <DayUI.Label>{label}</DayUI.Label>
        {children}
      </div>
    );
  },

  TextInput({
    value,
    onChange,
    placeholder,
    numeric,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    numeric?: boolean;
  }) {
    return (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-sm text-black placeholder:text-zinc-400"
        placeholder={placeholder}
        inputMode={numeric ? "numeric" : undefined}
      />
    );
  },

  PrimaryButton({
    children,
    onClick,
  }: {
    children: ReactNode;
    onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className="w-full h-11 rounded-xl bg-black text-white text-sm font-semibold shadow-sm active:scale-[0.99] transition"
      >
        {children}
      </button>
    );
  },

  ReservationCard({
    children,
    isCompleted,
  }: {
    children: ReactNode;
    isCompleted: boolean;
  }) {
    return (
      <li
        className={`border border-zinc-200 rounded-2xl px-3 py-2 text-xs mb-1 ${
          isCompleted ? "bg-zinc-200 opacity-80" : "bg-zinc-50"
        }`}
      >
        {children}
      </li>
    );
  },

  /** 카드 안의 타이틀 텍스트 (부서 · 메뉴) */
  ReservationTitle({ children }: { children: ReactNode }) {
    return <p className="font-medium text-black">{children}</p>;
  },

  /** 카드 안의 보조 정보 텍스트 (금액/시간/위치) */
  MetaText({ children }: { children: ReactNode }) {
    return <p className="mt-1 text-[11px] text-black">{children}</p>;
  },

  /** 상태 + 액션 버튼이 들어가는 하단 행 */
  FooterRow({ children }: { children: ReactNode }) {
    return (
      <div className="mt-2 flex items-center justify-between">{children}</div>
    );
  },

  /** 상태 텍스트 */
  StatusText({ children }: { children: ReactNode }) {
    return <span className="text-[11px] text-black">{children}</span>;
  },

  /** 액션 버튼 묶음 (완료/취소/수정 등) */
  ActionGroup({ children }: { children: ReactNode }) {
    return <div className="flex gap-2">{children}</div>;
  },

  /** 수정 모드일 때 카드 아래쪽 확장 영역 */
  EditSection({ children }: { children: ReactNode }) {
    return (
      <div className="mt-3 border-t border-zinc-200 pt-3 space-y-2">
        {children}
      </div>
    );
  },

  ActionButton({
    children,
    variant,
    disabled,
    onClick,
  }: {
    children: ReactNode;
    variant: ActionButtonVariant;
    disabled?: boolean;
    onClick: () => void;
  }) {
    const base = "px-2 py-1 rounded-lg text-[11px] border transition";

    let variantClass = "";

    if (variant === "complete") {
      variantClass = disabled
        ? "border-zinc-300 text-zinc-500 bg-zinc-100 cursor-default"
        : "border-emerald-500 text-emerald-700 bg-emerald-50";
    } else if (variant === "cancel") {
      variantClass = "border-red-400 text-red-600 bg-red-50";
    } else {
      // edit
      variantClass = "border-zinc-300 text-zinc-700 bg-zinc-100";
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${base} ${variantClass}`}
      >
        {children}
      </button>
    );
  },
};
