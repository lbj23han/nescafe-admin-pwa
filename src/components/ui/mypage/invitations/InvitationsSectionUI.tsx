"use client";

import type { ReactNode } from "react";

export const InvitationsSectionUI = {
  Root({ children }: { children: ReactNode }) {
    return (
      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
        {children}
      </section>
    );
  },

  Header({ title, right }: { title: ReactNode; right?: ReactNode }) {
    return (
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-800">{title}</h2>
        {right ? <div className="text-xs text-zinc-500">{right}</div> : null}
      </div>
    );
  },

  ToggleButton({
    onClick,
    children,
    disabled,
  }: {
    onClick: () => void;
    children: ReactNode;
    disabled?: boolean;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="
          mb-2 h-10 w-full rounded-md
          border border-zinc-200
          bg-zinc-100
          text-sm font-medium text-zinc-900
          hover:bg-zinc-200
          active:bg-zinc-300
          disabled:opacity-50
          transition
        "
      >
        {children}
      </button>
    );
  },

  FormCard({ children }: { children: ReactNode }) {
    return (
      <div className="rounded-lg border border-zinc-300 p-3">{children}</div>
    );
  },

  Label({ children }: { children: ReactNode }) {
    return (
      <div className="mb-2 text-xs font-medium text-zinc-700">{children}</div>
    );
  },

  Input({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
  }) {
    return (
      <input
        className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-700 placeholder:text-zinc-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  },

  PrimaryButton({
    onClick,
    disabled,
    children,
  }: {
    onClick: () => void;
    disabled?: boolean;
    children: ReactNode;
  }) {
    return (
      <button
        type="button"
        className="mt-2 h-10 w-full rounded-md bg-black text-sm font-medium text-white disabled:opacity-50"
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  },

  LastCreatedCard({ children }: { children: ReactNode }) {
    return (
      <div className="mt-3 rounded-md bg-zinc-50 p-3 text-sm">{children}</div>
    );
  },

  LastCreatedRow({ left, right }: { left: ReactNode; right: ReactNode }) {
    return (
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">{left}</div>
        <div className="shrink-0">{right}</div>
      </div>
    );
  },

  MonoTruncate({ children }: { children: ReactNode }) {
    return <div className="truncate font-mono text-zinc-700">{children}</div>;
  },

  SubtleText({ children }: { children: ReactNode }) {
    return <div className="text-xs text-zinc-500">{children}</div>;
  },

  CopyButton({
    onClick,
    children,
  }: {
    onClick: () => void;
    children: ReactNode;
  }) {
    return (
      <button
        type="button"
        className="h-9 shrink-0 rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-700"
        onClick={onClick}
      >
        {children}
      </button>
    );
  },

  Body({ children }: { children: ReactNode }) {
    return <div className="mt-4">{children}</div>;
  },

  SummaryLine({ children }: { children: ReactNode }) {
    return <div className="mb-2 text-xs text-zinc-700">{children}</div>;
  },

  ErrorBox({ children }: { children: ReactNode }) {
    return (
      <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
        {children}
      </div>
    );
  },

  SectionHeader({ title, right }: { title: ReactNode; right?: ReactNode }) {
    return (
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-700">{title}</h3>
        {right ? <span className="text-xs text-zinc-500">{right}</span> : null}
      </div>
    );
  },

  EmptyBox({
    children,
    tone = "subtle",
  }: {
    children: ReactNode;
    tone?: "subtle" | "normal";
  }) {
    const cls =
      tone === "subtle"
        ? "rounded-md border border-zinc-100 p-3 text-sm text-zinc-500"
        : "rounded-md border border-zinc-100 p-3 text-sm text-zinc-600";

    return <div className={cls}>{children}</div>;
  },

  List({ children }: { children: ReactNode }) {
    return <ul className="space-y-2">{children}</ul>;
  },

  Item({ children }: { children: ReactNode }) {
    return (
      <li className="rounded-lg border border-zinc-100 p-3">{children}</li>
    );
  },

  ItemRow({ left, right }: { left: ReactNode; right?: ReactNode }) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">{left}</div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    );
  },

  StatusBadge({ children }: { children: ReactNode }) {
    return (
      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
        {children}
      </span>
    );
  },

  FieldLine({ label, value }: { label: ReactNode; value: ReactNode }) {
    return (
      <div className="mt-1 text-xs text-zinc-500">
        {label}: <span className="text-zinc-700">{value}</span>
      </div>
    );
  },

  SubInfoLine({ children }: { children: ReactNode }) {
    return <div className="mt-1 text-xs text-zinc-500">{children}</div>;
  },

  SubInfoStrong({ children }: { children: ReactNode }) {
    return <span className="text-zinc-700">{children}</span>;
  },

  WarningText({ children }: { children: ReactNode }) {
    return <div className="mt-2 text-xs text-amber-600">{children}</div>;
  },

  SecondaryButton({
    onClick,
    children,
    disabled,
  }: {
    onClick: () => void;
    children: ReactNode;
    disabled?: boolean;
  }) {
    return (
      <button
        type="button"
        className="
          h-9 shrink-0 rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-700
          disabled:opacity-40 disabled:cursor-not-allowed
        "
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  },
};
