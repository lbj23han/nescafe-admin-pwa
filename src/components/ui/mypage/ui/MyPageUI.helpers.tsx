"use client";

import type { ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="py-1 text-sm font-semibold text-zinc-800">{children}</div>
  );
}

export function InlineRow({
  label,
  right,
}: {
  label: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-zinc-600">{label}</span>
      <div className="min-w-0">{right}</div>
    </div>
  );
}

export function ValueText({ children }: { children: ReactNode }) {
  return (
    <span className="max-w-[60%] truncate text-right text-sm font-medium text-black">
      {children}
    </span>
  );
}

export function InputWrap({ children }: { children: ReactNode }) {
  return <div className="w-[220px] max-w-[60vw]">{children}</div>;
}

export function Collapse({
  open,
  children,
  className,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={[open ? "mt-3" : "mt-3 hidden", className ?? ""].join(" ")}>
      {children}
    </div>
  );
}

export function CollapseToggleArea({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className ?? ""}>{children}</div>;
}

export function SectionCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      {children}
    </div>
  );
}

export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-zinc-600">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
