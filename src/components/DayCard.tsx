// components/DayCard.tsx
import Link from "next/link";
import type { Reservation } from "@/lib/storage";

type Props = {
  date: string;
  summaryCount?: number;
  isToday?: boolean;
  todayReservations?: Reservation[]; // ✅ 오늘 카드용 간추린 예약
};

const weekdayLabel = ["일", "월", "화", "수", "목", "금", "토"];

export function DayCard({
  date,
  summaryCount = 0,
  isToday = false,
  todayReservations,
}: Props) {
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const weekday = weekdayLabel[d.getDay()];

  // 오늘 카드 요약 정보 계산
  let todayText = "오늘 예약이 없습니다.";
  let todaySubText = "";
  if (isToday && todayReservations && todayReservations.length > 0) {
    const total = todayReservations.length;
    const first = todayReservations[0];
    const second = todayReservations[1];
    const totalAmount = todayReservations.reduce(
      (sum, r) => sum + (r.amount || 0),
      0
    );

    if (total === 1) {
      todayText = `${first.department} · ${first.menu}`;
    } else if (total === 2) {
      todayText = `${first.department} · ${first.menu}`;
      todaySubText = `${second.department} · ${second.menu}`;
    } else if (total > 2) {
      todayText = `${first.department} · ${first.menu}`;
      todaySubText = `외 ${total - 1}건 예약`;
    }

    if (totalAmount > 0) {
      todaySubText +=
        (todaySubText ? " · " : "") + `총 ${totalAmount.toLocaleString()}원`;
    }
  }

  if (isToday) {
    // ✅ 오늘 카드: 더 크게, 배경 하이라이트 + 예약 요약
    return (
      <Link href={`/day/${date}`}>
        <div className="mb-3 rounded-2xl border border-amber-300 bg-amber-100 px-4 py-4 active:scale-[0.99] transition">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-black">오늘</p>
              <p className="text-lg font-bold text-black">
                {month}월 {day}일{" "}
                <span className="text-xs font-normal">{weekday}</span>
              </p>
            </div>
            {summaryCount > 0 && (
              <div className="flex flex-col items-end">
                <span className="text-xs text-black">
                  예약 {summaryCount}건
                </span>
              </div>
            )}
          </div>

          <div className="mt-1">
            <p className="text-sm font-medium text-black">{todayText}</p>
            {todaySubText && (
              <p className="mt-1 text-[11px] text-black">{todaySubText}</p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // ✅ 다른 날짜 카드: 기존 크기 유지 (작은 카드)
  const weekdayLabelText = weekday;

  return (
    <Link href={`/day/${date}`}>
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-zinc-200 bg-white mb-2 active:scale-[0.99] transition">
        <div>
          <p className="text-base font-medium text-black">
            {month}월 {day}일{" "}
            <span className="text-xs text-black">{weekdayLabelText}</span>
          </p>
        </div>

        {summaryCount > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-black">예약 {summaryCount}건</span>
            <span className="w-2 h-2 rounded-full bg-black" />
          </div>
        ) : (
          <span className="text-xs text-black">예약 없음</span>
        )}
      </div>
    </Link>
  );
}
