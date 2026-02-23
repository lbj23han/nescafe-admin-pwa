import type { LedgerIntent } from "../../types";

export function formatWon(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function digitsOnly(v: string) {
  return (v ?? "").replace(/[^\d]/g, "");
}

export function formatLedgerAction(action: LedgerIntent["action"]) {
  switch (action) {
    case "deposit":
      return "예치금 입금";
    case "withdraw":
      return "예치금 차감";
    case "createDebt":
      return "미수금 생성";
    case "settleDebt":
      return "미수금 정산";
    default:
      return "미확정";
  }
}
