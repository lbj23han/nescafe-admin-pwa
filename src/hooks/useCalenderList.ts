// hooks/useCalendarList.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { getDateRangeWithToday } from "@/lib/calendar";
import { loadReservationsByDate, type Reservation } from "@/lib/storage";

export type ReservationSummaryMap = Record<string, number>;

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
          map[date] = value.length; // ✅ 총 예약 수 (완료/미완료 상관없이)
        }
      }
    );

    return map;
  } catch {
    return {};
  }
}

export function useCalendarList() {
  // 과거 60일 ~ 미래 60일 + 오늘 문자열
  const { days, todayStr } = getDateRangeWithToday(60, 60);

  // 날짜별 예약 개수 요약(총 예약 수)
  const [summary] = useState<ReservationSummaryMap>(() =>
    readSummaryFromLocalStorage()
  );

  // ✅ 오늘 예약 전체 목록 (완료 포함)
  const [todayAllReservations] = useState<Reservation[]>(() =>
    typeof window === "undefined" || !todayStr
      ? []
      : loadReservationsByDate(todayStr)
  );

  // ✅ 오늘 예약 목록 (미완료만 = pending)
  const [todayReservations] = useState<Reservation[]>(() =>
    todayAllReservations.filter((r) => (r.status ?? "pending") === "pending")
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const todayItemRef = useRef<HTMLDivElement | null>(null);

  // 처음 렌더 시 "오늘" 카드가 위로 오도록
  useEffect(() => {
    const container = containerRef.current;
    const todayEl = todayItemRef.current;
    if (!container || !todayEl) return;

    todayEl.scrollIntoView({
      block: "start",
      behavior: "auto",
    });
  }, []);

  return {
    days,
    todayStr,
    summary,
    todayReservations, // 오늘 남은 예약 (pending)
    todayAllReservations, // 오늘 총 예약 (전체)
    containerRef,
    todayItemRef,
  };
}
