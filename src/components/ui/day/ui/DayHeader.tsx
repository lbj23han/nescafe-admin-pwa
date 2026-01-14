"use client";

import type { ReactNode } from "react";

export function HeaderRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">{children}</div>
  );
}

export function BackButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="text-xs text-black">
      {children}
    </button>
  );
}

export function HeaderTitleBlock({
  title,
  dateText,
}: {
  title: string;
  dateText: string;
}) {
  return (
    <div className="text-right">
      <p className="text-sm text-black">{title}</p>
      <p className="text-lg font-semibold text-black">{dateText}</p>
    </div>
  );
}

export function Header({
  backLabel,
  title,
  dateText,
  onBack,
}: {
  backLabel: string;
  title: string;
  dateText: string;
  onBack: () => void;
}) {
  return (
    <HeaderRow>
      <BackButton onClick={onBack}>{backLabel}</BackButton>
      <HeaderTitleBlock title={title} dateText={dateText} />
    </HeaderRow>
  );
}
