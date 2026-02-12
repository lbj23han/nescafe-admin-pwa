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
 * 총액 키워드가 명시된 경우만 amount(총액)로 추출한다. (예약용 정책)
 * - 지원(총액 명시): "총 8000원", "합계 8000원", "총액 8000원", "총금액 8000원", "총계 8000원"
 * - 미지원: 단가/라인금액처럼 보이는 금액들
 * - 금액 hallucination 차단 + 자동확정 금지 정책 유지
 */
export function extractAmountKRW(input: string): number | null {
  const text = input.trim();
  if (!text) return null;

  const totalKeywordRe = /(총액|합계|총\s*금액|총\s*계|총)\s*[:：]?\s*/;
  const mTotal = text.match(totalKeywordRe);

  if (!mTotal) return null;

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

/**
 * 장부용 금액 추출:
 * - 입력에 금액 단위가 명확히 포함된 경우만 확정한다.
 * - "5만원", "5만", "2천원", "2천", "50,000원" => 확정
 * - 단위 없는 숫자(예: "50000")는 null (추정 금지)
 *
 * 주의: 예약에서 이걸 쓰면 단가/라인금액을 총액으로 오인할 위험이 있어 사용 금지.
 */
export function extractAmountKRWLoose(input: string): number | null {
  const text = input.trim();
  if (!text) return null;

  // 1) "만원" / "만 원"
  {
    const m = text.match(/(\d[\d,\s]*)\s*만\s*원/);
    if (m) {
      const v = toInt(m[1]);
      if (v === null) return null;
      return v * 10000;
    }
    const m2 = text.match(/(\d[\d,\s]*)\s*만원/);
    if (m2) {
      const v = toInt(m2[1]);
      if (v === null) return null;
      return v * 10000;
    }
  }

  // 1-2) "만" (원 생략 관용표현) — ex) "5만 입금"
  {
    const m = text.match(/(\d[\d,\s]*)\s*만(?!\s*원)/);
    if (m) {
      const v = toInt(m[1]);
      if (v === null) return null;
      return v * 10000;
    }
  }

  // 2) "천원" / "천 원"
  {
    const m = text.match(/(\d[\d,\s]*)\s*천\s*원/);
    if (m) {
      const v = toInt(m[1]);
      if (v === null) return null;
      return v * 1000;
    }
    const m2 = text.match(/(\d[\d,\s]*)\s*천원/);
    if (m2) {
      const v = toInt(m2[1]);
      if (v === null) return null;
      return v * 1000;
    }
  }

  // 2-2) "천" (원 생략) — ex) "2천 입금"
  {
    const m = text.match(/(\d[\d,\s]*)\s*천(?!\s*원)/);
    if (m) {
      const v = toInt(m[1]);
      if (v === null) return null;
      return v * 1000;
    }
  }

  // 3) "원" (명시된 경우만)
  {
    const m = text.match(/(\d[\d,\s]*)\s*원/);
    if (m) {
      const v = toInt(m[1]);
      if (v === null) return null;
      return v;
    }
  }

  return null;
}
