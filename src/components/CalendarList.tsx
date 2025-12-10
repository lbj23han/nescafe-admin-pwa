// components/CalendarList.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { getDateRangeWithToday } from "@/lib/calendar";
import { DayCard } from "./DayCard";
import { loadReservationsByDate, type Reservation } from "@/lib/storage";

type ReservationSummaryMap = Record<string, number>;

const STORAGE_KEY = "cafe-ledger-reservations";

function readSummaryFromLocalStorage(): ReservationSummaryMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;

    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }

    const map: ReservationSummaryMap = {};

    Object.entries(parsed as Record<string, unknown>).forEach(
      ([date, value]) => {
        if (Array.isArray(value)) {
          map[date] = value.length;
        }
      }
    );

    return map;
  } catch {
    return {};
  }
}

export function CalendarList() {
  // 날짜별 예약 개수 요약
  const [summary] = useState<ReservationSummaryMap>(() =>
    readSummaryFromLocalStorage()
  );

  // 과거 60일 ~ 미래 60일 + 오늘 문자열
  const { days, todayStr } = getDateRangeWithToday(60, 60);

  // ✅ 오늘 예약 목록 (오늘 카드 요약용) – 완료된 것 제외
  const [todayReservations] = useState<Reservation[]>(() =>
    typeof window === "undefined" || !todayStr
      ? []
      : loadReservationsByDate(todayStr).filter(
          (r) => (r.status ?? "pending") === "pending"
        )
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const todayItemRef = useRef<HTMLDivElement | null>(null);

  // 처음 렌더 시, "오늘" 카드가 스크롤 영역의 최상단에 오도록
  useEffect(() => {
    const container = containerRef.current;
    const todayEl = todayItemRef.current;
    if (!container || !todayEl) return;

    todayEl.scrollIntoView({
      block: "start",
      behavior: "auto",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      // ✅ 카드 노출 높이 조절
      className="h-[68vh] overflow-y-auto px-4 pb-6 hidescroll"
    >
      {days.map((date) => {
        const isToday = date === todayStr;

        return (
          <div key={date} ref={isToday ? todayItemRef : undefined}>
            <DayCard
              date={date}
              summaryCount={summary[date] ?? 0}
              isToday={isToday}
              todayReservations={isToday ? todayReservations : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
