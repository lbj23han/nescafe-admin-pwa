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
    amount: extractedAmount, // ✅ 서버 추출값으로 기본 고정
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

  const warnings = toStrArr(data.warnings);

  // date 불일치 방어
  const modelDate = toStrOrNull(data.date);
  if (modelDate && modelDate !== normalizedDate) {
    warnings.push(
      `AI가 date를 '${modelDate}'로 출력했지만, 입력에서 추출한 '${normalizedDate}'로 고정했어요.`
    );
  }

  // amount 불일치/추정 방지
  const modelAmount = toNumOrNull(data.amount);
  if (extractedAmount === null) {
    if (modelAmount !== null) {
      warnings.push(
        `AI가 amount를 '${modelAmount}'로 추정했지만, 사용자 입력에 금액이 없어 null로 고정했어요.`
      );
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

    // amount는 base에서 이미 서버 추출로 고정
    amount: extractedAmount,

    time: toStrOrNull(data.time),
    location: toStrOrNull(data.location),
    memo: toStrOrNull(data.memo),
    confidence: clamp01(
      typeof data.confidence === "number" ? data.confidence : 0.5
    ),
    assumptions: toStrArr(data.assumptions),
    warnings,
    raw_text: typeof data.raw_text === "string" ? data.raw_text : rawText,
  };
}
