"use client";

import { PrimaryButton } from "@/components/PrimaryButton";
import type {
  LayoutProps,
  HeaderProps,
  FieldProps,
  MessageProps,
  ActionButtonProps,
  SecondaryButtonProps,
} from "./ResetPasswordPage.types";

export const ResetPasswordPageUI = {
  Layout({ children }: LayoutProps) {
    return <div className="px-6 py-8">{children}</div>;
  },

  Header({ title, subtitle }: HeaderProps) {
    return (
      <header className="mb-6">
        <h1 className="text-lg font-semibold tracking-tight text-black">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
        ) : null}
      </header>
    );
  },

  Section({ children }: LayoutProps) {
    return <section className="space-y-3">{children}</section>;
  },

  Field({ label, value, onChange, placeholder, disabled }: FieldProps) {
    const inputClass = [
      "mt-1 w-full rounded-xl border border-zinc-200",
      "px-3 py-3 text-sm",
      "text-zinc-600",
      "placeholder:text-zinc-200",
      "outline-none focus:ring-2 focus:ring-zinc-200",
      "disabled:bg-zinc-100",
    ].join(" ");

    return (
      <div>
        <label className="text-xs font-medium text-zinc-700">{label}</label>
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          placeholder={placeholder}
          autoComplete="new-password"
          disabled={disabled}
        />
      </div>
    );
  },

  Error({ children }: MessageProps) {
    return (
      <p className="text-xs text-red-600 whitespace-pre-wrap">{children}</p>
    );
  },

  Success({ children }: MessageProps) {
    return (
      <p className="text-xs text-emerald-700 whitespace-pre-wrap">{children}</p>
    );
  },

  HelperError({ children }: MessageProps) {
    return <p className="mt-2 text-xs text-red-600">{children}</p>;
  },

  PrimaryAction({
    children,
    onClick,
    disabled,
  }: Omit<ActionButtonProps, "loading">) {
    return (
      <PrimaryButton
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full"
      >
        {children}
      </PrimaryButton>
    );
  },

  SecondaryAction({ children, onClick, disabled }: SecondaryButtonProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-xl px-4 py-3 text-sm font-medium text-zinc-700 bg-zinc-100"
        disabled={disabled}
      >
        {children}
      </button>
    );
  },
};
