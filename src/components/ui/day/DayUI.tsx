"use client";

import type { ReactNode } from "react";

type ActionButtonVariant = "complete" | "cancel" | "edit";
type SheetActionVariant = "primary" | "secondary";

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

  HeaderRow({ children }: { children: ReactNode }) {
    return (
      <div className="flex items-center justify-between mb-4">{children}</div>
    );
  },

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

  HeaderTitleBlock({ title, dateText }: { title: string; dateText: string }) {
    return (
      <div className="text-right">
        <p className="text-sm text-black">{title}</p>
        <p className="text-lg font-semibold text-black">{dateText}</p>
      </div>
    );
  },

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

  ReservationTitle({ children }: { children: ReactNode }) {
    return <p className="font-medium text-black">{children}</p>;
  },

  MetaText({ children }: { children: ReactNode }) {
    return <p className="mt-1 text-[11px] text-black">{children}</p>;
  },

  FooterRow({ children }: { children: ReactNode }) {
    return (
      <div className="mt-2 flex items-center justify-between">{children}</div>
    );
  },

  StatusText({ children }: { children: ReactNode }) {
    return <span className="text-[11px] text-black">{children}</span>;
  },

  ActionGroup({ children }: { children: ReactNode }) {
    return <div className="flex gap-2">{children}</div>;
  },

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

  SheetOverlay({
    children,
    onBackdropClick,
  }: {
    children: ReactNode;
    onBackdropClick: () => void;
  }) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) onBackdropClick();
        }}
      >
        {children}
      </div>
    );
  },

  SheetContainer({ children }: { children: ReactNode }) {
    return (
      <div className="w-[80vw] max-w-[480px] max-h-[80vh] overflow-auto rounded-2xl bg-white border border-zinc-200 shadow-sm p-4">
        {children}
      </div>
    );
  },

  SheetHeader({ children }: { children: ReactNode }) {
    return (
      <div className="flex items-start justify-between gap-2">{children}</div>
    );
  },

  SheetTitle({ children }: { children: ReactNode }) {
    return <p className="text-sm font-semibold text-black">{children}</p>;
  },

  SheetDesc({ children }: { children: ReactNode }) {
    return (
      <p className="mt-1 text-xs text-zinc-600 whitespace-pre-line">
        {children}
      </p>
    );
  },

  SheetCloseButton({
    children,
    onClick,
    disabled,
  }: {
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }) {
    return (
      <button
        type="button"
        className="px-2 py-1 rounded-lg text-[11px] border border-zinc-300 text-zinc-700 bg-zinc-100 disabled:opacity-60"
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  },

  SheetFooter({ children }: { children: ReactNode }) {
    return <div className="mt-4 flex justify-end gap-2">{children}</div>;
  },

  SheetActionButton({
    children,
    variant,
    onClick,
    disabled,
  }: {
    children: ReactNode;
    variant: SheetActionVariant;
    onClick: () => void;
    disabled?: boolean;
  }) {
    if (variant === "primary") {
      return (
        <button
          type="button"
          className="px-3 py-2 rounded-xl text-sm font-semibold bg-black text-white shadow-sm disabled:opacity-40 active:scale-[0.99] transition"
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      );
    }

    return (
      <button
        type="button"
        className="px-3 py-2 rounded-xl text-sm font-semibold border border-zinc-300 text-zinc-700 bg-zinc-100 disabled:opacity-60"
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  },
};
