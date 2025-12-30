"use client";

import type { ReactNode, RefObject } from "react";

type WeekdayVariant = "default" | "holiday";
type DateVariant = "default" | "holiday";

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
        className="h-[90vh] overflow-y-auto px-4 pb-6 hidescroll"
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

  DateText({
    children,
    as,
    variant = "default",
  }: {
    children: ReactNode;
    as?: "big" | "normal";
    variant?: DateVariant;
  }) {
    const color = variant === "holiday" ? "text-red-600" : "text-black";

    if (as === "big") {
      return <p className={`text-lg font-bold ${color}`}>{children}</p>;
    }

    return <p className={`text-base font-medium ${color}`}>{children}</p>;
  },

  WeekdayText({
    children,
    variant = "default",
  }: {
    children: ReactNode;
    variant?: WeekdayVariant;
  }) {
    const color = variant === "holiday" ? "text-red-600" : "text-black";

    return <span className={`text-xs font-normal ${color}`}>{children}</span>;
  },

  // 공휴일명 텍스트(배지 X) - 날짜 옆에 자연스럽게 붙이는 용도
  HolidayNameText({ children }: { children: ReactNode }) {
    return (
      <span className="ml-1 text-xs font-normal text-red-600">{children}</span>
    );
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
