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

  // Header actions (expanded에서만 노출)
  headerAction: {
    editName: "부서명 수정",
    cancelEditName: "취소",
    deleteDepartment: "부서 삭제",
    save: "저장",
  },

  // Form 영역 (기록 추가)
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

  // History edit mode
  historyEdit: {
    toggleOn: "편집",
    toggleOff: "완료",
    badge: "편집중",
    editActionIcon: "...", // ✅ 내역 수정 버튼 텍스트(아이콘/점3개)
    editActionTitle: "수정",
    editActionAria: "내역 수정",
  },

  // History row edit UI labels & buttons
  historyEditRow: {
    label: {
      type: "종류",
      amount: "금액",
      memo: "메모",
    },
    button: {
      cancel: "취소",
      save: "저장",
    },
  },

  // Alerts & confirms
  dialog: {
    alert: {
      amountMustBePositive: "금액을 0보다 크게 입력해주세요.",
      nameRequired: "부서명을 입력해주세요.",
    },
    confirm: {
      deleteDepartment: "정말 부서를 삭제합니까?",
      discardOnClose: "저장하지 않은 변경사항이 있습니다. 그래도 닫을까요?",
      discardOnSwitchHistory:
        "저장하지 않은 내역 수정이 있습니다. 저장하지 않고 다른 내역을 수정할까요?",
    },
  },
} as const;
