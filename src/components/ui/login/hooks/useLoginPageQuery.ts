"use client";

import { useEffect, useMemo, useRef } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ReadonlyURLSearchParams } from "next/navigation";
import type { AuthFormMode } from "@/components/ui/login/LoginPage.types";

function safeTrim(v: string | null | undefined) {
  return (v ?? "").trim();
}

function safeNext(nextPath: string) {
  if (!nextPath) return "/main";
  if (!nextPath.startsWith("/")) return "/main";
  return nextPath;
}

export type LoginPageQueryContext = {
  reason: string;

  inviteToken: string;
  inviteMode: boolean;

  modeFromQuery: AuthFormMode;

  inviteEmail: string;
  inviteShopName: string;

  redirectAfterAuth: string;
};

export function useLoginPageQueryContext(
  sp: ReadonlyURLSearchParams
): LoginPageQueryContext {
  const reason = safeTrim(sp.get("reason"));

  // ---- invite context ----
  const inviteToken = safeTrim(sp.get("inviteToken"));
  const inviteMode = !!inviteToken || safeTrim(sp.get("invite")) === "1";

  const modeFromQuery: AuthFormMode =
    safeTrim(sp.get("mode")) === "signup" ? "signup" : "login";

  const inviteEmail = safeTrim(sp.get("email"));
  const inviteShopName = safeTrim(sp.get("shopName"));

  const nextPath = safeTrim(sp.get("next"));
  const redirectAfterAuth = useMemo(() => safeNext(nextPath), [nextPath]);

  return {
    reason,
    inviteToken,
    inviteMode,
    modeFromQuery,
    inviteEmail,
    inviteShopName,
    redirectAfterAuth,
  };
}

export function useDisabledAccountAlertOnce(params: {
  reason: string;
  sp: ReadonlyURLSearchParams;
  router: AppRouterInstance;
}) {
  const { reason, sp, router } = params;
  const alertedDisabledRef = useRef(false);

  // 탈퇴 계정 alert 1회 + URL 정리
  useEffect(() => {
    if (reason !== "disabled") return;
    if (alertedDisabledRef.current) return;

    alertedDisabledRef.current = true;

    window.alert("탈퇴한 계정입니다.\n서비스 이용이 제한됩니다.");

    // reason 제거 (재알림 방지)
    const qs = new URLSearchParams(sp.toString());
    qs.delete("reason");

    const next = qs.toString();
    router.replace(next ? `/?${next}` : "/");
  }, [reason, router, sp]);
}
