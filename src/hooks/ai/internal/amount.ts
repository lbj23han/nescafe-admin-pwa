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
 * 사용자 입력에서 금액을 "원 단위 숫자"로 추출
 * - 지원: 8000원, 8,000원, 5만원, 5 만원, 3천원, 3 천원
 * - 미지원(의도적으로): 단위 없는 숫자(예: "2잔")는 금액으로 취급하지 않음
 */
export function extractAmountKRW(input: string): number | null {
  const text = input.trim();
  if (!text) return null;

  // 1) "만원" / "만 원" (공백 허용)
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

  // 3) "원"
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
