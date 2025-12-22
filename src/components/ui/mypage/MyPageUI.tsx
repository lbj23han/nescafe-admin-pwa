"use client";

import type {
  LayoutProps,
  HeaderProps,
  CardProps,
  RowProps,
  ButtonProps,
} from "./MyPage.types";

export const MyPageUI = {
  Layout({ children }: LayoutProps) {
    return <div className="min-h-screen bg-zinc-50 px-4 py-5">{children}</div>;
  },

  Header({ title }: HeaderProps) {
    return (
      <header className="mb-4">
        <h1 className="text-lg font-semibold tracking-tight text-black">
          {title}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">내 정보 조회 및 계정 관리</p>
      </header>
    );
  },

  Card({ children }: CardProps) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        {children}
      </section>
    );
  },

  Row({ label, value }: RowProps) {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-zinc-600">{label}</span>
        <span className="text-sm font-medium text-black truncate max-w-[60%] text-right">
          {value}
        </span>
      </div>
    );
  },

  Spacer() {
    return <div className="h-4" />;
  },

  DangerButton(props: ButtonProps) {
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
  },
};
