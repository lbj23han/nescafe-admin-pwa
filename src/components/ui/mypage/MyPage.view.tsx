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

  accountOpen,
  onToggleAccountOpen,

  deleteConfirmText,
  onChangeDeleteConfirmText,
  canSubmitDelete,

  deletingAccount,
  deleteAccountError,
  onDeleteAccount,
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

      <div className="mt-3">
        <UI.DangerButton type="button" onClick={onToggleAccountOpen}>
          {accountOpen
            ? MYPAGE_COPY.actions.closeAccount
            : MYPAGE_COPY.actions.openAccount}
        </UI.DangerButton>

        <div className={accountOpen ? "mt-3" : "mt-3 hidden"}>
          <UI.AccountPanel
            title={MYPAGE_COPY.account.title}
            bullets={MYPAGE_COPY.account.bullets}
            warningTitle={MYPAGE_COPY.account.warningTitle}
            confirmHintPrefix={MYPAGE_COPY.account.confirmHintPrefix}
            confirmKeyword={MYPAGE_COPY.account.confirmKeyword}
            confirmHintSuffix={MYPAGE_COPY.account.confirmHintSuffix}
            deleteConfirmText={deleteConfirmText}
            onChangeDeleteConfirmText={onChangeDeleteConfirmText}
            deletingAccount={deletingAccount}
            canSubmitDelete={canSubmitDelete}
            deleteAccountLabel={MYPAGE_COPY.actions.deleteAccount}
            deletingAccountLabel={MYPAGE_COPY.actions.deletingAccount}
            deleteAccountError={deleteAccountError}
            onDeleteAccount={onDeleteAccount}
          />
        </div>
      </div>
    </UI.Layout>
  );
}
