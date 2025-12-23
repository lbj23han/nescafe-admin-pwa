"use client";

import { LOGIN_PAGE_COPY } from "@/constants/loginpage";
import type {
  LayoutProps,
  MainProps,
  FooterProps,
  AuthFormProps as BaseAuthFormProps,
} from "./LoginPage.types";

type AuthFormProps = BaseAuthFormProps & {
  inviteShopName?: string; // ✅ 초대 모드 표시용
};

export const LoginUI = {
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
  }: AuthFormProps) {
    const isSignup = mode === "signup";

    const passwordMismatch =
      isSignup && confirmPassword.length > 0 && password !== confirmPassword;

    // ✅ 초대 signup(hideShopName=true)이면 shopName 검증/필수조건을 완전히 제거
    const disabled =
      loading ||
      !email ||
      !password ||
      (isSignup
        ? !confirmPassword || passwordMismatch || (!hideShopName && !shopName)
        : false);

    const helperError = passwordMismatch
      ? LOGIN_PAGE_COPY.helper.passwordMismatch
      : error;

    const inputClass =
      "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200";

    const lockedClass = emailLocked
      ? "bg-zinc-100 text-zinc-500 cursor-not-allowed"
      : "bg-white";

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

        {/* ✅ 일반 signup에서만 shopName 입력 */}
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

        {/* ✅ 초대 signup일 때는 매장명 표시만 */}
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
      </section>
    );
  },
};
