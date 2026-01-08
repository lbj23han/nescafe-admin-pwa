"use client";

import type {
  LayoutProps,
  HeaderProps,
  CardProps,
  RowProps,
} from "../MyPage.types";

export function Layout({ children }: LayoutProps) {
  return <div className="min-h-screen bg-zinc-50 px-4 py-5">{children}</div>;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="mb-4">
      <h1 className="text-lg font-semibold tracking-tight text-black">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
      ) : null}
    </header>
  );
}

export function Card({ children }: CardProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4">
      {children}
    </section>
  );
}

export function Row({ label, value }: RowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-zinc-600">{label}</span>
      <span className="max-w-[60%] truncate text-right text-sm font-medium text-black">
        {value}
      </span>
    </div>
  );
}

export function Divider() {
  return <div className="my-2 h-px bg-zinc-100" />;
}

export function Spacer() {
  return <div className="h-4" />;
}
