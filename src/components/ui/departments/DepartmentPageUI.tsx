"use client";

import type {
  LayoutProps,
  HeaderProps,
  MainProps,
} from "./DepartmentPage.types";
import { PrimaryButton } from "@/components/PrimaryButton";

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

export function BackButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center text-[11px] text-zinc-600"
      >
        <span className="mr-1">←</span>
        {label}
      </button>
    </div>
  );
}

export function AddToggleButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="mb-3 flex w-full">
      <PrimaryButton onClick={onClick} className="flex-1 justify-center">
        {label}
      </PrimaryButton>
    </div>
  );
}
