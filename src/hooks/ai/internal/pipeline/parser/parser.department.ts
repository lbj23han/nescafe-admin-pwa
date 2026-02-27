/**
 * 모델이 department를 못 뽑는 케이스를 위한 "보수적" 폴백.
 * - 조직 suffix가 있는 토큰만 추출
 * - 예: 모아주택부서 / 모아주택과 / 안드로이드1팀 / 운영지원실
 */
export function fallbackExtractDepartment(rawText: string): string | null {
  const t = rawText.trim();
  if (!t) return null;

  const re =
    /(?:^|[\s,])([가-힣A-Za-z0-9]+(?:부서|과|팀|파트|실|국|처))(?=$|[\s,])/;

  const m = t.match(re);
  if (!m) return null;

  const out = (m[1] ?? "").trim();
  return out ? out : null;
}
