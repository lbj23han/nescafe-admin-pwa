import type {
  LedgerAction,
  LedgerIntent,
  ReservationIntent,
} from "../../types";
import { fallbackExtractDepartment } from "./parser.department";
import { refineReservationWarnings } from "./parser.reservationWarnings";
import {
  clamp01,
  isRecord,
  toNumOrNull,
  toStrArr,
  toStrOrNull,
} from "./parser.utils";

function toLedgerActionOrNull(v: unknown): LedgerAction | null {
  const t = toStrOrNull(v);
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

  const modelDate = toStrOrNull(data.date);
  const modelAmount = toNumOrNull(data.amount);

  const warnings = refineReservationWarnings({
    rawText,
    warnings: toStrArr(data.warnings),
    extractedAmount,
    modelAmount,
    normalizedDate,
    modelDate,
  });

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
  } else if (modelAmount !== null && modelAmount !== extractedAmount) {
    warnings.push(
      `AI가 amount를 '${modelAmount}'로 출력했지만, 입력에서 추출한 '${extractedAmount}'로 고정했어요.`
    );
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
