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
import { AUTH_FORM_STYLES } from "./styles/authForm.styles";

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
  onRequestEmailHelp,
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

  const showEmailHelpLink =
    !isSignup && !disableModeToggle && typeof onRequestEmailHelp === "function";

  const lockedClass = emailLocked
    ? AUTH_FORM_STYLES.emailLocked
    : AUTH_FORM_STYLES.emailUnlocked;

  return (
    <section className={AUTH_FORM_STYLES.section}>
      <HeaderSection copy={copy} isSignup={isSignup} />

      <ShopSection
        copy={copy}
        isSignup={isSignup}
        hideShopName={hideShopName}
        inviteShopName={inviteShopName}
        inputClass={AUTH_FORM_STYLES.input}
        shopName={shopName}
        onChangeShopName={onChangeShopName}
      />

      <EmailSection
        copy={copy}
        inputClass={AUTH_FORM_STYLES.input}
        lockedClass={lockedClass}
        email={email}
        emailLocked={emailLocked}
        onChangeEmail={onChangeEmail}
      />

      <PasswordSection
        copy={copy}
        isSignup={isSignup}
        inputClass={AUTH_FORM_STYLES.input}
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
        inputClass={AUTH_FORM_STYLES.input}
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
        disabled={disabled}
        loading={loading}
        disableModeToggle={disableModeToggle}
        onSubmit={onSubmit}
        onToggleMode={onToggleMode}
        showResetLink={showResetLink}
        onRequestPasswordReset={onRequestPasswordReset}
        showEmailHelpLink={showEmailHelpLink}
        onRequestEmailHelp={onRequestEmailHelp}
        resetLoading={resetLoading}
      />
    </section>
  );
}
