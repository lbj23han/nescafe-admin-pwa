import Link from "next/link";
import { CalendarUI } from "./CalendarUI";
import { CALENDAR_COPY } from "@/constants/calendar";

type TodayMeta = {
  total: number;
  remaining: number;
  totalAmount: number;
};

type WeekdayVariant = "default" | "holiday";

type Props = {
  href: string;
  isToday: boolean;
  dateLabel: string;
  weekdayLabel: string;
  weekdayVariant: WeekdayVariant;
  holidayName?: string; // 예: "설날", "광복절"
  summaryCount: number;
  mainText: string;
  subText?: string;
  todayMeta?: TodayMeta | null;
};

export function CalendarDayCard({
  href,
  isToday,
  dateLabel,
  weekdayLabel,
  weekdayVariant,
  holidayName,
  summaryCount,
  mainText,
  subText,
  todayMeta,
}: Props) {
  // 오늘 카드 (오늘 카드는 공휴일명 표시 제외)
  if (isToday) {
    return (
      <Link href={href}>
        <CalendarUI.TodayCardOuter>
          <CalendarUI.CardHeaderRow>
            <CalendarUI.CardTitleBlock>
              <CalendarUI.TodayLabel>
                {CALENDAR_COPY.todayLabel}
              </CalendarUI.TodayLabel>

              <CalendarUI.DateText as="big" variant={weekdayVariant}>
                {dateLabel}
                <CalendarUI.WeekdayText variant={weekdayVariant}>
                  {weekdayLabel}
                </CalendarUI.WeekdayText>
              </CalendarUI.DateText>
            </CalendarUI.CardTitleBlock>

            {todayMeta && todayMeta.total > 0 ? (
              <CalendarUI.RightInfoColumn>
                <CalendarUI.ReservationCountText>
                  {CALENDAR_COPY.todayTotalCount(todayMeta.total)}
                </CalendarUI.ReservationCountText>

                <CalendarUI.ReservationCountText>
                  {CALENDAR_COPY.todayRemainingCount(todayMeta.remaining)}
                </CalendarUI.ReservationCountText>

                <CalendarUI.SubText>
                  {CALENDAR_COPY.todayTotalAmount(todayMeta.totalAmount)}
                </CalendarUI.SubText>
              </CalendarUI.RightInfoColumn>
            ) : (
              summaryCount > 0 && (
                <CalendarUI.RightInfoColumn>
                  <CalendarUI.ReservationCountText>
                    {CALENDAR_COPY.reservationCount(summaryCount)}
                  </CalendarUI.ReservationCountText>
                </CalendarUI.RightInfoColumn>
              )
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

  // 일반 날짜 카드 (공휴일일 때만 공휴일명 텍스트 추가)
  return (
    <Link href={href}>
      <CalendarUI.NormalCardOuter>
        <CalendarUI.CardTitleBlock>
          <CalendarUI.DateText variant={weekdayVariant}>
            {dateLabel}
            <CalendarUI.WeekdayText variant={weekdayVariant}>
              {weekdayLabel}
            </CalendarUI.WeekdayText>

            {/* 공휴일 텍스트 (배지 X) */}
            {holidayName ? (
              <CalendarUI.HolidayNameText>
                {holidayName}
              </CalendarUI.HolidayNameText>
            ) : null}
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
