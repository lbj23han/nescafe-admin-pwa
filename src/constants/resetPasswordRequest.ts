export const RESET_PASSWORD_REQUEST_COPY = {
  title: "비밀번호 재설정",
  subtitle: "이메일을 입력하면 재설정 링크를 보내드립니다.",

  fields: {
    email: "이메일",
  },

  placeholders: {
    email: "email@example.com",
  },

  actions: {
    send: "재설정 메일 보내기",
    sending: "메일 전송 중…",
    backToLogin: "로그인으로 돌아가기",
  },

  messages: {
    emailRequired: "이메일을 입력해 주세요.",
    done: "재설정 메일을 보냈습니다. 메일함에서 링크를 확인해 주세요.",
  },

  errors: {
    requestFailed: "요청 중 오류가 발생했습니다.",
  },
} as const;
