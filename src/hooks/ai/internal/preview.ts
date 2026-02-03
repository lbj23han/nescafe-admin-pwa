import type { ReservationIntent } from "./types";

function formatWon(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function toReservationPreviewText(intent: ReservationIntent) {
  const lines: string[] = [];

  lines.push("예약 등록 미리보기");
  lines.push(`- 날짜: ${intent.date}`);
  lines.push(`- 부서: ${intent.department ?? "부서 미지정"}`);
  lines.push(`- 메뉴: ${intent.menu ?? "메뉴 미지정"}`);
  lines.push(
    `- 금액: ${intent.amount == null ? "금액 없음" : formatWon(intent.amount)}`
  );
  lines.push(`- 시간: ${intent.time ?? "시간 없음"}`);
  lines.push(`- 장소: ${intent.location ?? "장소 없음"}`);

  if (intent.memo) lines.push(`- 메모: ${intent.memo}`);

  if (intent.warnings?.length) {
    lines.push("");
    lines.push("⚠️ 확인 필요");
    for (const w of intent.warnings) lines.push(`- ${w}`);
  }

  if (intent.assumptions?.length) {
    lines.push("");
    lines.push("ℹ️ 해석 근거");
    for (const a of intent.assumptions) lines.push(`- ${a}`);
  }

  return lines.join("\n");
}
