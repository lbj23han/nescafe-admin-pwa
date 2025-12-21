"use client";

import type { ReactNode } from "react";

export const LoginUI = {
  Layout({ children }: { children: ReactNode }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-6">
        {children}
      </div>
    );
  },

  Main({ children }: { children: ReactNode }) {
    return <main className="w-full max-w-xs mb-8">{children}</main>;
  },

  Footer({ year, appName }: { year: number; appName: string }) {
    return (
      <footer className="text-[11px] text-zinc-400">
        © {year} {appName}. All rights reserved.
      </footer>
    );
  },
};
