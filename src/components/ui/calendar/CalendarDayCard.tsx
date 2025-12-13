// components/ui/calendar/CalendarDayCard.tsx
import Link from "next/link";
import { CalendarUI } from "./CalendarUI";
import { CALENDAR_COPY } from "@/constants/calendar";

type Props = {
  href: string;
  isToday: boolean;
  dateLabel: string; // "12월 13일"
  weekdayLabel: string; // "월", "화" ...
  summaryCount: number;
  mainText: string;
  subText?: string;
};

export function CalendarDayCard({
  href,
  isToday,
  dateLabel,
  weekdayLabel,
  summaryCount,
  mainText,
  subText,
}: Props) {
  if (isToday) {
    // ✅ 오늘 카드
    return (
      <Link href={href}>
        <CalendarUI.TodayCardOuter>
          <CalendarUI.CardHeaderRow>
            <CalendarUI.CardTitleBlock>
              <CalendarUI.TodayLabel>
                {CALENDAR_COPY.todayLabel}
              </CalendarUI.TodayLabel>
              <CalendarUI.DateText as="big">
                {dateLabel}{" "}
                <CalendarUI.WeekdayText>{weekdayLabel}</CalendarUI.WeekdayText>
              </CalendarUI.DateText>
            </CalendarUI.CardTitleBlock>

            {summaryCount > 0 && (
              <CalendarUI.RightInfoColumn>
                <CalendarUI.ReservationCountText>
                  {CALENDAR_COPY.reservationCount(summaryCount)}
                </CalendarUI.ReservationCountText>
              </CalendarUI.RightInfoColumn>
            )}
          </CalendarUI.CardHeaderRow>

          <div>
            <CalendarUI.MainText>{mainText}</CalendarUI.MainText>
            {subText && <CalendarUI.SubText>{subText}</CalendarUI.SubText>}
          </div>
        </CalendarUI.TodayCardOuter>
      </Link>
    );
  }

  // ✅ 일반 날짜 카드
  return (
    <Link href={href}>
      <CalendarUI.NormalCardOuter>
        <CalendarUI.CardTitleBlock>
          <CalendarUI.DateText>
            {dateLabel}{" "}
            <CalendarUI.WeekdayText>{weekdayLabel}</CalendarUI.WeekdayText>
          </CalendarUI.DateText>
        </CalendarUI.CardTitleBlock>

        {summaryCount > 0 ? (
          <CalendarUI.RightInfoRow>
            <CalendarUI.ReservationCountText>
              {CALENDAR_COPY.reservationCount(summaryCount)}
            </CalendarUI.ReservationCountText>
            <CalendarUI.ReservationDot />
          </CalendarUI.RightInfoRow>
        ) : (
          <CalendarUI.EmptyLabel>
            {CALENDAR_COPY.emptyDayLabel}
          </CalendarUI.EmptyLabel>
        )}
      </CalendarUI.NormalCardOuter>
    </Link>
  );
}
