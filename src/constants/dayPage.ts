export const DAY_PAGE_COPY = {
  backButton: "← 뒤로",
  title: "예약 입력",
  emptyList: "등록된 예약이 없습니다.",
  dateFormat: (m: string, d: string) => `${m}월 ${d}일`,

  status: {
    inProgress: "진행 중",
    completed: "✅ 완료된 예약",
  },

  buttons: {
    add: "예약 추가하기",
    submit: "입력 완료 (예약 추가하기)",
    complete: "완료",
    cancel: "취소",
    edit: "수정",
    editSave: "수정 완료",
    editCancel: "수정 취소",
    close: "닫기",
    addRow: "+ 추가",
  },

  settleConfirm: {
    title: "예치금 정산",
    body: "예치금에서 차감합니다.\n예치금이 부족할 시 미수금 발생으로 전환됩니다.",
    cancel: "닫기",
    confirm: "확인",
    loading: "처리 중…",
  },

  alerts: {
    requiredDepartmentAndMenu: "부서와 메뉴는 필수입니다.",
    confirmComplete: "완료된 예약입니까?",
    confirmCancel: "예약을 취소하시겠습니까?",
    editConfirm: "수정 사항을 저장하시겠습니까?",
  },

  form: {
    department: {
      label: "부서",
      placeholder: "예: 모아주택",
      selectPlaceholder: "직접 입력 (부서 선택 가능)",
      loadingPlaceholder: "부서 목록 불러오는 중…",
    },
    menu: {
      label: "메뉴",
      placeholder: "예: 아메리카노 10잔",
    },
    location: {
      label: "위치 (선택)",
      placeholder: "예: 3층 회의실",
    },
    time: {
      label: "시간 (선택)",
      placeholder: "예: 14:00",
    },
    amount: {
      label: "금액 (선택)",
      placeholder: "예: 55000",
    },
  },

  meta: {
    amountLabel: "금액",
    timeLabel: "시간",
    locationLabel: "위치",
    amountUnit: "원",
    separator: " · ",
  },

  format: {
    reservationMeta: (args: {
      amount?: number | null;
      time?: string | null;
      location?: string | null;
    }) => {
      const parts: string[] = [];

      if (typeof args.amount === "number") {
        parts.push(
          `${DAY_PAGE_COPY.meta.amountLabel}: ${args.amount.toLocaleString()}${
            DAY_PAGE_COPY.meta.amountUnit
          }`
        );
      }

      if (args.time) {
        parts.push(`${DAY_PAGE_COPY.meta.timeLabel}: ${args.time}`);
      }

      if (args.location) {
        parts.push(`${DAY_PAGE_COPY.meta.locationLabel}: ${args.location}`);
      }

      return parts.join(DAY_PAGE_COPY.meta.separator);
    },
  },
};
