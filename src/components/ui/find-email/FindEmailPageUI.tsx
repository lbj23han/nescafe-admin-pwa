"use client";

import type {
  ActionButtonProps,
  FieldProps,
  HeaderProps,
  LayoutProps,
  MessageProps,
} from "./FindEmailPage.types";
import { PrimaryButton } from "@/components/PrimaryButton";

export const FindEmailPageUI = {
  Layout({ children }: LayoutProps) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    );
  },

  Header({ title, subtitle }: HeaderProps) {
    return (
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-zinc-900">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>
        ) : null}
      </header>
    );
  },

  Section({ children }: { children: React.ReactNode }) {
    return (
      <section className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
        {children}
      </section>
    );
  },

  Hint({ children }: MessageProps) {
    return (
      <div className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-2 mb-3">
        {children}
      </div>
    );
  },

  Field({ label, value, onChange, placeholder, disabled }: FieldProps) {
    return (
      <label className="block mb-3">
        <div className="text-sm text-zinc-700 mb-1">{label}</div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          inputMode="email"
          autoComplete="email"
          className="
            w-full rounded-xl border border-zinc-200 px-3 py-2 bg-white
            text-zinc-600
            placeholder:text-zinc-200
            disabled:bg-zinc-100
          "
        />
      </label>
    );
  },

  Error({ children }: MessageProps) {
    return (
      <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-3">
        {children}
      </div>
    );
  },

  Success({ children }: MessageProps) {
    return (
      <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-3">
        {children}
      </div>
    );
  },

  PrimaryAction({ children, onClick, disabled }: ActionButtonProps) {
    return (
      <PrimaryButton onClick={onClick} disabled={disabled} className="w-full">
        {children}
      </PrimaryButton>
    );
  },

  LinkAction({ children, onClick, disabled }: ActionButtonProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full text-sm text-zinc-600 underline underline-offset-4 mt-3 disabled:opacity-50"
      >
        {children}
      </button>
    );
  },
};
