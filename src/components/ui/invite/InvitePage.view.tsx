import Link from "next/link";
import type { InvitePageViewProps } from "./InvitePage.types";
import { INVITE_PAGE_COPY } from "@/constants/invite";

export function InvitePageView({
  title,
  desc,
  meta,
  userAuthed,
  links,
  processed,
  expiresLabel,
  children,
}: InvitePageViewProps & { children?: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-5">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-zinc-600">{desc}</p>

        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700 space-y-1">
          {meta.shop_name ? (
            <div>
              {INVITE_PAGE_COPY.meta.shop}: {meta.shop_name}
            </div>
          ) : null}

          {meta.email ? (
            <div>
              {INVITE_PAGE_COPY.meta.email}: {meta.email}
            </div>
          ) : null}

          <div>
            {INVITE_PAGE_COPY.meta.expiresAt}: {expiresLabel}
          </div>
        </div>

        {processed ? (
          <p className="mt-4 text-sm text-zinc-600">
            {INVITE_PAGE_COPY.status.alreadyHandled}
          </p>
        ) : !userAuthed ? (
          <div className="mt-4 space-y-2">
            <Link
              href={links.signupHref}
              className="h-10 w-full rounded-md bg-black text-sm font-medium text-white inline-flex items-center justify-center"
            >
              {INVITE_PAGE_COPY.buttons.signup}
            </Link>

            <Link
              href={links.loginHref}
              className="h-10 w-full rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-900 inline-flex items-center justify-center"
            >
              {INVITE_PAGE_COPY.buttons.login}
            </Link>

            <p className="text-xs text-zinc-500 text-center">
              {INVITE_PAGE_COPY.footnote}
            </p>
          </div>
        ) : (
          <div className="mt-4">{children}</div>
        )}
      </div>
    </main>
  );
}

export function InviteErrorView({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-5">
        <h1 className="text-lg font-semibold">초대</h1>
        <p className="mt-2 text-sm text-zinc-600">{message}</p>
      </div>
    </main>
  );
}
