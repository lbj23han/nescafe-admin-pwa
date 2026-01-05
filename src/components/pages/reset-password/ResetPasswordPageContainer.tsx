"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResetPasswordPageView } from "@/components/ui/reset-password/ResetPasswordPage.view";
import { RESET_PASSWORD_COPY } from "@/constants/resetPassword";
import { supabase } from "@/lib/supabaseClient";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { validatePassword } from "@/lib/auth/passwordPolicy";

export function ResetPasswordPageContainer() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [doneMessage, setDoneMessage] = useState<string>("");

  const policy = validatePassword(password);

  const canSubmit =
    !loading &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    policy.valid;

  const handleReset = async () => {
    if (!canSubmit) return;

    const recheck = validatePassword(password);
    if (!recheck.valid) {
      setError(recheck.errors[0] ?? RESET_PASSWORD_COPY.errors.resetFailed);
      return;
    }

    const ok = window.confirm(RESET_PASSWORD_COPY.dialogs.confirmReset);
    if (!ok) return;

    setLoading(true);
    setError("");
    setDoneMessage("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        setError(RESET_PASSWORD_COPY.messages.invalidSession);
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      await supabase.auth.signOut();

      setDoneMessage(RESET_PASSWORD_COPY.messages.done);

      router.replace("/");
    } catch (e) {
      setError(getErrorMessage(e, RESET_PASSWORD_COPY.errors.resetFailed));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResetPasswordPageView
      title={RESET_PASSWORD_COPY.title}
      subtitle={RESET_PASSWORD_COPY.subtitle}
      password={password}
      confirmPassword={confirmPassword}
      onChangePassword={setPassword}
      onChangeConfirmPassword={setConfirmPassword}
      loading={loading}
      error={error}
      doneMessage={doneMessage}
      passwordPolicyValid={policy.valid}
      passwordPolicyErrors={policy.errors}
      canSubmit={canSubmit}
      onSubmit={handleReset}
      onBackToLogin={() => router.replace("/")}
    />
  );
}
