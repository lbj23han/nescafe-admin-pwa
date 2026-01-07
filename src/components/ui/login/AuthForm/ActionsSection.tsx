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
    resetLoading,
  } = props;

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
    </>
  );
}
