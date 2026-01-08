import { LOGIN_PAGE_COPY } from "@/constants/loginpage";
import { supabase } from "@/lib/supabaseClient";
import type { AuthFormMode } from "@/components/ui/login/LoginPage.types";
import { validatePassword } from "@/lib/auth/passwordPolicy";

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
  const data = result.data;

  if (!data || typeof data !== "object") return false;
  if (!("session" in data)) return false;

  return Boolean((data as { session: unknown }).session);
}

function match(msg: string, patterns: string[]) {
  const m = msg.toLowerCase();
  return patterns.some((p) => m.includes(p));
}

function mapAuthError(mode: AuthFormMode, message?: string) {
  const msg = message ?? "";
  const common = [
    {
      when: () =>
        match(msg, ["failed to fetch", "network error", "fetch failed"]),
      to: LOGIN_PAGE_COPY.errors.networkError,
    },
  ];

  const loginOnly = [
    {
      when: () =>
        match(msg, ["invalid login credentials", "invalid email or password"]),
      to: LOGIN_PAGE_COPY.errors.invalidLoginCredentials,
    },
  ];

  const signupOnly = [
    {
      when: () =>
        match(msg, [
          "user already registered",
          "already registered",
          "already exists",
        ]),
      to: LOGIN_PAGE_COPY.errors.userAlreadyRegistered,
    },
    {
      when: () => match(msg, ["invalid email"]),
      to: LOGIN_PAGE_COPY.errors.invalidEmail,
    },
    {
      when: () =>
        match(msg, ["invalid invite token"]) ||
        (match(msg, ["invite"]) && match(msg, ["invalid", "token"])),
      to: LOGIN_PAGE_COPY.errors.invalidInviteToken,
    },
  ];

  const rules = [...common, ...(mode === "login" ? loginOnly : signupOnly)];
  return rules.find((r) => r.when())?.to ?? msg;
}

function validateInput(p: SubmitParams): SubmitResult | null {
  const {
    effectiveMode,
    inviteMode,
    effectiveEmail,
    password,
    confirmPassword,
    shopName,
  } = p;

  if (!effectiveEmail)
    return { kind: "error", message: LOGIN_PAGE_COPY.errors.emailRequired };
  if (!password)
    return { kind: "error", message: LOGIN_PAGE_COPY.errors.passwordRequired };

  if (effectiveMode !== "signup") return null;

  const policy = validatePassword(password);
  if (!policy.valid) {
    return {
      kind: "error",
      message: policy.errors[0] ?? LOGIN_PAGE_COPY.errors.passwordRequired,
    };
  }
  if (password !== confirmPassword) {
    return { kind: "error", message: LOGIN_PAGE_COPY.errors.passwordMismatch };
  }
  if (!inviteMode && !shopName.trim()) {
    return { kind: "error", message: LOGIN_PAGE_COPY.errors.shopNameRequired };
  }
  return null;
}

async function runAuth(p: SubmitParams): Promise<AuthResult> {
  const {
    effectiveMode,
    inviteMode,
    effectiveEmail,
    password,
    shopName,
    inviteToken,
    redirectAfterAuth,
  } = p;

  if (effectiveMode === "login") {
    return supabase.auth.signInWithPassword({
      email: effectiveEmail,
      password,
    });
  }

  const emailRedirectTo = buildEmailRedirectTo(redirectAfterAuth);
  const data = inviteMode
    ? { invite_token: inviteToken || null, signup_kind: "invite" }
    : { shop_name: shopName, role: "admin", display_name: "Owner" };

  return supabase.auth.signUp({
    email: effectiveEmail,
    password,
    options: { data, emailRedirectTo },
  });
}

export async function submitLogin(params: SubmitParams): Promise<SubmitResult> {
  const invalid = validateInput(params);
  if (invalid) return invalid;

  const result = await runAuth(params);

  if (result.error) {
    return {
      kind: "error",
      message: mapAuthError(params.effectiveMode, result.error.message),
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
