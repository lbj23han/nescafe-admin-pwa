"use client";

type Copy = typeof import("@/constants/loginpage").LOGIN_PAGE_COPY;

export function ConfirmPasswordSection(props: {
  copy: Copy;
  isSignup: boolean;
  inputClass: string;
  confirmPassword: string;
  onChangeConfirmPassword: (v: string) => void;
}) {
  const {
    copy,
    isSignup,
    inputClass,
    confirmPassword,
    onChangeConfirmPassword,
  } = props;

  if (!isSignup) return null;

  return (
    <>
      <label className="block mt-4 text-xs text-zinc-600">
        {copy.labels.confirmPassword}
      </label>
      <input
        className={inputClass}
        value={confirmPassword}
        onChange={(e) => onChangeConfirmPassword(e.target.value)}
        placeholder={copy.placeholders.confirmPassword}
        type="password"
        autoComplete="new-password"
      />
    </>
  );
}
