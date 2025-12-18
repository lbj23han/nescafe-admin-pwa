// constants/departments/card.ts
import type { HistoryType } from "@/lib/departmentStorage";

export const DEPARTMENT_HISTORY_LABEL: Record<HistoryType, string> = {
  deposit: "예치금 입금",
  order: "주문(자동 미수금 계산)",
  debtPayment: "미수금 상환",
  payment: "주문(자동 예치금 차감)",
};

export const DEPARTMENT_CARD_COPY = {
  // Header 영역
  summary: {
    depositPrefix: "예치금",
    debtPrefix: "미수금",
    currencySuffix: "원",
  },

  // Expand/Collapse
  toggle: {
    expand: "상세 보기",
    collapse: "접기",
    icon: {
      expanded: "▲",
      collapsed: "▼",
    },
  },

  // Form 영역
  formTitle: "입·출금 / 주문 기록 추가",
  field: {
    type: "종류",
    amount: "금액",
    memo: "메모",
  },
  placeholder: {
    amount: "0",
    memo: "예: 아메리카노 2잔, 현금 입금 등",
  },
  submit: "추가하기",

  // History 영역
  historyTitle: "입·출금 / 주문 내역",
  historyEmpty: "아직 기록이 없습니다.",
} as const;
