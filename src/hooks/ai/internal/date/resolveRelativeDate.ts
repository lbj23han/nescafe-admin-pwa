import {
  addDays,
  addMonthsClamped,
  isoToYmd,
  setDayOfMonthClamped,
  ymdToIso,
} from "./kstDate";

type ResolveOk = {
  ok: true;
  date: string; // YYYY-MM-DD
  matchedText: string;
  warnings: string[];
};

type ResolveResult = ResolveOk | { ok: false };

const WEEKDAY_MAP: Record<string, number> = {
  월: 0,
  화: 1,
  수: 2,
  목: 3,
  금: 4,
  토: 5,
  일: 6,
};

// week starts Monday
function startOfWeekMondayIso(todayIso: string): string {
  const ymd = isoToYmd(todayIso);
  if (!ymd) return todayIso;

  const dt = new Date(ymd.y, ymd.m - 1, ymd.d, 12, 0, 0, 0);
  const jsDay = dt.getDay(); // 0 Sun .. 6 Sat
  const monBased = (jsDay + 6) % 7; // 0 Mon .. 6 Sun
  dt.setDate(dt.getDate() - monBased);

  return ymdToIso({
    y: dt.getFullYear(),
    m: dt.getMonth() + 1,
    d: dt.getDate(),
  });
}

function isoRegexOk(v: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

/**
 * 입력문에서 상대 날짜(내일/모레/이번주 수요일/다음달 3일 등)를
 * todayIso(KST 기준)로 해석해서 YYYY-MM-DD로 반환.
 *
 * - ok:false면 상대 날짜 패턴이 없거나/불명확
 * - ok:true면 date 확정(클라에서만 계산)
 */
export function resolveRelativeDate(args: {
  input: string;
  todayIso: string;
}): ResolveResult {
  const inputRaw = args.input ?? "";
  const input = inputRaw.trim();
  const todayIso = args.todayIso;

  if (!input || !isoRegexOk(todayIso)) return { ok: false };

  // 공백 제거한 버전도 함께 탐색(“다음주수요일” 대응)
  const compact = input.replace(/\s+/g, "");

  // 1) 내일 / 모레 / 오늘 / 어제 (옵션 포함)
  // - “오늘”도 상대표현으로 처리해주면 UX 좋아짐
  if (/(^|[\s,])(오늘)(?=$|[\s,])/.test(input) || compact.includes("오늘")) {
    return { ok: true, date: todayIso, matchedText: "오늘", warnings: [] };
  }

  if (/(^|[\s,])(내일)(?=$|[\s,])/.test(input) || compact.includes("내일")) {
    return {
      ok: true,
      date: addDays(todayIso, 1),
      matchedText: "내일",
      warnings: [],
    };
  }

  if (/(^|[\s,])(모레)(?=$|[\s,])/.test(input) || compact.includes("모레")) {
    return {
      ok: true,
      date: addDays(todayIso, 2),
      matchedText: "모레",
      warnings: [],
    };
  }

  if (/(^|[\s,])(어제)(?=$|[\s,])/.test(input) || compact.includes("어제")) {
    return {
      ok: true,
      date: addDays(todayIso, -1),
      matchedText: "어제",
      warnings: [],
    };
  }

  // 2) 이번주/다음주/다다음주 + 요일
  // 허용: "이번주 수요일", "이번주수요일", "다음주 금", "다다음주토요일"
  {
    const re =
      /(이번주|다음주|다다음주)(?:\s*)?(월|화|수|목|금|토|일)(?:요일)?/;
    const m = compact.match(re);
    if (m) {
      const which = m[1];
      const wd = m[2];
      const target = WEEKDAY_MAP[wd];
      if (target == null) return { ok: false };

      const warnings: string[] = [];

      if (which === "이번주") {
        // 이번주 기준: startOfWeek + target, 단 이미 지났거나 오늘이면 +7
        const base = startOfWeekMondayIso(todayIso);
        const candidate = addDays(base, target);
        const date = candidate <= todayIso ? addDays(candidate, 7) : candidate;

        return {
          ok: true,
          date,
          matchedText: `이번주${wd}요일`,
          warnings,
        };
      }

      const weekOffset = which === "다음주" ? 1 : 2;
      const base = startOfWeekMondayIso(todayIso);
      const mondayOfTargetWeek = addDays(base, weekOffset * 7);
      const date = addDays(mondayOfTargetWeek, target);

      return {
        ok: true,
        date,
        matchedText: `${which}${wd}요일`,
        warnings,
      };
    }
  }

  // 3) 이번달/다음달/다다음달 + N일
  {
    const re = /(이번달|다음달|다다음달)(?:\s*)?(\d{1,2})일/;
    const m = compact.match(re);
    if (m) {
      const which = m[1];
      const day = Number(m[2]);
      if (!Number.isFinite(day) || day <= 0) return { ok: false };

      const warnings: string[] = [];
      let base = todayIso;

      if (which === "다음달") {
        const r = addMonthsClamped(todayIso, 1);
        base = r.iso;
        if (r.clamped)
          warnings.push("다음달로 이동 중 날짜가 말일로 보정되었습니다.");
      } else if (which === "다다음달") {
        const r = addMonthsClamped(todayIso, 2);
        base = r.iso;
        if (r.clamped)
          warnings.push("다다음달로 이동 중 날짜가 말일로 보정되었습니다.");
      } else {
        base = todayIso;
      }

      const r2 = setDayOfMonthClamped(base, day);
      if (r2.clamped) {
        warnings.push("요청한 일자가 해당 월에 없어 말일로 보정되었습니다.");
      }

      return {
        ok: true,
        date: r2.iso,
        matchedText: `${which}${day}일`,
        warnings,
      };
    }
  }

  return { ok: false };
}
