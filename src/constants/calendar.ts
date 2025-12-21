// constants/calendar.ts

export const CALENDAR_COPY = {
  todayLabel: "오늘",

  emptyTodaySummary: "남은 예약이 없습니다.",
  emptyDayLabel: "",

  // 일반 날짜 카드
  reservationCount: (count: number) => `예약 ${count}건`,

  // 오늘 카드 요약
  todayTotalCount: (total: number) => `총 ${total}건`,
  todayRemainingCount: (remaining: number) => `남은 예약 ${remaining}건`,
  todayTotalAmount: (amount: number) =>
    `(총 매출 ${amount.toLocaleString()}원)`,
};

export const WEEKDAY_LABELS = [" 일", " 월", " 화", " 수", " 목", " 금", " 토"];
