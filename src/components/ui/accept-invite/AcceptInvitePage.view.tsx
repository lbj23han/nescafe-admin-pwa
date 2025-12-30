"use client";

import Link from "next/link";
import type { AcceptInvitePageViewProps } from "./AcceptInvitePage.types";
import { INVITE_PAGE_COPY, INVITE_ACCEPT_COPY } from "@/constants/invite";
import { AcceptInviteUI } from "./AcceptInvitePageUI";

export function AcceptInvitePageView({
  title,
  desc,
  meta,
  userAuthed,
  links,
  processed,
  expiresLabel,
  children,
}: AcceptInvitePageViewProps & { children?: React.ReactNode }) {
  return (
    <AcceptInviteUI.Layout>
      <AcceptInviteUI.Card>
        <AcceptInviteUI.Title>{title}</AcceptInviteUI.Title>
        <AcceptInviteUI.Desc>{desc}</AcceptInviteUI.Desc>

        <AcceptInviteUI.MetaBox>
          {meta.shop_name ? (
            <AcceptInviteUI.MetaRow>
              {INVITE_PAGE_COPY.meta.shop}: {meta.shop_name}
            </AcceptInviteUI.MetaRow>
          ) : null}

          {meta.email ? (
            <AcceptInviteUI.MetaRow>
              {INVITE_PAGE_COPY.meta.email}: {meta.email}
            </AcceptInviteUI.MetaRow>
          ) : null}

          <AcceptInviteUI.MetaRow>
            {INVITE_PAGE_COPY.meta.expiresAt}: {expiresLabel}
          </AcceptInviteUI.MetaRow>
        </AcceptInviteUI.MetaBox>

        {processed ? (
          <AcceptInviteUI.Notice>
            {INVITE_PAGE_COPY.status.alreadyHandled}
          </AcceptInviteUI.Notice>
        ) : !userAuthed ? (
          <AcceptInviteUI.Actions>
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

            <AcceptInviteUI.Footnote>
              {INVITE_PAGE_COPY.footnote}
            </AcceptInviteUI.Footnote>
          </AcceptInviteUI.Actions>
        ) : (
          <AcceptInviteUI.Slot>{children}</AcceptInviteUI.Slot>
        )}
      </AcceptInviteUI.Card>
    </AcceptInviteUI.Layout>
  );
}

export function AcceptInviteErrorView({ message }: { message: string }) {
  return (
    <AcceptInviteUI.Layout>
      <AcceptInviteUI.Card>
        <AcceptInviteUI.Title>{INVITE_ACCEPT_COPY.title}</AcceptInviteUI.Title>
        <AcceptInviteUI.Desc>{message}</AcceptInviteUI.Desc>
      </AcceptInviteUI.Card>
    </AcceptInviteUI.Layout>
  );
}
