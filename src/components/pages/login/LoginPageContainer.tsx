"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { LoginPageUI as UI } from "@/components/ui/login/LoginPage.view";
import { LOGIN_PAGE_COPY } from "@/constants/loginpage";
import { supabase } from "@/lib/supabaseClient";

function safeTrim(v: string | null | undefined) {
  return (v ?? "").trim();
}

function safeNext(nextPath: string) {
  if (!nextPath) return "/main";
  if (!nextPath.startsWith("/")) return "/main";
  return nextPath;
}

export function LoginPageContainer() {
  const router = useRouter();
  const sp = useSearchParams();
  const year = new Date().getFullYear();

  // ---- invite context ----
  const inviteToken = safeTrim(sp.get("inviteToken"));
  const inviteMode = !!inviteToken || safeTrim(sp.get("invite")) === "1";

  const modeFromQuery =
    safeTrim(sp.get("mode")) === "signup" ? "signup" : "login";

  const inviteEmail = safeTrim(sp.get("email"));
  const inviteShopName = safeTrim(sp.get("shopName"));
  const nextPath = safeTrim(sp.get("next"));

  const redirectAfterAuth = useMemo(() => safeNext(nextPath), [nextPath]);

  // ---- local state (non-invite) ----
  const [modeState, setModeState] = useState<"login" | "signup">("login");
  const [shopName, setShopName] = useState("");
  const [emailState, setEmailState] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const effectiveMode = inviteMode ? modeFromQuery : modeState;
  const effectiveEmail = inviteMode ? inviteEmail : emailState;

  const buildEmailRedirectTo = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const next = redirectAfterAuth;

    // 이메일 인증 링크는 무조건 callback을 거쳐서 세션 교환을 해야 함
    return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // 기본 검증
    if (!effectiveEmail) {
      setLoading(false);
      setError(LOGIN_PAGE_COPY.errors.emailRequired);
      return;
    }
    if (!password) {
      setLoading(false);
      setError(LOGIN_PAGE_COPY.errors.passwordRequired);
      return;
    }
    if (effectiveMode === "signup") {
      if (password !== confirmPassword) {
        setLoading(false);
        setError(LOGIN_PAGE_COPY.errors.passwordMismatch);
        return;
      }
      // 일반 signup에서는 shopName 필수
      if (!inviteMode && !shopName.trim()) {
        setLoading(false);
        setError(LOGIN_PAGE_COPY.errors.shopNameRequired);
        return;
      }
    }

    const emailRedirectTo = buildEmailRedirectTo();

    let result:
      | Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>
      | Awaited<ReturnType<typeof supabase.auth.signUp>>;

    if (effectiveMode === "login") {
      result = await supabase.auth.signInWithPassword({
        email: effectiveEmail,
        password,
      });
    } else if (inviteMode) {
      // 초대 signup: owner/shop 데이터 넣지 않기
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
      // 일반 signup(오너)
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

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    const hasSession =
      "data" in result &&
      !!(result.data as { session?: unknown } | null)?.session;

    // 이메일 인증이 켜져 있으면 signup 후 세션이 없을 수 있음
    if (effectiveMode === "signup" && !hasSession) {
      setSuccessMessage(
        inviteMode
          ? LOGIN_PAGE_COPY.success.signupInvite
          : LOGIN_PAGE_COPY.success.signupNormal
      );
      return;
    }

    router.replace(redirectAfterAuth);
  };

  const toggleMode = () => {
    if (inviteMode) return;

    setError("");
    setSuccessMessage("");
    setPassword("");
    setConfirmPassword("");

    if (modeState === "login") setShopName("");
    setModeState((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <UI.Layout>
      <UI.Main>
        <Logo />

        <UI.AuthForm
          mode={effectiveMode}
          email={effectiveEmail}
          password={password}
          confirmPassword={confirmPassword}
          shopName={shopName}
          onChangeEmail={(v) => {
            if (inviteMode) return;
            setEmailState(v);
          }}
          onChangePassword={setPassword}
          onChangeConfirmPassword={setConfirmPassword}
          onChangeShopName={setShopName}
          onSubmit={handleSubmit}
          onToggleMode={toggleMode}
          loading={loading}
          error={error}
          successMessage={successMessage}
          emailLocked={inviteMode && !!inviteEmail}
          hideShopName={inviteMode && effectiveMode === "signup"}
          disableModeToggle={inviteMode}
          inviteShopName={inviteMode ? inviteShopName : ""}
        />
      </UI.Main>

      <UI.Footer year={year} appName={LOGIN_PAGE_COPY.appName} />
    </UI.Layout>
  );
}
