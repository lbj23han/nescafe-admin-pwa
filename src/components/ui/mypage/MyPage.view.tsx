"use client";

import { MyPageUI as UI } from "@/components/ui/mypage/MyPageUI";
import { MYPAGE_COPY } from "@/constants/mypage";
import type { MyPageViewProps } from "./MyPage.types";
import { InvitationsSectionContainer } from "./invitations/InvitationsSection.container";
import { MyPageProfileSection } from "./sections/MyPageProfileSection";
import { MyPageAccountSection } from "./sections/MyPageAccountSection";

export function MyPageView(props: MyPageViewProps) {
  return (
    <UI.Layout>
      <UI.Header title={props.title} subtitle={props.subtitle} />

      <UI.Card>
        <UI.Row
          label={MYPAGE_COPY.labels.shopName}
          value={props.shopNameText}
        />
        <UI.Row
          label={MYPAGE_COPY.labels.position}
          value={props.positionLabel}
        />
        <UI.Row label={MYPAGE_COPY.labels.role} value={props.roleLabel} />
      </UI.Card>

      <UI.Spacer />

      <MyPageProfileSection
        displayName={props.displayName}
        onChangeDisplayName={props.onChangeDisplayName}
        onSaveDisplayName={props.onSaveDisplayName}
        savingName={props.savingName}
        saveNameError={props.saveNameError}
        canSaveName={props.canSaveName}
      />

      <UI.Spacer />

      {props.canInvite ? (
        <>
          <UI.DangerButton type="button" onClick={props.onToggleInviteOpen}>
            {props.inviteOpen
              ? MYPAGE_COPY.actions.closeInvite
              : MYPAGE_COPY.actions.openInvite}
          </UI.DangerButton>

          <UI.Collapse open={props.inviteOpen}>
            <InvitationsSectionContainer />
          </UI.Collapse>

          <UI.Spacer />
        </>
      ) : null}

      <UI.DangerButton type="button" onClick={props.onLogout}>
        {MYPAGE_COPY.actions.logout}
      </UI.DangerButton>

      <MyPageAccountSection
        accountOpen={props.accountOpen}
        onToggleAccountOpen={props.onToggleAccountOpen}
        deleteConfirmText={props.deleteConfirmText}
        onChangeDeleteConfirmText={props.onChangeDeleteConfirmText}
        canSubmitDelete={props.canSubmitDelete}
        deletingAccount={props.deletingAccount}
        deleteAccountError={props.deleteAccountError}
        onDeleteAccount={props.onDeleteAccount}
      />
    </UI.Layout>
  );
}
