"use client";

import { LOGIN_PAGE_COPY } from "@/constants/loginpage";
import type {
  LayoutProps,
  MainProps,
  FooterProps,
  AuthFormProps,
} from "./LoginPage.types";

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
  }: AuthFormProps) {
    const isSignup = mode === "signup";

    const passwordMismatch =
      isSignup && confirmPassword.length > 0 && password !== confirmPassword;

    const disabled =
      loading ||
      !email ||
      !password ||
      (isSignup && (!shopName || !confirmPassword || passwordMismatch));

    const helperError = passwordMismatch
      ? LOGIN_PAGE_COPY.helper.passwordMismatch
      : error;

    const inputClass =
      "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200";

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

        {isSignup && (
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
        )}

        <label className="block mt-5 text-xs text-zinc-600">
          {LOGIN_PAGE_COPY.labels.email}
        </label>
        <input
          className={inputClass}
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          placeholder={LOGIN_PAGE_COPY.placeholders.email}
          autoComplete="email"
          inputMode="email"
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

        {isSignup && (
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
        )}

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

        <button
          className="mt-3 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 disabled:opacity-50"
          onClick={onToggleMode}
          disabled={loading}
        >
          {isSignup
            ? LOGIN_PAGE_COPY.buttons.toLogin
            : LOGIN_PAGE_COPY.buttons.toSignup}
        </button>
      </section>
    );
  },
};
