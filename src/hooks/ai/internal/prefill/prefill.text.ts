import type { ReservationIntent } from "../types";
import { removeRelativeDateNoise } from "../utils/textNoise";
import { safeParam } from "./prefill.utils";

function normalizeKoreanWon(text: string) {
  let t = text;
  t = t.replace(/(\d+)\s*천\s*원/g, (_, n) => `${Number(n) * 1000}원`);
  t = t.replace(/(\d+)\s*만\s*원/g, (_, n) => `${Number(n) * 10000}원`);
  t = t.replace(/(\d+)\s*백\s*원/g, (_, n) => `${Number(n) * 100}원`);
  return t;
}

/** 총액 키워드가 명시된 경우만 amount로 인정 */
export function hasExplicitTotal(text: string) {
  return /(총액|합계|총\s*금액|총\s*계|총\s*[:：]?)/.test(text);
}

export function sanitizeForItemParsing(text: string) {
  let t = normalizeKoreanWon(text);

  // 라벨류 제거 (부서/장소/시간/메모 등)
  t = t
    .replace(/(^|\s)(부서|장소|위치|시간|메모)\s*[:：]\s*/g, " ")
    .replace(/\s+/g, " ");

  t = removeRelativeDateNoise(t);

  // 절대 날짜 제거
  t = t
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, " ")
    .replace(/\b\d{1,2}\s*[./-]\s*\d{1,2}\b/g, " ")
    .replace(/\b\d{1,2}\s*월\s*\d{1,2}\s*일\b/g, " ");

  // 시간 제거 (한글 경계 문제로 "시" 남는 것 방지)
  t = t
    .replace(/(?:^|[\s,])\d{1,2}\s*:\s*\d{2}(?=\s|,|$)/g, " ")
    .replace(
      /(?:^|[\s,])(오전|오후)\s*\d{1,2}\s*시(\s*\d{1,2}\s*분)?(?=\s|,|$)/g,
      " "
    )
    .replace(/(?:^|[\s,])\d{1,2}\s*시(\s*\d{1,2}\s*분)?(?=\s|,|$)/g, " ");

  return t.replace(/\s+/g, " ").trim();
}

export function inferDepartmentFromLocation(
  intent: ReservationIntent
): string | null {
  const dep = (intent.department ?? "").trim();
  if (dep) return null;

  const loc = (intent.location ?? "").trim();
  if (!loc) return null;

  const cleaned = sanitizeForItemParsing(intent.raw_text);
  if (!cleaned) return null;

  const first = cleaned.split(/\s+/)[0] ?? "";
  if (!first) return null;

  if (first === loc) return loc;
  return null;
}

export function removeKnownNoise(intent: ReservationIntent): {
  cleanedText: string;
  inferredDept: string | null;
  effectiveDepartment?: string;
  effectiveLocation?: string;
} {
  let t = intent.raw_text;

  const inferredDept = inferDepartmentFromLocation(intent);

  const dep = safeParam(intent.department) ?? inferredDept ?? undefined;
  const locRaw = safeParam(intent.location);

  // location이 inferredDept와 동일하면 "장소"로 취급하지 않음
  const loc = inferredDept && locRaw === inferredDept ? undefined : locRaw;

  const time = safeParam(intent.time);

  // 값 자체 제거(모델이 뽑아준 값이 raw_text에 그대로 있을 때)
  if (dep) t = t.replaceAll(dep, " ");
  if (loc) t = t.replaceAll(loc, " ");
  if (time) t = t.replaceAll(time, " ");

  // 라벨/시간/날짜 등 일반 노이즈 제거 (+ 상대날짜 제거 포함)
  t = sanitizeForItemParsing(t);

  return {
    cleanedText: t.replace(/\s+/g, " ").trim(),
    inferredDept,
    effectiveDepartment: dep,
    effectiveLocation: loc,
  };
}

export function stripLeadingToken(menu: string, token: string) {
  const m = menu.trim();
  const t = token.trim();
  if (!m || !t) return m;

  if (m === t) return "";
  if (m.startsWith(`${t} `)) return m.slice(t.length).trim();
  return m;
}

export function normalizeWonText(text: string) {
  return normalizeKoreanWon(text);
}
