export function toNonEmpty(v: string | null | undefined): string | null {
  if (!v) return null;
  const t = v.trim();
  return t ? t : null;
}

export function buildDeptCandidateTextFromRaw(raw: string) {
  let t = raw;

  // 날짜
  t = t
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, " ")
    .replace(/\b\d{1,2}[./]\d{1,2}\b/g, " ")
    .replace(/\b\d{1,2}\s*월\s*\d{1,2}\s*일\b/g, " ");

  // 시간(경계 문제로 시만 남는 케이스 방지: \b 제거)
  t = t
    .replace(/(?:^|[\s,])\d{1,2}\s*:\s*\d{2}(?=\s|,|$)/g, " ")
    .replace(/(?:^|[\s,])\d{1,2}\s*시(\s*\d{1,2}\s*분)?(?=\s|,|$)/g, " ")
    .replace(
      /(?:^|[\s,])(오전|오후)\s*\d{1,2}\s*시(\s*\d{1,2}\s*분)?(?=\s|,|$)/g,
      " "
    );

  // 금액
  t = t.replace(/\b\d{1,3}(?:,\d{3})+\s*원\b/g, " ");
  t = t.replace(/\b\d+\s*원\b/g, " ");

  // 수량
  t = t.replace(/\b\d+\s*(잔|개|명|건)\b/g, " ");

  // 총액 키워드
  t = t.replace(/(총액|합계|총\s*금액|총\s*계|총\s*[:：]?)/g, " ");

  // 구두점
  t = t.replace(/[(){}\[\]_.,:;'"“”‘’·\-]/g, " ");

  return t.replace(/\s+/g, " ").trim();
}

export function firstToken(v: string): string {
  const t = v.trim();
  if (!t) return "";
  return t.split(/\s+/)[0] ?? "";
}
