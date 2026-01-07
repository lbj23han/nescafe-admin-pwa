export const RESET_PASSWORD_COPY = {
  appName: "Cafe Ledger",
  title: "비밀번호 재설정",
  subtitle: "새 비밀번호를 설정합니다.",

  fields: {
    email: "이메일",
    password: "새 비밀번호",
    confirmPassword: "새 비밀번호 확인",
  },

  placeholders: {
    password: "••••••••",
  },

  actions: {
    requestLink: "재설정 링크 받기",
    requestingLink: "링크 요청 중…",
    reset: "비밀번호 변경",
    resetting: "변경 중…",
    backToLogin: "로그인으로 돌아가기",
  },

  helper: {
    passwordMismatch: "비밀번호가 일치하지 않습니다.",
    passwordPolicyTitle: "비밀번호 조건",
    passwordPolicyLines: [
      "8자 이상",
      "영문 1자 이상을 포함",
      "숫자 1개 이상을 포함",
    ],
  },

  messages: {
    linkSent:
      "재설정 메일을 보냈습니다. 메일함에서 링크를 눌러 새 비밀번호를 설정하세요.",
    invalidSession:
      "재설정 세션을 확인할 수 없습니다. 메일의 링크로 다시 접속해 주세요.",
    done: "비밀번호가 변경되었습니다. 다시 로그인해 주세요.",
  },

  dialogs: {
    confirmReset: "비밀번호를 변경할까요?",
  },

  errors: {
    resetFailed: "비밀번호 재설정 중 오류가 발생했습니다.",
  },
} as const;
