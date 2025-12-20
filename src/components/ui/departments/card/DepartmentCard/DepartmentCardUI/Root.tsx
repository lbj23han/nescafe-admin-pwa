"use client";

import type { RootProps } from "../../DepartmentCard.types";

export function Root({ expanded, onClick, children }: RootProps) {
  return (
    <div
      className={`
        border border-zinc-200 rounded-xl p-4 bg-white mb-3 transition-all cursor-pointer
        ${expanded ? "scale-[1.02] shadow-sm" : "scale-100"}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
