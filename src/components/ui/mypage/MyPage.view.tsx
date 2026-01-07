"use client";

import { useMemo, useState } from "react";
import { MyPageUI as UI } from "@/components/ui/mypage/MyPageUI";
import { MYPAGE_COPY } from "@/constants/mypage";
import type { MyPageViewProps } from "./MyPage.types";
import { InvitationsSectionContainer } from "./invitations/InvitationsSection.container";

function clampName(v: string) {
  const t = (v ?? "").slice(0, 40);
  return t;
}

export function MyPageView(props: MyPageViewProps) {
  const {
    title,
    subtitle,
    shopNameText,
    positionLabel,
    roleLabel,
    canInvite,
    inviteOpen,
    onToggleInviteOpen,
    onLogout,

    displayName,
    onChangeDisplayName,
    onSaveDisplayName,
    savingName,
    saveNameError,
    canSaveName,

    accountOpen,
    onToggleAccountOpen,

    deleteConfirmText,
    onChangeDeleteConfirmText,
    canSubmitDelete,

    deletingAccount,
    deleteAccountError,
    onDeleteAccount,
  } = props;

  const [editNameOpen, setEditNameOpen] = useState(false);

  const nameValueText = useMemo(() => {
    const t = (displayName ?? "").trim();
    return t.length > 0 ? t : MYPAGE_COPY.labels.displayNameEmpty;
  }, [displayName]);

  const handleSave = async () => {
    if (!canSaveName) return;
    await onSaveDisplayName();
    // 저장 성공 후 닫기
    setEditNameOpen(false);
  };

  return (
    <UI.Layout>
      <UI.Header title={title} subtitle={subtitle} />

      <UI.Card>
        <UI.Row label={MYPAGE_COPY.labels.shopName} value={shopNameText} />
        <UI.Row label={MYPAGE_COPY.labels.position} value={positionLabel} />
        <UI.Row label={MYPAGE_COPY.labels.role} value={roleLabel} />

        <UI.Divider />

        <UI.Row label={MYPAGE_COPY.labels.displayName} value={nameValueText} />

        <UI.GhostButton
          type="button"
          onClick={() => setEditNameOpen((v) => !v)}
        >
          {editNameOpen
            ? MYPAGE_COPY.actions.closeEditName
            : MYPAGE_COPY.actions.openEditName}
        </UI.GhostButton>

        {editNameOpen ? (
          <div className="mt-2">
            <UI.Input
              value={displayName}
              onChange={(v) => onChangeDisplayName(clampName(v))}
              placeholder={MYPAGE_COPY.placeholders.displayName}
              disabled={savingName}
            />

            <UI.PrimaryButton
              type="button"
              onClick={handleSave}
              disabled={!canSaveName}
              className="mt-2"
            >
              {savingName
                ? MYPAGE_COPY.actions.saving
                : MYPAGE_COPY.actions.saveDisplayName}
            </UI.PrimaryButton>

            {saveNameError ? (
              <UI.ErrorText>{saveNameError}</UI.ErrorText>
            ) : null}

            <UI.HintText>{MYPAGE_COPY.hints.displayName}</UI.HintText>
          </div>
        ) : null}
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

      <UI.DangerButton type="button" onClick={onLogout}>
        {MYPAGE_COPY.actions.logout}
      </UI.DangerButton>

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
