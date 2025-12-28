"use client";

import { MyPageUI as UI } from "@/components/ui/mypage/MyPageUI";
import { MYPAGE_COPY } from "@/constants/mypage";
import type { MyPageViewProps } from "./MyPage.types";
import { InvitationsSectionContainer } from "./invitations/InvitationsSection.container";

export function MyPageView({
  title,
  subtitle,
  shopNameText,
  positionLabel,
  roleLabel,
  canInvite,
  inviteOpen,
  onToggleInviteOpen,
  logoutAction,
}: MyPageViewProps) {
  return (
    <UI.Layout>
      <UI.Header title={title} subtitle={subtitle} />

      <UI.Card>
        <UI.Row label={MYPAGE_COPY.labels.shopName} value={shopNameText} />
        <UI.Row label={MYPAGE_COPY.labels.position} value={positionLabel} />
        <UI.Row label={MYPAGE_COPY.labels.role} value={roleLabel} />
      </UI.Card>

      <UI.Spacer />

      {canInvite ? (
        <>
          <UI.DangerButton type="button" onClick={onToggleInviteOpen}>
            {inviteOpen
              ? MYPAGE_COPY.actions.closeInvite
              : MYPAGE_COPY.actions.openInvite}
          </UI.DangerButton>

          <div className={inviteOpen ? "mt-3" : "mt-3 hidden"}>
            <InvitationsSectionContainer />
          </div>

          <UI.Spacer />
        </>
      ) : null}

      <form action={logoutAction}>
        <UI.DangerButton type="submit">
          {MYPAGE_COPY.actions.logout}
        </UI.DangerButton>
      </form>
    </UI.Layout>
  );
}
