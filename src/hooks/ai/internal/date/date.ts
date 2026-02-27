import type { NormalizedDateResult } from "../types";

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function isValidYmd(y: number, m: number, d: number) {
  if (y < 2000 || y > 2100) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;

  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

function hasNextYearHint(text: string) {
  // “내년”, “내년에”, “내년 2/2” 등
  return /내년/.test(text);
}

export function extractNormalizedDate(
  input: string,
  now = new Date()
): NormalizedDateResult {
  const text = input.trim();
  if (!text) return { ok: false };

  const baseYear = now.getFullYear() + (hasNextYearHint(text) ? 1 : 0);

  // 1) YYYY-MM-DD
  {
    const m = text.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) {
      const y = Number(m[1]);
      const mm = Number(m[2]);
      const dd = Number(m[3]);
      if (!Number.isFinite(y) || !Number.isFinite(mm) || !Number.isFinite(dd))
        return { ok: false };
      if (!isValidYmd(y, mm, dd)) return { ok: false };
      return {
        ok: true,
        date: `${y}-${pad2(mm)}-${pad2(dd)}`,
        matchedText: m[0],
      };
    }
  }

  // 2) M/D or M.D
  {
    const m = text.match(/(\d{1,2})\s*[\/.]\s*(\d{1,2})/);
    if (m) {
      const mm = Number(m[1]);
      const dd = Number(m[2]);
      if (!Number.isFinite(mm) || !Number.isFinite(dd)) return { ok: false };
      if (!isValidYmd(baseYear, mm, dd)) return { ok: false };
      return {
        ok: true,
        date: `${baseYear}-${pad2(mm)}-${pad2(dd)}`,
        matchedText: m[0],
      };
    }
  }

  // 3) M월D일
  {
    const m = text.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
    if (m) {
      const mm = Number(m[1]);
      const dd = Number(m[2]);
      if (!Number.isFinite(mm) || !Number.isFinite(dd)) return { ok: false };
      if (!isValidYmd(baseYear, mm, dd)) return { ok: false };
      return {
        ok: true,
        date: `${baseYear}-${pad2(mm)}-${pad2(dd)}`,
        matchedText: m[0],
      };
    }
  }

  return { ok: false };
}
