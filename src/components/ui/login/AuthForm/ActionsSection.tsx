"use client";

import { AUTH_ACTIONS_STYLES } from "./styles/authActions.styles";

type Copy = typeof import("@/constants/loginpage").LOGIN_PAGE_COPY;

export function ActionsSection(props: {
  copy: Copy;
  isSignup: boolean;
  disabled: boolean;
  loading: boolean;
  disableModeToggle: boolean;
  onSubmit: () => void;
  onToggleMode: () => void;

  showResetLink: boolean;
  onRequestPasswordReset?: () => void;

  showEmailHelpLink: boolean;
  onRequestEmailHelp?: () => void;

  resetLoading: boolean;
}) {
  const {
    copy,
    isSignup,
    disabled,
    loading,
    disableModeToggle,
    onSubmit,
    onToggleMode,
    showResetLink,
    onRequestPasswordReset,
    showEmailHelpLink,
    onRequestEmailHelp,
    resetLoading,
  } = props;

  const showLinks = showResetLink || showEmailHelpLink;

  return (
    <>
      <button
        type="button"
        className={AUTH_ACTIONS_STYLES.primaryButton}
        onClick={onSubmit}
        disabled={disabled}
      >
        {loading
          ? copy.buttons.loading
          : isSignup
          ? copy.buttons.signup
          : copy.buttons.login}
      </button>

      {!disableModeToggle ? (
        <button
          type="button"
          className={AUTH_ACTIONS_STYLES.secondaryButton}
          onClick={onToggleMode}
          disabled={loading}
        >
          {isSignup ? copy.buttons.toLogin : copy.buttons.toSignup}
        </button>
      ) : null}

      {showLinks ? (
        <div className={AUTH_ACTIONS_STYLES.linksRow}>
          {showEmailHelpLink ? (
            <button
              type="button"
              className={AUTH_ACTIONS_STYLES.linkButton}
              onClick={onRequestEmailHelp}
              disabled={loading}
            >
              {copy.links.findEmail}
            </button>
          ) : null}

          {showResetLink ? (
            <button
              type="button"
              className={AUTH_ACTIONS_STYLES.linkButton}
              onClick={onRequestPasswordReset}
              disabled={loading || resetLoading}
            >
              {resetLoading
                ? copy.links.passwordResetLoading
                : copy.links.passwordReset}
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
