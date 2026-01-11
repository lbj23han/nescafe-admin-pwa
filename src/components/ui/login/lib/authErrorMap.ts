import { LOGIN_PAGE_COPY } from "@/constants/loginpage";
import type { AuthFormMode } from "@/components/ui/login/LoginPage.types";

// --- [유틸] 문자열 포함 여부로 에러 메시지 패턴 매칭 ---
function match(msg: string, patterns: string[]) {
  const m = msg.toLowerCase();
  return patterns.some((p) => m.includes(p));
}

// --- [공통 규칙] login/signup에 적용되는 에러 매핑 ---
const COMMON_RULES: Array<{ when: (m: string) => boolean; to: string }> = [
  {
    // 네트워크 이슈(서버 장애/통신 실패 등)
    when: (m) => match(m, ["failed to fetch", "network error", "fetch failed"]),
    to: LOGIN_PAGE_COPY.errors.networkError,
  },
];

// --- [로그인 규칙] 로그인 시에 적용되는 에러 매핑 ---
const LOGIN_RULES: Array<{ when: (m: string) => boolean; to: string }> = [
  {
    // 비밀번호 불일치 / 잘못된 로그인 정보
    when: (m) =>
      match(m, ["invalid login credentials", "invalid email or password"]),
    to: LOGIN_PAGE_COPY.errors.invalidLoginCredentials,
  },
];

// --- [회원가입/초대가입 규칙] signup 시에적용되는 에러 매핑 ---
const SIGNUP_RULES: Array<{ when: (m: string) => boolean; to: string }> = [
  {
    // 이미 가입된 이메일
    when: (m) =>
      match(m, [
        "user already registered",
        "already registered",
        "already exists",
      ]),
    to: LOGIN_PAGE_COPY.errors.userAlreadyRegistered,
  },
  {
    // 이메일 형식 오류
    when: (m) => match(m, ["invalid email"]),
    to: LOGIN_PAGE_COPY.errors.invalidEmail,
  },
  {
    // 초대 토큰 오류(만료/무효)
    when: (m) =>
      match(m, ["invalid invite token"]) ||
      (match(m, ["invite"]) && match(m, ["invalid", "token"])),
    to: LOGIN_PAGE_COPY.errors.invalidInviteToken,
  },
];

// --- Supabase 에러 메시지를 UX 메시지로 변환 ---
export function mapAuthErrorMessage(mode: AuthFormMode, message?: string) {
  const msg = message ?? "";

  // mode에 따라 규칙 세트 선택 (common + loginOnly / common + signupOnly)
  const rules =
    mode === "login"
      ? [...COMMON_RULES, ...LOGIN_RULES]
      : [...COMMON_RULES, ...SIGNUP_RULES];

  return rules.find((r) => r.when(msg))?.to ?? msg;
}
