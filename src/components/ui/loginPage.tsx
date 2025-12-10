// components/ui/loginPage.tsx
"use client";

import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

type MainProps = {
  children: ReactNode;
};

type FooterProps = {
  year: number;
  appName: string;
};

export const LoginPageUI = {
  Layout({ children }: LayoutProps) {
    return (
      <div className="flex flex-col min-h-screen px-6 py-10">{children}</div>
    );
  },

  Main({ children }: MainProps) {
    return (
      <div className="flex-1 flex flex-col justify-center">{children}</div>
    );
  },

  Footer({ year, appName }: FooterProps) {
    return (
      <p className="text-[11px] text-black text-center mt-8">
        © {year} {appName}
      </p>
    );
  },
};
