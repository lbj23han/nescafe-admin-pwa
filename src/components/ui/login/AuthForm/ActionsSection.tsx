"use client";

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
        className="mt-6 w-full rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
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
          className="mt-3 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 disabled:opacity-50"
          onClick={onToggleMode}
          disabled={loading}
        >
          {isSignup ? copy.buttons.toLogin : copy.buttons.toSignup}
        </button>
      ) : null}

      {showLinks ? (
        <div className="mt-[1.5vh] flex justify-center gap-2">
          {showEmailHelpLink ? (
            <button
              type="button"
              className="text-[11px] text-zinc-500 underline underline-offset-2 hover:text-zinc-700 disabled:opacity-50"
              onClick={onRequestEmailHelp}
              disabled={loading}
            >
              아이디(이메일) 찾기
            </button>
          ) : null}

          {showResetLink ? (
            <button
              type="button"
              className="text-[11px] text-zinc-500 underline underline-offset-2 hover:text-zinc-700 disabled:opacity-50"
              onClick={onRequestPasswordReset}
              disabled={loading || resetLoading}
            >
              {resetLoading ? "재설정 메일 요청 중…" : "비밀번호 재설정"}
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
