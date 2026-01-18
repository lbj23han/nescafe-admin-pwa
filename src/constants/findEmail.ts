export const FIND_EMAIL_COPY = {
  title: "아이디(이메일) 찾기",
  subtitle: "확인할 이메일을 입력해 주세요.",
  hint: "계정이 존재하는 경우에만 안내 메일이 발송됩니다. (계정 존재 여부는 안내하지 않습니다)",

  fields: {
    email: "이메일",
  },

  placeholders: {
    email: "email@example.com",
  },

  actions: {
    send: "안내 메일 보내기",
    sending: "메일 전송 중…",
    goPasswordReset: "비밀번호 재설정으로 이동",
    backToLogin: "로그인으로 돌아가기",
  },

  messages: {
    done: "안내 메일을 보냈습니다. 메일함을 확인해 주세요.",
  },

  errors: {
    requestFailed: "요청 중 오류가 발생했습니다.",
  },
} as const;
