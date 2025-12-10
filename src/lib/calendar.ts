// lib/calendar.ts

// YYYY-MM-DD 포맷으로 변환
export function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * 오늘을 기준으로 과거 pastDays일, 미래 futureDays일까지
 * 연속된 날짜 리스트와 오늘 문자열을 함께 반환
 * - baseDate는 시·분·초를 0으로 맞춰서 타임존 차이 문제 방지
 */
export function getDateRangeWithToday(
  pastDays = 60,
  futureDays = 60,
  baseDate = new Date()
): { days: string[]; todayStr: string } {
  const base = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate()
  );

  const todayStr = formatDate(base);

  const start = new Date(base);
  start.setDate(base.getDate() - pastDays);

  const end = new Date(base);
  end.setDate(base.getDate() + futureDays);

  const days: string[] = [];
  for (let d = start; d <= end; d = new Date(d.getTime() + 86400000)) {
    days.push(formatDate(d));
  }

  return { days, todayStr };
}
