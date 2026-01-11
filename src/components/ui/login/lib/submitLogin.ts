import { LOGIN_PAGE_COPY } from "@/constants/loginpage";
import { supabase } from "@/lib/supabaseClient";
import type { AuthFormMode } from "@/components/ui/login/LoginPage.types";
import { validatePassword } from "@/lib/auth/passwordPolicy";
import { mapAuthErrorMessage } from "./authErrorMap";

type SubmitParams = {
  effectiveMode: AuthFormMode;
  inviteMode: boolean;
  effectiveEmail: string;
  password: string;
  confirmPassword: string;
  shopName: string;
  inviteToken: string;
  redirectAfterAuth: string;
};

export type SubmitResult =
  | { kind: "error"; message: string }
  | { kind: "successMessage"; message: string }
  | { kind: "redirect"; to: string };

type AuthResult =
  | Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>
  | Awaited<ReturnType<typeof supabase.auth.signUp>>;

// --- [유틸] 이메일 인증 완료 후 돌아올 redirect URL 생성 ---
const buildEmailRedirectTo = (next: string) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
};

// --- [유틸] session 존재 여부 확인 (signup 후 이메일 인증 필요하면 session 없음) ---
function hasSession(result: AuthResult): boolean {
  const data = result.data;
  return !!(
    data &&
    typeof data === "object" &&
    "session" in data &&
    (data as { session: unknown }).session
  );
}

// --- [검증] submit 전에 프론트에서 즉시 실패 처리(불필요한 서버 호출 방지) ---
function validateInput(p: SubmitParams): SubmitResult | null {
  if (!p.effectiveEmail)
    return { kind: "error", message: LOGIN_PAGE_COPY.errors.emailRequired };
  if (!p.password)
    return { kind: "error", message: LOGIN_PAGE_COPY.errors.passwordRequired };

  if (p.effectiveMode !== "signup") return null;

  // signup 모드: 비밀번호 정책 체크
  const policy = validatePassword(p.password);
  if (!policy.valid) {
    return {
      kind: "error",
      message: policy.errors[0] ?? LOGIN_PAGE_COPY.errors.passwordRequired,
    };
  }

  if (p.password !== p.confirmPassword) {
    return { kind: "error", message: LOGIN_PAGE_COPY.errors.passwordMismatch };
  }

  // 일반 signup(초대 아님): shopName 필수
  if (!p.inviteMode && !p.shopName.trim()) {
    return { kind: "error", message: LOGIN_PAGE_COPY.errors.shopNameRequired };
  }

  return null;
}

// --- [인증 실행] login / invite signup / normal signup 분기해서 Supabase 호출 ---
async function runAuth(p: SubmitParams): Promise<AuthResult> {
  if (p.effectiveMode === "login") {
    return supabase.auth.signInWithPassword({
      email: p.effectiveEmail,
      password: p.password,
    });
  }

  const emailRedirectTo = buildEmailRedirectTo(p.redirectAfterAuth);

  const data = p.inviteMode
    ? { invite_token: p.inviteToken || null, signup_kind: "invite" }
    : { shop_name: p.shopName, role: "admin", display_name: "Owner" };

  return supabase.auth.signUp({
    email: p.effectiveEmail,
    password: p.password,
    options: { data, emailRedirectTo },
  });
}

// --- 로그인/회원가입 submit 엔트리 포인트 ---
export async function submitLogin(params: SubmitParams): Promise<SubmitResult> {
  const invalid = validateInput(params);
  if (invalid) return invalid;

  const result = await runAuth(params);

  if (result.error) {
    return {
      kind: "error",
      message: mapAuthErrorMessage(params.effectiveMode, result.error.message),
    };
  }

  if (params.effectiveMode === "signup" && !hasSession(result)) {
    return {
      kind: "successMessage",
      message: params.inviteMode
        ? LOGIN_PAGE_COPY.success.signupInvite
        : LOGIN_PAGE_COPY.success.signupNormal,
    };
  }

  return { kind: "redirect", to: params.redirectAfterAuth };
}
