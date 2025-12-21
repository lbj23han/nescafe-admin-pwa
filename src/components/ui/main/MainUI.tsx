"use client";

import type { ReactNode } from "react";

export const MainUI = {
  Layout({ children }: { children: ReactNode }) {
    return <div className="flex flex-col min-h-screen">{children}</div>;
  },

  HeaderContainer({ children }: { children: ReactNode }) {
    return (
      <header className="px-4 pt-5 pb-3 border-b border-zinc-100">
        {children}
      </header>
    );
  },

  Title({ children }: { children: ReactNode }) {
    return (
      <h1 className="text-lg font-semibold tracking-tight text-black">
        {children}
      </h1>
    );
  },

  Description({ children }: { children: ReactNode }) {
    return <p className="text-xs text-black mt-1">{children}</p>;
  },

  Footer({ children }: { children: ReactNode }) {
    return (
      <footer className="px-4 pb-6 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
        {children}
      </footer>
    );
  },
};
