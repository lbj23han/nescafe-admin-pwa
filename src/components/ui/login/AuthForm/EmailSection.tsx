"use client";

type Copy = typeof import("@/constants/loginpage").LOGIN_PAGE_COPY;

export function EmailSection(props: {
  copy: Copy;
  inputClass: string;
  lockedClass: string;
  email: string;
  emailLocked: boolean;
  onChangeEmail: (v: string) => void;
}) {
  const { copy, inputClass, lockedClass, email, emailLocked, onChangeEmail } =
    props;

  return (
    <>
      <label className="block mt-5 text-xs text-zinc-600">
        {copy.labels.email}
      </label>
      <input
        className={`${inputClass} ${lockedClass}`}
        value={email}
        onChange={(e) => onChangeEmail(e.target.value)}
        placeholder={copy.placeholders.email}
        autoComplete="email"
        inputMode="email"
        readOnly={emailLocked}
        disabled={emailLocked}
      />
    </>
  );
}
