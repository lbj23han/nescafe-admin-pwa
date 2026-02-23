import type { LedgerIntent, ReservationIntent } from "../../types";
import {
  computeExpectedTotal,
  extractLineItemsFromRawText,
  formatMenuWithUnitPrices,
} from "../preview/reservationItems";
import { formatLedgerAction, formatWon } from "../preview/format";

export function toReservationPreviewText(intent: ReservationIntent) {
  const lines: string[] = [];

  const lineItems = extractLineItemsFromRawText(intent);
  const expectedTotal =
    intent.amount == null ? computeExpectedTotal(lineItems) : null;

  lines.push("예약 등록 미리보기");
  lines.push(`- 날짜: ${intent.date}`);
  lines.push(`- 부서: ${intent.department ?? "부서 미지정"}`);
  lines.push(`- 메뉴: ${formatMenuWithUnitPrices(intent)}`);

  if (intent.amount == null) {
    lines.push(
      expectedTotal != null
        ? `- 금액: 총액은 입력되지 않았어요 (예상 합계: ${formatWon(
            expectedTotal
          )})`
        : `- 금액: 총액은 입력되지 않았어요`
    );
  } else {
    lines.push(`- 금액: ${formatWon(intent.amount)}`);
  }

  lines.push(`- 시간: ${intent.time ?? "시간 없음"}`);
  lines.push(`- 장소: ${intent.location ?? "장소 없음"}`);

  if (intent.memo) lines.push(`- 메모: ${intent.memo}`);

  if (intent.warnings?.length) {
    lines.push("", "⚠️ 확인 필요", ...intent.warnings.map((w) => `- ${w}`));
  }

  if (intent.assumptions?.length) {
    lines.push("", "ℹ️ 해석 근거", ...intent.assumptions.map((a) => `- ${a}`));
  }

  return lines.join("\n");
}

export function toLedgerPreviewText(intent: LedgerIntent) {
  const lines: string[] = [];

  lines.push("장부 작업 미리보기");
  lines.push(`- 부서: ${intent.department ?? "부서 미지정"}`);
  lines.push(`- 작업: ${formatLedgerAction(intent.action)}`);
  lines.push(
    intent.amount == null
      ? `- 금액: 미확정`
      : `- 금액: ${formatWon(intent.amount)}`
  );

  lines.push("", "아직 실제 장부에 반영되지 않습니다.");

  if (intent.warnings?.length) {
    lines.push("", "⚠️ 확인 필요", ...intent.warnings.map((w) => `- ${w}`));
  }

  if (intent.assumptions?.length) {
    lines.push("", "ℹ️ 해석 근거", ...intent.assumptions.map((a) => `- ${a}`));
  }

  return lines.join("\n");
}
