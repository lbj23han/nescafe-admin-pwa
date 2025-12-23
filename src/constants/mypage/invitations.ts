export const INVITATIONS_COPY = {
  title: "직원 초대",
  pendingBadge: (n: number) => `대기 ${n}건`,

  form: {
    labelEmail: "초대할 이메일",
    placeholderEmail: "초대할 이메일을 입력하세요",
    createButton: "초대 링크 생성",
    creatingButton: "생성 중...",
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
    email: "이메일",
    created: "생성",
    expires: "만료",
    accepted: "수락",
  },

  actions: {
    cancel: "취소",
  },

  alerts: {
    emailRequired: "초대할 이메일을 입력해주세요.",
  },
} as const;
