"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LOGIN_PAGE_COPY } from "@/constants/loginpage";
import { LoginPageView } from "@/components/ui/login/LoginPage.view";
import type { AuthFormMode } from "@/components/ui/login/LoginPage.types";
import {
  useDisabledAccountAlertOnce,
  useLoginPageQueryContext,
} from "@/components/ui/login/hooks/useLoginPageQuery";
import { submitLogin } from "@/components/ui/login/lib/submitLogin";
import { supabase } from "@/lib/supabaseClient";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

function getSiteOrigin() {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env && env.trim()) return env.trim();
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function LoginPageContainer() {
  const router = useRouter();
  const sp = useSearchParams();
  const year = new Date().getFullYear();

  const {
    reason,
    inviteToken,
    inviteMode,
    modeFromQuery,
    inviteEmail,
    inviteShopName,
    redirectAfterAuth,
  } = useLoginPageQueryContext(sp);

  useDisabledAccountAlertOnce({ reason, sp, router });

  const [modeState, setModeState] = useState<AuthFormMode>("login");
  const [shopName, setShopName] = useState("");
  const [emailState, setEmailState] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const effectiveMode: AuthFormMode = inviteMode ? modeFromQuery : modeState;
  const effectiveEmail = inviteMode ? inviteEmail : emailState;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setResetMessage("");

    const res = await submitLogin({
      effectiveMode,
      inviteMode,
      effectiveEmail,
      password,
      confirmPassword,
      shopName,
      inviteToken,
      redirectAfterAuth,
    });

    setLoading(false);

    if (res.kind === "error") {
      setError(res.message);
      return;
    }
    if (res.kind === "successMessage") {
      setSuccessMessage(res.message);
      return;
    }

    router.replace(res.to);
  };

  const handleRequestPasswordReset = async () => {
    if (inviteMode) return; // 초대 흐름 혼동 방지
    if (effectiveMode !== "login") return; // 로그인 모드에서만

    const email = (effectiveEmail ?? "").trim();
    if (!email) {
      setResetMessage(LOGIN_PAGE_COPY.reset.emailRequired);
      return;
    }

    setResetLoading(true);
    setResetMessage("");
    setError("");
    setSuccessMessage("");

    try {
      const origin = getSiteOrigin();
      const redirectTo = origin
        ? `${origin}/auth/callback?next=/reset-password`
        : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setResetMessage(error.message);
      } else {
        setResetMessage(LOGIN_PAGE_COPY.reset.requestDone);
      }
    } catch (e) {
      setResetMessage(getErrorMessage(e, LOGIN_PAGE_COPY.reset.requestFailed));
    } finally {
      setResetLoading(false);
    }
  };

  const toggleMode = () => {
    if (inviteMode) return;

    setError("");
    setSuccessMessage("");
    setResetMessage("");
    setPassword("");
    setConfirmPassword("");

    if (modeState === "login") setShopName("");
    setModeState((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <LoginPageView
      year={year}
      appName={LOGIN_PAGE_COPY.appName}
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
      onRequestPasswordReset={handleRequestPasswordReset}
      resetLoading={resetLoading}
      resetMessage={resetMessage}
    />
  );
}
