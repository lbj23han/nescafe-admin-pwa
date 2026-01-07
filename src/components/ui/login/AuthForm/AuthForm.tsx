"use client";

import { useMemo, useState } from "react";
import { validatePassword } from "@/lib/auth/passwordPolicy";
import type { AuthFormProps } from "../LoginPage.types";

import { HeaderSection } from "./HeaderSection";
import { ShopSection } from "./ShopSection";
import { EmailSection } from "./EmailSection";
import { PasswordSection } from "./PasswordSection";
import { ConfirmPasswordSection } from "./ConfirmPasswordSection";
import { MessagesSection } from "./MessagesSection";
import { ActionsSection } from "./ActionsSection";

type Copy = typeof import("@/constants/loginpage").LOGIN_PAGE_COPY;
type Policy = { valid: boolean; errors: string[] };

type Props = AuthFormProps & { copy: Copy };

export function AuthForm({
  copy,
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
}: Props) {
  const isSignup = mode === "signup";
  const [pwFocused, setPwFocused] = useState(false);

  const passwordMismatch =
    isSignup && confirmPassword.length > 0 && password !== confirmPassword;

  const pwPolicy: Policy = useMemo(() => {
    if (!isSignup) return { valid: true, errors: [] };
    return validatePassword(password);
  }, [isSignup, password]);

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

  const helperError = passwordMismatch
    ? copy.helper.passwordMismatch
    : isSignup && !pwPolicy.valid && password.length > 0
    ? pwPolicy.errors[0] ?? ""
    : error;

  const showResetLink =
    !isSignup &&
    !disableModeToggle &&
    typeof onRequestPasswordReset === "function";

  const inputClass =
    "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200";

  const lockedClass = emailLocked
    ? "bg-zinc-100 text-zinc-500 cursor-not-allowed"
    : "bg-white";

  return (
    <section className="mt-6">
      <HeaderSection copy={copy} isSignup={isSignup} />

      <ShopSection
        copy={copy}
        isSignup={isSignup}
        hideShopName={hideShopName}
        inviteShopName={inviteShopName}
        inputClass={inputClass}
        shopName={shopName}
        onChangeShopName={onChangeShopName}
      />

      <EmailSection
        copy={copy}
        inputClass={inputClass}
        lockedClass={lockedClass}
        email={email}
        emailLocked={emailLocked}
        onChangeEmail={onChangeEmail}
      />

      <PasswordSection
        copy={copy}
        isSignup={isSignup}
        inputClass={inputClass}
        password={password}
        onChangePassword={onChangePassword}
        showPolicy={isSignup && pwFocused}
        pwPolicy={pwPolicy}
        onFocus={() => setPwFocused(true)}
        onBlur={() => setPwFocused(false)}
      />

      <ConfirmPasswordSection
        copy={copy}
        isSignup={isSignup}
        inputClass={inputClass}
        confirmPassword={confirmPassword}
        onChangeConfirmPassword={onChangeConfirmPassword}
      />

      <MessagesSection
        resetMessage={resetMessage}
        successMessage={successMessage}
        helperError={helperError}
      />

      <ActionsSection
        copy={copy}
        isSignup={isSignup}
        loading={loading}
        disabled={disabled}
        disableModeToggle={disableModeToggle}
        onSubmit={onSubmit}
        onToggleMode={onToggleMode}
        showResetLink={showResetLink}
        onRequestPasswordReset={onRequestPasswordReset}
        resetLoading={resetLoading}
      />
    </section>
  );
}
