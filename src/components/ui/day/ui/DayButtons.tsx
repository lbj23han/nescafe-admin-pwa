"use client";

import type { ReactNode } from "react";

type ActionButtonVariant = "complete" | "cancel" | "edit";

export function PrimaryButton({
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
}

export function FooterRow({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 flex items-center justify-between">{children}</div>
  );
}

export function StatusText({ children }: { children: ReactNode }) {
  return <span className="text-[11px] text-black">{children}</span>;
}

export function ActionGroup({ children }: { children: ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
}

export function ActionButton({
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
  const cls =
    variant === "complete"
      ? disabled
        ? "border-zinc-300 text-zinc-500 bg-zinc-100 cursor-default"
        : "border-emerald-500 text-emerald-700 bg-emerald-50"
      : variant === "cancel"
      ? "border-red-400 text-red-600 bg-red-50"
      : "border-zinc-300 text-zinc-700 bg-zinc-100";

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${cls}`}>
      {children}
    </button>
  );
}
