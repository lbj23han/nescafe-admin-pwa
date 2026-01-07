export const INVITE_PAGE_COPY = {
  title: "매장 초대",
  desc: "이 매장에 초대되었습니다. 가입/로그인 후 바로 수락을 진행합니다.",

  errors: {
    noToken: "토큰이 없습니다.",
    invalidLink: "유효하지 않은 초대 링크입니다.",
    fetchFailed: "초대 정보를 불러오지 못했습니다.",
  },

  meta: {
    shop: "매장",
    email: "초대 이메일",
    expiresAt: "만료",
  },

  status: {
    alreadyHandled: "이미 처리된 초대입니다.",
  },

  buttons: {
    signup: "가입하고 시작하기",
    login: "이미 계정이 있어요 (로그인)",
  },

  footnote: "가입/로그인 후 자동으로 수락 화면으로 돌아옵니다.",
} as const;

export const INVITE_ACCEPT_COPY = {
  title: "초대",
  messagesByCode: {
    invalid_token: "유효하지 않은 초대 링크입니다.",
    expired: "만료된 초대 링크입니다. 관리자에게 새 초대를 요청해주세요.",
    already_handled: "이미 처리된 초대입니다.",
    email_mismatch:
      "초대받은 이메일과 로그인한 이메일이 달라요. 올바른 계정으로 로그인했는지 확인해주세요.",
    unauthorized: "로그인이 필요합니다.",
    failed: "초대 수락에 실패했습니다.",
  } as Record<string, string>,

  autoStatus: {
    preparing: "자동 수락을 준비중입니다..",
    loading: "자동수락중...",
  },

  buttons: {
    accept: "수락하기",
    retry: "다시 시도",
    loading: "수락 처리 중...",
  },

  fallbackError: "초대 수락에 실패했습니다.",
  unknownError: "초대 수락 중 오류가 발생했습니다.",
  debugTitle: "디버그 정보 보기",
} as const;
