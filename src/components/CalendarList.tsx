// components/CalendarList.tsx
"use client";

import { useCalendarList } from "@/hooks/useCalenderList";
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
  const totalAmount = todayReservations.reduce(
    (sum, r) => sum + (r.amount || 0),
    0
  );

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

  if (totalAmount > 0) {
    subText += (subText ? " · " : "") + `총 ${totalAmount.toLocaleString()}원`;
  }

  return { mainText, subText };
}

export function CalendarList() {
  const {
    days,
    todayStr,
    summary,
    todayReservations,
    containerRef,
    todayItemRef,
  } = useCalendarList();

  return (
    <CalendarUI.ScrollContainer containerRef={containerRef}>
      {days.map((date) => {
        const isToday = date === todayStr;
        const [year, month, day] = date.split("-").map(Number);
        const d = new Date(year, month - 1, day);
        const weekday = WEEKDAY_LABELS[d.getDay()];

        const dateLabel = `${month}월 ${day}일`;
        const { mainText, subText } = buildTodaySummary(
          isToday,
          isToday ? todayReservations : undefined
        );

        return (
          <div key={date} ref={isToday ? todayItemRef : undefined}>
            <CalendarDayCard
              href={`/day/${date}`}
              isToday={isToday}
              dateLabel={dateLabel}
              weekdayLabel={weekday}
              summaryCount={summary[date] ?? 0}
              mainText={mainText}
              subText={subText}
            />
          </div>
        );
      })}
    </CalendarUI.ScrollContainer>
  );
}
