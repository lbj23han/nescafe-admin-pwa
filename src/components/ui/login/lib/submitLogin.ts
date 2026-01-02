import { LOGIN_PAGE_COPY } from "@/constants/loginpage";
import { supabase } from "@/lib/supabaseClient";
import type { AuthFormMode } from "@/components/ui/login/LoginPage.types";

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

function buildEmailRedirectTo(next: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

function hasSession(result: AuthResult): boolean {
  // supabase 응답 타입이 signIn / signUp 이 달라서 "session 존재 여부"만 안전하게 체크
  const data = result.data as unknown;
  if (!data || typeof data !== "object") return false;

  const record = data as Record<string, unknown>;
  if (!("session" in record)) return false;

  return Boolean((record as { session?: unknown }).session);
}

export async function submitLogin(params: SubmitParams): Promise<SubmitResult> {
  const {
    effectiveMode,
    inviteMode,
    effectiveEmail,
    password,
    confirmPassword,
    shopName,
    inviteToken,
    redirectAfterAuth,
  } = params;

  if (!effectiveEmail) {
    return { kind: "error", message: LOGIN_PAGE_COPY.errors.emailRequired };
  }
  if (!password) {
    return { kind: "error", message: LOGIN_PAGE_COPY.errors.passwordRequired };
  }

  if (effectiveMode === "signup") {
    if (password !== confirmPassword) {
      return {
        kind: "error",
        message: LOGIN_PAGE_COPY.errors.passwordMismatch,
      };
    }
    if (!inviteMode && !shopName.trim()) {
      return {
        kind: "error",
        message: LOGIN_PAGE_COPY.errors.shopNameRequired,
      };
    }
  }

  const emailRedirectTo = buildEmailRedirectTo(redirectAfterAuth);

  let result: AuthResult;

  if (effectiveMode === "login") {
    result = await supabase.auth.signInWithPassword({
      email: effectiveEmail,
      password,
    });
  } else if (inviteMode) {
    result = await supabase.auth.signUp({
      email: effectiveEmail,
      password,
      options: {
        data: {
          invite_token: inviteToken || null,
          signup_kind: "invite",
        },
        emailRedirectTo,
      },
    });
  } else {
    result = await supabase.auth.signUp({
      email: effectiveEmail,
      password,
      options: {
        data: {
          shop_name: shopName,
          role: "admin",
          display_name: "Owner",
        },
        emailRedirectTo,
      },
    });
  }

  if (result.error) {
    return { kind: "error", message: result.error.message };
  }

  const sessionExists = hasSession(result);

  if (effectiveMode === "signup" && !sessionExists) {
    return {
      kind: "successMessage",
      message: inviteMode
        ? LOGIN_PAGE_COPY.success.signupInvite
        : LOGIN_PAGE_COPY.success.signupNormal,
    };
  }

  return { kind: "redirect", to: redirectAfterAuth };
}
