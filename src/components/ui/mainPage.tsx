// components/ui/mainPage.tsx
"use client";

import type { ReactNode } from "react";

export const MainPageUI = {
  Layout({ children }: { children: ReactNode }) {
    return <div className="flex flex-col min-h-screen">{children}</div>;
  },

  Header({ title, description }: { title: string; description: string }) {
    return (
      <header className="px-4 pt-5 pb-3 border-b border-zinc-100">
        <h1 className="text-lg font-semibold tracking-tight text-black">
          {title}
        </h1>
        <p className="text-xs text-black mt-1">{description}</p>
      </header>
    );
  },

  Footer({ children }: { children: ReactNode }) {
    return (
      <footer className="px-4 pb-6 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
        {children}
      </footer>
    );
  },
};
