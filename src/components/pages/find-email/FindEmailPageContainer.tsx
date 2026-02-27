"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FindEmailPageView } from "@/components/ui/find-email/FindEmailPage.view";
import { FIND_EMAIL_COPY as COPY } from "@/constants/findEmail";
import { supabase } from "@/lib/supabaseClient";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

function getSiteOrigin() {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env && env.trim()) return env.trim();
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function FindEmailPageContainer() {
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

      // 존재 여부를 알려주지 않기 위해: 성공/실패 메시지는 일반화
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      );

      if (error) {
        // 보안 관점에서 상세 에러를 그대로 노출하고 싶지 않으면 COPY.errors.generic로 통일
        setError(COPY.errors.requestFailed);
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
    <FindEmailPageView
      title={COPY.title}
      subtitle={COPY.subtitle}
      hint={COPY.hint}
      email={email}
      onChangeEmail={setEmail}
      loading={loading}
      error={error || undefined}
      doneMessage={doneMessage || undefined}
      canSubmit={canSubmit}
      onSubmit={handleSubmit}
      onBackToLogin={() => router.replace("/")}
      onGoPasswordReset={() => router.push("/reset-password-request")}
    />
  );
}
