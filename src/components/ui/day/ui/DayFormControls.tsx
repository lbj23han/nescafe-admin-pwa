"use client";

import type { ReactNode } from "react";

export function Label({ children }: { children: ReactNode }) {
  return <label className="block text-xs text-black mb-1">{children}</label>;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function TextInput({
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
}
