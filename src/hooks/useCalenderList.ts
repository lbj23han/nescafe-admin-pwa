"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getDateRangeWithToday } from "@/lib/calendar";
import { ReservationsRepo } from "@/lib/data";
import type { Reservation } from "@/lib/domain/reservation";

export type ReservationSummaryMap = Record<string, number>;
export type ReservationForCalendar = Reservation & { date: string };

function isCompleted(r: Reservation) {
  return (r.status ?? "pending") === "completed";
}

function stripDate(r: ReservationForCalendar): Reservation {
  // date만 제거해서 기존 UI가 쓰던 Reservation[] 형태 유지
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { date, ...rest } = r;
  return rest as Reservation;
}

export function useCalendarList() {
  // 과거 60일 ~ 미래 60일 + 오늘 문자열
  const { days, todayStr } = getDateRangeWithToday(60, 60);

  // days 범위에서 from/to 산출 (정렬 안정성 확보)
  const { from, to } = useMemo(() => {
    if (!days || days.length === 0) return { from: "", to: "" };
    const sorted = [...days].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    return { from: sorted[0], to: sorted[sorted.length - 1] };
  }, [days]);

  // range 기반 결과 state
  const [summary, setSummary] = useState<ReservationSummaryMap>({});
  const [todayAllReservations, setTodayAllReservations] = useState<
    Reservation[]
  >([]);
  const [todayReservations, setTodayReservations] = useState<Reservation[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const todayItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!from || !to) return;

      try {
        const rows = (await ReservationsRepo.loadReservationsByDateRange(
          from,
          to
        )) as ReservationForCalendar[];

        if (cancelled) return;

        // 날짜별 예약 개수(summary)
        const nextSummary: ReservationSummaryMap = {};
        for (const r of rows) {
          nextSummary[r.date] = (nextSummary[r.date] ?? 0) + 1;
        }
        setSummary(nextSummary);

        // 오늘 전체 예약(todayAllReservations)
        if (todayStr) {
          const allToday = rows
            .filter((r) => r.date === todayStr)
            .map(stripDate);

          // 오늘 진행 중 예약(todayReservations, status !== completed)
          const pendingToday = allToday.filter((r) => !isCompleted(r));

          setTodayAllReservations(allToday);
          setTodayReservations(pendingToday);
        } else {
          setTodayAllReservations([]);
          setTodayReservations([]);
        }
      } catch {
        if (cancelled) return;
        setSummary({});
        setTodayAllReservations([]);
        setTodayReservations([]);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [from, to, todayStr]);

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
    todayReservations, // 오늘 남은 예약 (status !== completed)
    todayAllReservations, // 오늘 총 예약 (전체)
    containerRef,
    todayItemRef,
  };
}
