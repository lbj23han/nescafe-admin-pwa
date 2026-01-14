"use client";

import type { ReactNode } from "react";

type SheetActionVariant = "primary" | "secondary";

export function SheetOverlay({
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
}

export function SheetContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-[80vw] max-w-[480px] max-h-[80vh] overflow-auto rounded-2xl bg-white border border-zinc-200 shadow-sm p-4">
      {children}
    </div>
  );
}

export function SheetHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2">{children}</div>
  );
}

export function SheetTitle({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold text-black">{children}</p>;
}

export function SheetDesc({ children }: { children: ReactNode }) {
  return (
    <p className="mt-1 text-xs text-zinc-600 whitespace-pre-line">{children}</p>
  );
}

export function SheetCloseButton({
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
}

export function SheetFooter({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>;
}

export function SheetActionButton({
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
  const cls =
    variant === "primary"
      ? "px-3 py-2 rounded-xl text-sm font-semibold bg-black text-white shadow-sm disabled:opacity-40 active:scale-[0.99] transition"
      : "px-3 py-2 rounded-xl text-sm font-semibold border border-zinc-300 text-zinc-700 bg-zinc-100 disabled:opacity-60";

  return (
    <button type="button" className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
