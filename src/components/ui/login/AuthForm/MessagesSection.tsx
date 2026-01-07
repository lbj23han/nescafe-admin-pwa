"use client";

export function MessagesSection(props: {
  resetMessage: string;
  successMessage: string;
  helperError: string;
}) {
  const { resetMessage, successMessage, helperError } = props;

  return (
    <>
      {resetMessage ? (
        <p className="mt-3 text-xs text-zinc-600 whitespace-pre-wrap">
          {resetMessage}
        </p>
      ) : null}

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
    </>
  );
}
