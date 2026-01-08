export const INVITATIONS_COPY = {
  title: "직원 초대",
  pendingBadge: (n: number) => `대기 ${n}건`,

  form: {
    labelEmail: "초대할 이메일",
    placeholderEmail: "초대할 이메일을 입력하세요",

    labelName: "이름(선택)",
    placeholderName: "초대할 직원의 이름을 입력하세요",

    createButton: "초대 링크 생성",
    creatingButton: "생성 중...",

    openButton: "초대하기",
    closeButton: "닫기",
  },

  lastCreated: {
    label: "초대 링크",
    expires: "만료",
    copyButton: "복사",
    copied: "복사됨",
    copyFailed: "복사 실패 (브라우저 권한 확인)",
  },

  summary: (pending: number, accepted: number) =>
    `초대 ${pending}건 · 초대된 직원 ${accepted}명`,

  loading: "불러오는 중...",

  sections: {
    pending: "초대 대기",
    accepted: "초대된 직원",
  },

  empty: {
    pending: "대기 중인 초대가 없습니다.",
    accepted: "아직 수락한 직원이 없습니다.",
  },

  fields: {
    name: "이름",
    email: "이메일",
    created: "생성",
    expires: "만료",
    accepted: "수락",
  },

  status: {
    pending: "대기",
    accepted: "승인됨",
  },

  actions: {
    cancel: "취소",
    revoke: "권한 해제",
    revoking: "해제 중...",
  },

  confirm: {
    revoke: "해당 직원의 권한을 해제할까요?",
  },

  warnings: {
    missingAcceptedBy: "아직 권한 해제를 할 수 없습니다.",
  },

  alerts: {
    emailRequired: "초대할 이메일을 입력해주세요.",
  },
} as const;
