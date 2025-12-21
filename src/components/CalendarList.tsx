// components/CalendarList.tsx
"use client";

import { useMemo } from "react";
import { useCalendarList } from "@/hooks/useCalenderList";
import { useHolidayMap } from "@/lib/holidays/useHolidayMap";
import type { Reservation } from "@/lib/storage";
import { CalendarDayCard } from "./ui/calendar/CalendarDayCard";
import { CalendarUI } from "@/components/ui/calendar/CalendarUI";
import { CALENDAR_COPY, WEEKDAY_LABELS } from "@/constants/calendar";

function buildTodaySummary(
  isToday: boolean,
  todayReservations?: Reservation[]
) {
  if (!isToday || !todayReservations || todayReservations.length === 0) {
    return {
      mainText: CALENDAR_COPY.emptyTodaySummary,
      subText: "",
    };
  }

  const total = todayReservations.length;
  const first = todayReservations[0];
  const second = todayReservations[1];

  let mainText = "";
  let subText = "";

  if (total === 1) {
    mainText = `${first.department} · ${first.menu}`;
  } else if (total === 2) {
    mainText = `${first.department} · ${first.menu}`;
    subText = `${second.department} · ${second.menu}`;
  } else if (total > 2) {
    mainText = `${first.department} · ${first.menu}`;
    subText = `외 ${total - 1}건 예약`;
  }

  return { mainText, subText };
}

function buildTodayMeta(all?: Reservation[], pending?: Reservation[]) {
  const total = all?.length ?? 0;
  const remaining = pending?.length ?? 0;

  const totalAmount = all?.reduce((sum, r) => sum + (r.amount || 0), 0) ?? 0;

  return { total, remaining, totalAmount };
}

export function CalendarList() {
  const {
    days,
    todayStr,
    summary,
    todayReservations,
    todayAllReservations,
    containerRef,
    todayItemRef,
  } = useCalendarList();

  // days 범위(과거 60일~미래 60일)에서 연도가 바뀔 수 있으므로, 연도 집합을 추출
  const years = useMemo(() => {
    const set = new Set<number>();
    days.forEach((d) => set.add(Number(d.slice(0, 4))));
    return Array.from(set);
  }, [days]);

  // 공휴일 맵 로드 (폴백 + 캐시 + 온라인 덮어쓰기)
  const { holidayMap } = useHolidayMap({ years });

  return (
    <CalendarUI.ScrollContainer containerRef={containerRef}>
      {days.map((date) => {
        const isToday = date === todayStr;

        const [year, month, day] = date.split("-").map(Number);
        const d = new Date(year, month - 1, day);

        const dayOfWeek = d.getDay(); // 0:일 ... 6:토
        const weekday = WEEKDAY_LABELS[dayOfWeek];

        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // ✅ 공휴일(YYYY-MM-DD 키) 여부
        const isHoliday = Boolean(holidayMap[date]);

        // ✅ 요구사항: 주말 OR 공휴일이면 빨간색(holiday)
        const weekdayVariant = isWeekend || isHoliday ? "holiday" : "default";

        const dateLabel = `${month}월 ${day}일`;

        const { mainText, subText } = buildTodaySummary(
          isToday,
          isToday ? todayReservations : undefined
        );

        const todayMeta = isToday
          ? buildTodayMeta(todayAllReservations, todayReservations)
          : null;

        return (
          <div key={date} ref={isToday ? todayItemRef : undefined}>
            <CalendarDayCard
              href={`/day/${date}`}
              isToday={isToday}
              dateLabel={dateLabel}
              weekdayLabel={weekday}
              weekdayVariant={weekdayVariant}
              summaryCount={summary[date] ?? 0}
              mainText={mainText}
              subText={subText}
              todayMeta={todayMeta}
            />
          </div>
        );
      })}
    </CalendarUI.ScrollContainer>
  );
}
