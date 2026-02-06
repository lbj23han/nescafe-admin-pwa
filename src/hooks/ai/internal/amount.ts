function stripNumber(s: string) {
  return s.replace(/[,\s]/g, "");
}

function toInt(s: string) {
  const n = Number(stripNumber(s));
  if (!Number.isFinite(n)) return null;
  const out = Math.floor(n);
  return out >= 0 ? out : null;
}

/**
 * 총액 키워드가 명시된 경우만 amount(총액)로 추출한다.
 * - 지원(총액 명시): "총 8000원", "합계 8000원", "총액 8000원", "총금액 8000원", "총계 8000원"
 * - 미지원: 단가/라인금액처럼 보이는 금액들 (예: "아메10잔 3000원, 라떼10잔 3500원")
 * - 금액 hallucination 차단 + 자동확정 금지 정책 유지
 */
export function extractAmountKRW(input: string): number | null {
  const text = input.trim();
  if (!text) return null;

  // 총액 명시 키워드 (총/합계/총액/총금액/총계)
  // - "총 180000원" 같은 형태도 커버
  const totalKeywordRe = /(총액|합계|총\s*금액|총\s*계|총)\s*[:：]?\s*/;
  const mTotal = text.match(totalKeywordRe);

  // 총액 키워드가 없으면, amount(총액)는 추출하지 않음
  if (!mTotal) return null;

  // 키워드 이후 텍스트에서만 금액 추출
  const start = (mTotal.index ?? 0) + mTotal[0].length;
  const tail = text.slice(start).trim();
  if (!tail) return null;

  // 1) "만원" / "만 원"
  {
    const m = tail.match(/(\d[\d,\s]*)\s*만\s*원/);
    if (m) {
      const v = toInt(m[1]);
      if (v === null) return null;
      return v * 10000;
    }
    const m2 = tail.match(/(\d[\d,\s]*)\s*만원/);
    if (m2) {
      const v = toInt(m2[1]);
      if (v === null) return null;
      return v * 10000;
    }
  }

  // 2) "천원" / "천 원"
  {
    const m = tail.match(/(\d[\d,\s]*)\s*천\s*원/);
    if (m) {
      const v = toInt(m[1]);
      if (v === null) return null;
      return v * 1000;
    }
    const m2 = tail.match(/(\d[\d,\s]*)\s*천원/);
    if (m2) {
      const v = toInt(m2[1]);
      if (v === null) return null;
      return v * 1000;
    }
  }

  // 3) "원"
  {
    const m = tail.match(/(\d[\d,\s]*)\s*원/);
    if (m) {
      const v = toInt(m[1]);
      if (v === null) return null;
      return v;
    }
  }

  return null;
}
