"use client";

import type { ReactNode } from "react";

export function ReservationCard({
  children,
  isCompleted,
}: {
  children: ReactNode;
  isCompleted: boolean;
}) {
  return (
    <div
      className={`border border-zinc-200 rounded-2xl px-3 py-2 text-xs mb-1 ${
        isCompleted ? "bg-zinc-200 opacity-80" : "bg-zinc-50"
      }`}
    >
      {children}
    </div>
  );
}

export function ReservationTitle({ children }: { children: ReactNode }) {
  return <p className="font-medium text-black">{children}</p>;
}

export function MetaText({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-[11px] text-black">{children}</p>;
}

export function EditSection({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 border-t border-zinc-200 pt-3 space-y-2">
      {children}
    </div>
  );
}
