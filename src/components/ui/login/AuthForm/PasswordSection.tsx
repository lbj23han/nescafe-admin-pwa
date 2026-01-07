"use client";

type Copy = typeof import("@/constants/loginpage").LOGIN_PAGE_COPY;
type Policy = { valid: boolean; errors: string[] };

export function PasswordSection(props: {
  copy: Copy;
  isSignup: boolean;
  inputClass: string;
  password: string;
  onChangePassword: (v: string) => void;
  showPolicy: boolean;
  pwPolicy: Policy;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const {
    copy,
    isSignup,
    inputClass,
    password,
    onChangePassword,
    showPolicy,
    pwPolicy,
    onFocus,
    onBlur,
  } = props;

  return (
    <>
      <label className="block mt-4 text-xs text-zinc-600">
        {copy.labels.password}
      </label>
      <input
        className={inputClass}
        value={password}
        onChange={(e) => onChangePassword(e.target.value)}
        placeholder={copy.placeholders.password}
        type="password"
        autoComplete={isSignup ? "new-password" : "current-password"}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {showPolicy ? (
        <div className="mt-2 text-[11px] text-zinc-500">
          <div className="font-medium text-zinc-600">
            {copy.helper.passwordPolicyTitle}
          </div>
          <ul className="list-disc pl-4 mt-1 space-y-0.5">
            {copy.helper.passwordPolicyLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          {password.length > 0 && !pwPolicy.valid ? (
            <div className="mt-2 text-red-600">{pwPolicy.errors[0]}</div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
