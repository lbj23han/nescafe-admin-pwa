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

  const effectiveMode: AuthFormMode = inviteMode ? modeFromQuery : modeState;
  const effectiveEmail = inviteMode ? inviteEmail : emailState;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

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

  const handleGoPasswordResetRequest = () => {
    if (inviteMode) return;
    if (effectiveMode !== "login") return;
    router.push("/reset-password-request");
  };

  const handleGoFindEmail = () => {
    if (inviteMode) return;
    if (effectiveMode !== "login") return;
    router.push("/find-email");
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
      onRequestPasswordReset={
        inviteMode ? undefined : handleGoPasswordResetRequest
      }
      onRequestEmailHelp={inviteMode ? undefined : handleGoFindEmail}
      resetLoading={false}
      resetMessage={""}
    />
  );
}
