"use client";

type Copy = typeof import("@/constants/loginpage").LOGIN_PAGE_COPY;

export function HeaderSection({
  copy,
  isSignup,
}: {
  copy: Copy;
  isSignup: boolean;
}) {
  return (
    <>
      <h1 className="text-lg font-semibold tracking-tight text-black">
        {isSignup ? copy.title.signup : copy.title.login}
      </h1>
      <p className="text-xs text-zinc-500 mt-1">
        {isSignup ? copy.desc.signup : copy.desc.login}
      </p>
    </>
  );
}
