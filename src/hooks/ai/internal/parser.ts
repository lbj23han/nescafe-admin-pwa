import type { LedgerAction, LedgerIntent, ReservationIntent } from "./types";

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
  const menuPriceOnly = /[가-힣A-Za-z]+\s*(\d{1,3}(?:,\d{3})+|\d+)\s*원/.test(
    t
  );

  return menuPriceOnly;
}

function shouldHideAmountAmbiguousWarning(w: string) {
  const t = w.trim();
  return /금액.*(단위|명확)/.test(t);
}

/**
 * 모델이 department를 못 뽑는 케이스를 위한 "보수적" 폴백.
 * - 조직 suffix가 있는 토큰만 추출
 * - 예: 모아주택부서 / 모아주택과 / 안드로이드1팀 / 운영지원실
 */
function fallbackExtractDepartment(rawText: string): string | null {
  const t = rawText.trim();
  if (!t) return null;

  const re =
    /(?:^|[\s,])([가-힣A-Za-z0-9]+(?:부서|과|팀|파트|실|국|처))(?=$|[\s,])/;

  const m = t.match(re);
  if (!m) return null;

  const out = (m[1] ?? "").trim();
  return out ? out : null;
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

  const modelDepartment = toStrOrNull(data.department);
  const fallbackDepartment =
    modelDepartment ?? fallbackExtractDepartment(rawText);

  const assumptions = toStrArr(data.assumptions);
  if (!modelDepartment && fallbackDepartment) {
    assumptions.push(
      `부서가 불명확하여 입력문에서 '${fallbackDepartment}'를 부서 후보로 추출했어요.`
    );
  }

  return {
    ...base,
    department: fallbackDepartment,
    menu: toStrOrNull(data.menu),
    amount: extractedAmount,
    time: toStrOrNull(data.time),
    location: toStrOrNull(data.location),
    memo: toStrOrNull(data.memo),
    confidence: clamp01(
      typeof data.confidence === "number" ? data.confidence : 0.5
    ),
    assumptions,
    warnings,
    raw_text: rawText,
  };
}

function toLedgerActionOrNull(v: unknown): LedgerAction | null {
  if (v === null) return null;
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return null;

  if (
    t === "deposit" ||
    t === "withdraw" ||
    t === "createDebt" ||
    t === "settleDebt"
  ) {
    return t;
  }
  return null;
}

export function parseLedgerIntent(params: {
  data: unknown;
  rawText: string;
  extractedAmount: number | null;
}): LedgerIntent {
  const { data, rawText, extractedAmount } = params;

  const base: LedgerIntent = {
    kind: "ledger",
    department: null,
    action: null,
    amount: extractedAmount,
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

  const modelDepartment = toStrOrNull(data.department);
  const fallbackDepartment =
    modelDepartment ?? fallbackExtractDepartment(rawText);

  const modelActionRaw = data.action;
  const action = toLedgerActionOrNull(modelActionRaw);

  const warnings = toStrArr(data.warnings);
  const assumptions = toStrArr(data.assumptions);

  if (modelActionRaw != null && action == null) {
    warnings.push(
      `AI가 action을 '${String(
        modelActionRaw
      )}'로 출력했지만, 지원하지 않아 null로 처리했어요.`
    );
  }

  const modelAmount = toNumOrNull(data.amount);

  if (extractedAmount === null) {
    if (modelAmount !== null) {
      warnings.push(
        `AI가 amount를 '${modelAmount}'로 추정했지만, 입력에서 금액 단위를 확정할 수 없어 null로 처리했어요.`
      );
    }
  } else {
    if (modelAmount !== null && modelAmount !== extractedAmount) {
      warnings.push(
        `AI가 amount를 '${modelAmount}'로 출력했지만, 입력에서 추출한 '${extractedAmount}'로 고정했어요.`
      );
    }
  }

  if (!modelDepartment && fallbackDepartment) {
    assumptions.push(
      `부서가 불명확하여 입력문에서 '${fallbackDepartment}'를 부서 후보로 추출했어요.`
    );
  }

  return {
    ...base,
    department: fallbackDepartment,
    action,
    amount: extractedAmount,
    confidence: clamp01(
      typeof data.confidence === "number" ? data.confidence : 0.5
    ),
    assumptions,
    warnings,
    raw_text: rawText,
  };
}
