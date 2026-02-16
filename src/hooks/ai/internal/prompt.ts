export function buildReservationPrompt(args: {
  rawText: string;
  normalizedDate: string;
  extractedAmount: number | null;
}) {
  const { rawText, normalizedDate, extractedAmount } = args;

  const amountLine =
    extractedAmount === null
      ? "추출 금액(amount): null (사용자 입력에 금액 단위가 없으므로 amount는 반드시 null)"
      : `추출 금액(amount): ${extractedAmount} (원 단위 숫자, amount는 반드시 이 값을 그대로 사용)`;

  return [
    "너는 카페 내부 장부 앱의 AI 입력 보조다.",
    "목표: 사용자의 자연어를 예약 등록용 JSON으로 구조화한다.",
    "",
    "중요 규칙:",
    "- 질문하지 말 것. 애매하면 assumptions/warnings에 적을 것.",
    "- 자동 적용하지 않는다(해석만).",
    "- date는 반드시 아래 '정규화 날짜' 값을 그대로 사용한다.",
    "- amount는 반드시 아래 '추출 금액' 값을 그대로 사용한다.",
    "- 사용자가 금액을 쓰지 않았다면 amount는 반드시 null.",
    "- 없는 값은 null.",
    "",
    `정규화 날짜(date): ${normalizedDate}`,
    amountLine,
    "",
    "사용자 입력:",
    rawText,
  ].join("\n");
}
