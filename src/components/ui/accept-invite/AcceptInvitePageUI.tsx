"use client";

import type { ReactNode } from "react";

export const AcceptInviteUI = {
  Layout({ children }: { children: ReactNode }) {
    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-10">{children}</main>
    );
  },

  Card({ children }: { children: ReactNode }) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-5">
        {children}
      </div>
    );
  },

  Title({ children }: { children: ReactNode }) {
    return <h1 className="text-lg font-semibold text-zinc-900">{children}</h1>;
  },

  Desc({ children }: { children: ReactNode }) {
    return <p className="mt-2 text-sm text-zinc-600">{children}</p>;
  },

  MetaBox({ children }: { children: ReactNode }) {
    return (
      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700 space-y-1">
        {children}
      </div>
    );
  },

  MetaRow({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  },

  Notice({ children }: { children: ReactNode }) {
    return <p className="mt-4 text-sm text-zinc-600">{children}</p>;
  },

  Actions({ children }: { children: ReactNode }) {
    return <div className="mt-4 space-y-2">{children}</div>;
  },

  PrimaryLink({ children, href }: { children: ReactNode; href: string }) {
    // Link는 view에서 next/link로 감싸도 되는데, day 스타일로는 UI가 button/link primitive를 들고 있어도 OK
    return (
      <a
        href={href}
        className="h-10 w-full rounded-md bg-black text-sm font-medium text-white inline-flex items-center justify-center"
      >
        {children}
      </a>
    );
  },

  SecondaryLink({ children, href }: { children: ReactNode; href: string }) {
    return (
      <a
        href={href}
        className="h-10 w-full rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-900 inline-flex items-center justify-center"
      >
        {children}
      </a>
    );
  },

  Footnote({ children }: { children: ReactNode }) {
    return <p className="text-xs text-zinc-500 text-center">{children}</p>;
  },

  Slot({ children }: { children: ReactNode }) {
    return <div className="mt-4">{children}</div>;
  },
};
