export type Ymd = { y: number; m: number; d: number }; // m: 1-12

const KST_TZ = "Asia/Seoul";

/**
 * KST 기준 오늘 날짜 ISO (YYYY-MM-DD)
 * - 브라우저 로컬 타임존이 달라도 KST로 강제 추출
 * - 자정 전후 UTC 흔들림 방지 (toISOString 금지)
 */
export function getKstTodayIso(now: Date = new Date()): string {
  return ymdToIso(getKstYmd(now));
}

export function getKstYmd(now: Date): Ymd {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return {
    y: Number(map.year),
    m: Number(map.month),
    d: Number(map.day),
  };
}

export function ymdToIso(ymd: Ymd): string {
  const mm = String(ymd.m).padStart(2, "0");
  const dd = String(ymd.d).padStart(2, "0");
  return `${ymd.y}-${mm}-${dd}`;
}

/**
 * ISO(YYYY-MM-DD) -> YMD
 */
export function isoToYmd(iso: string): Ymd | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d))
    return null;
  if (mo < 1 || mo > 12) return null;
  if (d < 1 || d > 31) return null;
  return { y, m: mo, d };
}

export function daysInMonth(y: number, m: number): number {
  // m: 1-12
  return new Date(y, m, 0).getDate();
}

export function addDays(iso: string, deltaDays: number): string {
  const ymd = isoToYmd(iso);
  if (!ymd) return iso;

  // 로컬 타임존 영향 최소화를 위해 "정오"를 사용
  const dt = new Date(ymd.y, ymd.m - 1, ymd.d, 12, 0, 0, 0);
  dt.setDate(dt.getDate() + deltaDays);

  const y = dt.getFullYear();
  const m = dt.getMonth() + 1;
  const d = dt.getDate();
  return ymdToIso({ y, m, d });
}

export function addMonthsClamped(
  iso: string,
  deltaMonths: number
): { iso: string; clamped: boolean } {
  const ymd = isoToYmd(iso);
  if (!ymd) return { iso, clamped: false };

  const total = ymd.y * 12 + (ymd.m - 1) + deltaMonths;
  const ny = Math.floor(total / 12);
  const nm0 = total % 12;
  const nm = nm0 + 1;

  const dim = daysInMonth(ny, nm);
  const nd = Math.min(ymd.d, dim);
  const clamped = nd !== ymd.d;

  return { iso: ymdToIso({ y: ny, m: nm, d: nd }), clamped };
}

export function setDayOfMonthClamped(
  baseIso: string,
  day: number
): { iso: string; clamped: boolean } {
  const ymd = isoToYmd(baseIso);
  if (!ymd) return { iso: baseIso, clamped: false };

  const dim = daysInMonth(ymd.y, ymd.m);
  const nd = Math.min(Math.max(day, 1), dim);
  const clamped = nd !== day;

  return { iso: ymdToIso({ y: ymd.y, m: ymd.m, d: nd }), clamped };
}
