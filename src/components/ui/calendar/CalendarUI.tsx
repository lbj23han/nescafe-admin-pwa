// components/ui/calendar/CalendarUI.tsx
"use client";

import type { ReactNode, RefObject } from "react";

export const CalendarUI = {
  ScrollContainer({
    children,
    containerRef,
  }: {
    children: ReactNode;
    containerRef: RefObject<HTMLDivElement | null>;
  }) {
    return (
      <div
        ref={containerRef}
        className="h-[68vh] overflow-y-auto px-4 pb-6 hidescroll"
      >
        {children}
      </div>
    );
  },

  TodayCardOuter({ children }: { children: ReactNode }) {
    return (
      <div className="mb-3 rounded-2xl border border-amber-300 bg-amber-100 px-4 py-4 active:scale-[0.99] transition">
        {children}
      </div>
    );
  },

  NormalCardOuter({ children }: { children: ReactNode }) {
    return (
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-zinc-200 bg-white mb-2 active:scale-[0.99] transition">
        {children}
      </div>
    );
  },

  CardHeaderRow({ children }: { children: ReactNode }) {
    return (
      <div className="flex items-center justify-between mb-2">{children}</div>
    );
  },

  CardTitleBlock({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  },

  TodayLabel({ children }: { children: ReactNode }) {
    return <p className="text-sm font-semibold text-black">{children}</p>;
  },

  DateText({ children, as }: { children: ReactNode; as?: "big" | "normal" }) {
    if (as === "big") {
      return <p className="text-lg font-bold text-black">{children}</p>;
    }
    return <p className="text-base font-medium text-black">{children}</p>;
  },

  WeekdayText({ children }: { children: ReactNode }) {
    return <span className="text-xs font-normal text-black">{children}</span>;
  },

  ReservationCountText({ children }: { children: ReactNode }) {
    return <span className="text-xs text-black">{children}</span>;
  },

  ReservationDot() {
    return <span className="w-2 h-2 rounded-full bg-black" />;
  },

  RightInfoColumn({ children }: { children: ReactNode }) {
    return <div className="flex flex-col items-end">{children}</div>;
  },

  RightInfoRow({ children }: { children: ReactNode }) {
    return <div className="flex items-center gap-2">{children}</div>;
  },

  MainText({ children }: { children: ReactNode }) {
    return <p className="text-sm font-medium text-black">{children}</p>;
  },

  SubText({ children }: { children: ReactNode }) {
    return <p className="mt-1 text-[11px] text-black">{children}</p>;
  },

  EmptyLabel({ children }: { children: ReactNode }) {
    return <span className="text-xs text-black">{children}</span>;
  },
};
