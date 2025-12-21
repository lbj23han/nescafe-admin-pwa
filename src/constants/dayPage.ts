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
};
