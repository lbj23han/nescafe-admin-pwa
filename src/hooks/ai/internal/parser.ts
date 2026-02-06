import type { ReservationIntent } from "./types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function toStrOrNull(v: unknown): string | null {
  if (v === null) return null;
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t : null;
}

function toNumOrNull(v: unknown): number | null {
  if (v === null) return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return null;
}

function toStrArr(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === "string") as string[];
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0.5;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function shouldHideMultipleAmountWarning(w: string) {
  const t = w.trim();
  return /금액이\s*여러\s*개/.test(t) && /(하나|1개).*(사용|적용)/.test(t);
}

/**
 * 단가(라인 금액)로 해석 가능한 패턴이 rawText에 있는지
 * - (수량+단위)+금액원: "10잔 3000원"
 * - 또는 (메뉴)+금액원: "아메 3000원"
 */
function hasUnitPriceLikePattern(rawText: string) {
  const t = rawText.trim();
  if (!t) return false;

  // "10잔 3000원", "10개 8,000원" 등
  const withQty = /\d+\s*(잔|개|명|건)\s*(\d{1,3}(?:,\d{3})+|\d+)\s*원/.test(t);

  if (withQty) return true;

  // "아메 3000원" 같이 메뉴+단가만 있는 케이스(보수적으로)
  // 너무 넓게 잡으면 총액/기타와 충돌하니:
  // - 숫자 앞에 한글/영문 메뉴 토큰이 있고
  // - "원"이 붙어있는 경우만
  const menuPriceOnly = /[가-힣A-Za-z]+\s*(\d{1,3}(?:,\d{3})+|\d+)\s*원/.test(
    t
  );

  return menuPriceOnly;
}

function shouldHideAmountAmbiguousWarning(w: string) {
  const t = w.trim();
  return /금액.*(단위|명확)/.test(t);
}

export function parseReservationIntent(params: {
  data: unknown;
  rawText: string;
  normalizedDate: string;
  extractedAmount: number | null;
}): ReservationIntent {
  const { data, rawText, normalizedDate, extractedAmount } = params;

  const base: ReservationIntent = {
    kind: "reservation",
    date: normalizedDate,
    department: null,
    menu: null,
    amount: extractedAmount,
    time: null,
    location: null,
    memo: null,
    confidence: 0.5,
    assumptions: [],
    warnings: [],
    raw_text: rawText,
  };

  if (!isRecord(data)) {
    return {
      ...base,
      confidence: 0.2,
      warnings: ["AI 출력 파싱 실패: 객체가 아님"],
    };
  }

  let warnings = toStrArr(data.warnings);

  const modelDate = toStrOrNull(data.date);
  if (modelDate && modelDate !== normalizedDate) {
    warnings.push(
      `AI가 date를 '${modelDate}'로 출력했지만, 입력에서 추출한 '${normalizedDate}'로 고정했어요.`
    );
  }

  const modelAmount = toNumOrNull(data.amount);

  const unitPriceLike = hasUnitPriceLikePattern(rawText);

  if (extractedAmount === null) {
    if (modelAmount !== null) {
      warnings.push(
        `AI가 amount를 '${modelAmount}'로 추정했지만, 총액 키워드가 없어 null로 고정했어요.`
      );
    }

    // 단가 패턴이 있는 케이스에서 아래 warning들은 UX상 혼란이라 숨김
    warnings = warnings.filter((w) => !shouldHideMultipleAmountWarning(w));
    if (unitPriceLike) {
      warnings = warnings.filter((w) => !shouldHideAmountAmbiguousWarning(w));
    }
  } else {
    if (modelAmount !== null && modelAmount !== extractedAmount) {
      warnings.push(
        `AI가 amount를 '${modelAmount}'로 출력했지만, 입력에서 추출한 '${extractedAmount}'로 고정했어요.`
      );
    }
  }

  return {
    ...base,
    department: toStrOrNull(data.department),
    menu: toStrOrNull(data.menu),
    amount: extractedAmount,
    time: toStrOrNull(data.time),
    location: toStrOrNull(data.location),
    memo: toStrOrNull(data.memo),
    confidence: clamp01(
      typeof data.confidence === "number" ? data.confidence : 0.5
    ),
    assumptions: toStrArr(data.assumptions),
    warnings,
    raw_text: rawText,
  };
}
