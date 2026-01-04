"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResetPasswordRequestPageView } from "@/components/ui/reset-password-request/ResetPasswordRequestPage.view";
import { RESET_PASSWORD_REQUEST_COPY as COPY } from "@/constants/resetPasswordRequest";
import { supabase } from "@/lib/supabaseClient";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

function getSiteOrigin() {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env && env.trim()) return env.trim();
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function ResetPasswordRequestPageContainer() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doneMessage, setDoneMessage] = useState("");

  const canSubmit = !loading && email.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setError("");
    setDoneMessage("");

    try {
      const origin = getSiteOrigin();
      const redirectTo = origin
        ? `${origin}/auth/callback?next=/reset-password`
        : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      );

      if (error) {
        setError(error.message);
      } else {
        setDoneMessage(COPY.messages.done);
      }
    } catch (e) {
      setError(getErrorMessage(e, COPY.errors.requestFailed));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResetPasswordRequestPageView
      title={COPY.title}
      subtitle={COPY.subtitle}
      email={email}
      onChangeEmail={setEmail}
      loading={loading}
      error={error || undefined}
      doneMessage={doneMessage || undefined}
      canSubmit={canSubmit}
      onSubmit={handleSubmit}
      onBackToLogin={() => router.replace("/")}
    />
  );
}
