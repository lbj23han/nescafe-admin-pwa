"use client";

import { useMemo, useState } from "react";
import { MyPageUI as UI } from "@/components/ui/mypage/MyPageUI";
import { MYPAGE_COPY } from "@/constants/mypage";
import type { MyPageViewProps } from "./MyPage.types";
import { InvitationsSectionContainer } from "./invitations/InvitationsSection.container";

function clampName(v: string) {
  return (v ?? "").slice(0, 40);
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

  // --- display name inline edit state ---
  const [editingName, setEditingName] = useState(false);
  const [initialName, setInitialName] = useState(displayName ?? ""); // 편집 시작 시점 스냅샷

  const nameValueText = useMemo(() => {
    const t = (displayName ?? "").trim();
    return t.length > 0 ? t : MYPAGE_COPY.labels.displayNameEmpty;
  }, [displayName]);

  const dirty = editingName && (displayName ?? "") !== initialName;

  const startEdit = () => {
    setInitialName(displayName ?? "");
    setEditingName(true);
  };

  const closeEdit = () => {
    setEditingName(false);
  };

  const saveEdit = async () => {
    if (!canSaveName) return;
    await onSaveDisplayName();
    setEditingName(false);
  };

  const handlePrimaryClick = async () => {
    if (!editingName) {
      startEdit();
      return;
    }

    // 편집 중: 변경 없으면 '닫기', 변경 있으면 '저장'
    if (!dirty) {
      closeEdit();
      return;
    }

    await saveEdit();
  };

  return (
    <UI.Layout>
      <UI.Header title={title} subtitle={subtitle} />

      <UI.Card>
        <UI.Row label={MYPAGE_COPY.labels.shopName} value={shopNameText} />
        <UI.Row label={MYPAGE_COPY.labels.position} value={positionLabel} />
        <UI.Row label={MYPAGE_COPY.labels.role} value={roleLabel} />

        <UI.Divider />

        <UI.SectionTitle>{MYPAGE_COPY.sections.profile}</UI.SectionTitle>

        <UI.InlineRow
          label={MYPAGE_COPY.labels.displayName}
          right={
            editingName ? (
              <UI.InputWrap>
                <UI.Input
                  value={displayName}
                  onChange={(v) => onChangeDisplayName(clampName(v))}
                  placeholder={MYPAGE_COPY.placeholders.displayName}
                  disabled={savingName}
                />
              </UI.InputWrap>
            ) : (
              <UI.ValueText>{nameValueText}</UI.ValueText>
            )
          }
        />

        <UI.GhostButton
          type="button"
          onClick={handlePrimaryClick}
          disabled={editingName ? (dirty ? !canSaveName : savingName) : false}
        >
          {!editingName
            ? MYPAGE_COPY.actions.editDisplayName
            : dirty
            ? savingName
              ? MYPAGE_COPY.actions.saving
              : MYPAGE_COPY.actions.saveDisplayName
            : MYPAGE_COPY.actions.closeEditDisplayName}
        </UI.GhostButton>

        {saveNameError ? <UI.ErrorText>{saveNameError}</UI.ErrorText> : null}
        <UI.HintText>{MYPAGE_COPY.hints.displayName}</UI.HintText>
      </UI.Card>

      <UI.Spacer />

      {canInvite ? (
        <>
          <UI.DangerButton type="button" onClick={onToggleInviteOpen}>
            {inviteOpen
              ? MYPAGE_COPY.actions.closeInvite
              : MYPAGE_COPY.actions.openInvite}
          </UI.DangerButton>

          <UI.Collapse open={inviteOpen}>
            <InvitationsSectionContainer />
          </UI.Collapse>

          <UI.Spacer />
        </>
      ) : null}

      <UI.DangerButton type="button" onClick={onLogout}>
        {MYPAGE_COPY.actions.logout}
      </UI.DangerButton>

      <UI.CollapseToggleArea className="mt-3">
        <UI.DangerButton type="button" onClick={onToggleAccountOpen}>
          {accountOpen
            ? MYPAGE_COPY.actions.closeAccount
            : MYPAGE_COPY.actions.openAccount}
        </UI.DangerButton>

        <UI.Collapse open={accountOpen}>
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
        </UI.Collapse>
      </UI.CollapseToggleArea>
    </UI.Layout>
  );
}
