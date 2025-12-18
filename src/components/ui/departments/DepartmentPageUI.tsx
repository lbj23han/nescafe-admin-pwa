"use client";

import type {
  LayoutProps,
  HeaderProps,
  MainProps,
} from "./DepartmentPage.types";

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen px-4 pt-5 pb-4">{children}</div>
  );
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="mb-4">
      <h1 className="text-lg font-semibold tracking-tight text-black">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-xs text-zinc-600">{description}</p>
      )}
    </header>
  );
}

export function Main({ children }: MainProps) {
  return <main className="flex-1">{children}</main>;
}
