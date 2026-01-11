"use client";

import type { ButtonProps } from "../MyPage.types";
import type { ReactNode } from "react";

export function DangerButton(props: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        "w-full rounded-xl px-4 py-3 text-sm font-semibold",
        "bg-zinc-900 text-white active:opacity-90",
        "disabled:opacity-50",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function PrimaryButton(props: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        "w-full rounded-xl px-4 py-3 text-sm font-semibold",
        "bg-black text-white active:opacity-90",
        "disabled:opacity-50",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function GhostButton(props: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        "mt-2 w-full rounded-xl px-4 py-2 text-xs font-semibold",
        "border border-zinc-200 bg-white text-zinc-800",
        "hover:bg-zinc-50 active:opacity-90",
        "disabled:opacity-50",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Input({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <input
      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 disabled:opacity-60"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 whitespace-pre-wrap text-xs text-red-700">{children}</p>
  );
}

export function HintText({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-[11px] text-zinc-500">{children}</p>;
}
