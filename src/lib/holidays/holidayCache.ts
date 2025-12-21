export type HolidayMap = Record<string, string>;

const KEY_PREFIX = "cafe-ledger-holidays:"; // year별 저장

function isRecordOfStrings(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object") return false;
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof k !== "string" || typeof v !== "string") return false;
  }
  return true;
}

export function readHolidayCache(year: number): HolidayMap | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(`${KEY_PREFIX}${year}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!isRecordOfStrings(parsed)) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function writeHolidayCache(year: number, map: HolidayMap) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(`${KEY_PREFIX}${year}`, JSON.stringify(map));
  } catch {
    // ignore quota errors
  }
}
