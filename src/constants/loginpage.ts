// src/constants/loginpage.ts
export const LOGIN_PAGE_COPY = {
  appName: "Cafe Ledger",

  title: {
    login: "로그인",
    signup: "회원가입",
  },

  desc: {
    login: "계정으로 로그인하세요.",
    signup: "가게 계정을 생성합니다.",
  },

  labels: {
    shopName: "가게 이름",
    email: "이메일",
    password: "비밀번호",
    confirmPassword: "비밀번호 확인",
  },

  placeholders: {
    shopName: "Nescafe",
    email: "email@example.com",
    password: "8자 이상을 권장합니다",
    confirmPassword: "비밀번호를 다시 입력",
  },

  helper: {
    shopName: "나중에 마이페이지에서 변경할 수 있어요.",
    passwordMismatch: "비밀번호가 서로 일치하지 않습니다.",
    passwordPolicyTitle: "비밀번호 조건",
    passwordPolicyLines: [
      "8자 이상",
      "영문 1자 이상 포함",
      "숫자 1개 이상 포함",
    ],
  },

  buttons: {
    login: "로그인",
    signup: "가입하기",
    loading: "처리 중...",
    toLogin: "로그인으로",
    toSignup: "회원가입",
  },

  errors: {
    emailRequired: "이메일을 입력해주세요.",
    passwordRequired: "비밀번호를 입력해주세요.",
    shopNameRequired: "매장명을 입력해주세요.",
    passwordMismatch: "비밀번호 확인이 일치하지 않습니다.",

    invalidLoginCredentials: "비밀번호가 일치하지 않습니다.",
    userAlreadyRegistered:
      "이미 가입된 이메일입니다. 로그인하거나 비밀번호 재설정을 이용해주세요.",
    invalidEmail: "이메일 형식이 올바르지 않습니다.",
    invalidInviteToken:
      "초대 링크가 만료되었거나 유효하지 않습니다. 관리자에게 다시 요청해주세요.",
    networkError: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  },

  reset: {
    emailRequired: "이메일을 입력해 주세요.",
    requestDone: "재설정 메일을 보냈습니다. 메일함에서 링크를 확인해 주세요.",
    requestFailed: "요청 중 오류가 발생했습니다.",
  },

  success: {
    signupInvite:
      "이메일로 인증 링크를 보냈어요.\n메일 인증을 완료하면 초대 화면으로 돌아와 자동 수락을 진행합니다.",
    signupNormal:
      "이메일로 인증 링크를 보냈어요.\n메일을 확인하고 인증을 완료한 뒤 로그인해주세요.",
  },
} as const;
