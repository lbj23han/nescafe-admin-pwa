"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResetPasswordPageView } from "@/components/ui/reset-password/ResetPasswordPage.view";
import { RESET_PASSWORD_COPY } from "@/constants/resetPassword";
import { supabase } from "@/lib/supabaseClient";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

export function ResetPasswordPageContainer() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [doneMessage, setDoneMessage] = useState<string>("");

  const canSubmit =
    !loading &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleReset = async () => {
    if (!canSubmit) return;

    const ok = window.confirm(RESET_PASSWORD_COPY.dialogs.confirmReset);
    if (!ok) return;

    setLoading(true);
    setError("");
    setDoneMessage("");

    try {
      // auth/callback에서 이미 세션을 쿠키에 저장했어야 함
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

      // 보안상 비번 변경 후 로그아웃 처리 권장
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
      canSubmit={canSubmit}
      onSubmit={handleReset}
      onBackToLogin={() => router.replace("/")}
    />
  );
}
