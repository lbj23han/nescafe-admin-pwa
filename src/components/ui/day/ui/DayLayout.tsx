"use client";

import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen px-4 pt-5 pb-6">{children}</div>
  );
}

export function Main({ children }: { children: ReactNode }) {
  return <main className="flex-1">{children}</main>;
}

export function Section({ children }: { children: ReactNode }) {
  return <section className="mb-4">{children}</section>;
}
