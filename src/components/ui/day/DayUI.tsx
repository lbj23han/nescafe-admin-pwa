// components/ui/day/DayUI.tsx
"use client";

import type { ReactNode } from "react";

type ActionButtonVariant = "complete" | "cancel";

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

  Label({ children }: { children: ReactNode }) {
    return <label className="block text-xs text-black mb-1">{children}</label>;
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

    const variantClass =
      variant === "complete"
        ? disabled
          ? "border-zinc-300 text-zinc-500 bg-zinc-100 cursor-default"
          : "border-emerald-500 text-emerald-700 bg-emerald-50"
        : "border-red-400 text-red-600 bg-red-50";

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
