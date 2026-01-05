"use client";

import { LOGIN_PAGE_COPY } from "@/constants/loginpage";
import type {
  LayoutProps,
  MainProps,
  FooterProps,
  AuthFormProps,
} from "./LoginPage.types";
import { validatePassword } from "@/lib/auth/passwordPolicy";

export const LoginPageUI = {
  Layout({ children }: LayoutProps) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-6">
        {children}
      </div>
    );
  },

  Main({ children }: MainProps) {
    return <main className="w-full max-w-xs mb-8">{children}</main>;
  },

  Footer({ year, appName }: FooterProps) {
    return (
      <footer className="text-[11px] text-zinc-400">
        © {year} {appName}. All rights reserved.
      </footer>
    );
  },

  AuthForm({
    mode,
    email,
    password,
    confirmPassword,
    shopName,
    onChangeEmail,
    onChangePassword,
    onChangeConfirmPassword,
    onChangeShopName,
    onSubmit,
    onToggleMode,
    loading = false,
    error = "",
    successMessage = "",
    emailLocked = false,
    hideShopName = false,
    disableModeToggle = false,
    inviteShopName = "",

    onRequestPasswordReset,
    resetLoading = false,
    resetMessage = "",
  }: AuthFormProps) {
    const isSignup = mode === "signup";

    const passwordMismatch =
      isSignup && confirmPassword.length > 0 && password !== confirmPassword;

    // signup 비번 정책
    const pwPolicy = isSignup
      ? validatePassword(password)
      : { valid: true, errors: [] };
    const showPwPolicy = isSignup && password.length > 0;

    // disabled 조건에 정책 반영
    const disabled =
      loading ||
      !email ||
      !password ||
      (isSignup
        ? !confirmPassword ||
          passwordMismatch ||
          !pwPolicy.valid ||
          (!hideShopName && !shopName)
        : false);

    // helperError 우선순위: mismatch > policy > error
    const helperError = passwordMismatch
      ? LOGIN_PAGE_COPY.helper.passwordMismatch
      : isSignup && !pwPolicy.valid && password.length > 0
      ? pwPolicy.errors[0] ?? ""
      : error;

    const inputClass =
      "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200";

    const lockedClass = emailLocked
      ? "bg-zinc-100 text-zinc-500 cursor-not-allowed"
      : "bg-white";

    const showResetLink =
      !isSignup &&
      !disableModeToggle &&
      typeof onRequestPasswordReset === "function";

    return (
      <section className="mt-6">
        <h1 className="text-lg font-semibold tracking-tight text-black">
          {isSignup
            ? LOGIN_PAGE_COPY.title.signup
            : LOGIN_PAGE_COPY.title.login}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          {isSignup ? LOGIN_PAGE_COPY.desc.signup : LOGIN_PAGE_COPY.desc.login}
        </p>

        {isSignup && !hideShopName ? (
          <>
            <label className="block mt-5 text-xs text-zinc-600">
              {LOGIN_PAGE_COPY.labels.shopName}
            </label>
            <input
              className={inputClass}
              value={shopName}
              onChange={(e) => onChangeShopName(e.target.value)}
              placeholder={LOGIN_PAGE_COPY.placeholders.shopName}
              autoComplete="organization"
            />
            <p className="mt-2 text-[11px] text-zinc-500">
              {LOGIN_PAGE_COPY.helper.shopName}
            </p>
          </>
        ) : null}

        {isSignup && hideShopName && inviteShopName ? (
          <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <div className="text-[11px] text-zinc-500">초대된 매장</div>
            <div className="mt-1 text-sm font-medium text-zinc-900">
              {inviteShopName}
            </div>
          </div>
        ) : null}

        <label className="block mt-5 text-xs text-zinc-600">
          {LOGIN_PAGE_COPY.labels.email}
        </label>
        <input
          className={`${inputClass} ${lockedClass}`}
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          placeholder={LOGIN_PAGE_COPY.placeholders.email}
          autoComplete="email"
          inputMode="email"
          readOnly={emailLocked}
          disabled={emailLocked}
        />

        <label className="block mt-4 text-xs text-zinc-600">
          {LOGIN_PAGE_COPY.labels.password}
        </label>
        <input
          className={inputClass}
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
          placeholder={LOGIN_PAGE_COPY.placeholders.password}
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
        />

        {/* 비번 정책 안내 (signup일 때만) */}
        {isSignup ? (
          <div className="mt-2 text-[11px] text-zinc-500">
            <div className="font-medium text-zinc-600">
              {LOGIN_PAGE_COPY.helper.passwordPolicyTitle}
            </div>
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              {LOGIN_PAGE_COPY.helper.passwordPolicyLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            {showPwPolicy && !pwPolicy.valid ? (
              <div className="mt-2 text-red-600">{pwPolicy.errors[0]}</div>
            ) : null}
          </div>
        ) : null}

        {isSignup ? (
          <>
            <label className="block mt-4 text-xs text-zinc-600">
              {LOGIN_PAGE_COPY.labels.confirmPassword}
            </label>
            <input
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => onChangeConfirmPassword(e.target.value)}
              placeholder={LOGIN_PAGE_COPY.placeholders.confirmPassword}
              type="password"
              autoComplete="new-password"
            />
          </>
        ) : null}

        {resetMessage ? (
          <p className="mt-3 text-xs text-zinc-600 whitespace-pre-wrap">
            {resetMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="mt-3 text-xs text-emerald-600 whitespace-pre-wrap">
            {successMessage}
          </p>
        ) : null}

        {helperError ? (
          <p className="mt-3 text-xs text-red-600 whitespace-pre-wrap">
            {helperError}
          </p>
        ) : null}

        <button
          type="button"
          className="mt-6 w-full rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          onClick={onSubmit}
          disabled={disabled}
        >
          {loading
            ? LOGIN_PAGE_COPY.buttons.loading
            : isSignup
            ? LOGIN_PAGE_COPY.buttons.signup
            : LOGIN_PAGE_COPY.buttons.login}
        </button>

        {!disableModeToggle ? (
          <button
            type="button"
            className="mt-3 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 disabled:opacity-50"
            onClick={onToggleMode}
            disabled={loading}
          >
            {isSignup
              ? LOGIN_PAGE_COPY.buttons.toLogin
              : LOGIN_PAGE_COPY.buttons.toSignup}
          </button>
        ) : null}

        {showResetLink ? (
          <div className="mt-[1.5vh] flex justify-center">
            <button
              type="button"
              className="text-[11px] text-zinc-500 underline underline-offset-2 hover:text-zinc-700 disabled:opacity-50"
              onClick={onRequestPasswordReset}
              disabled={loading || resetLoading}
            >
              {resetLoading ? "재설정 메일 요청 중…" : "비밀번호 재설정"}
            </button>
          </div>
        ) : null}
      </section>
    );
  },
};
