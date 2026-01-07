"use client";

import type { InvitationsSectionViewProps } from "./InvitationsSection.types";
import { INVITATIONS_COPY as COPY } from "@/constants/mypage/invitations";
import { InvitationsSectionUI as UI } from "./InvitationsSectionUI";
import { InvitationsListSection } from "./InvitationsListSection";

export function InvitationsSectionView(props: InvitationsSectionViewProps) {
  const {
    pending,
    accepted,
    loading,
    creating,
    error,
    lastCreated,
    email,
    onChangeEmail,
    onCreate,
    onCancel,
    onCopy,
    formatKST,
    pickAcceptedAt,
    createOpen,
    onToggleCreate,
    showCreateForm,
    onRevoke,
    revokingUserId,
    memberNameById,
  } = props;

  const isCreateOpen = createOpen ?? showCreateForm ?? false;

  return (
    <UI.Root>
      <UI.Header title={COPY.title} right={COPY.pendingBadge(pending.length)} />

      <UI.ToggleButton onClick={onToggleCreate} disabled={loading}>
        {isCreateOpen ? COPY.form.closeButton : COPY.form.openButton}
      </UI.ToggleButton>

      {isCreateOpen && (
        <UI.FormCard>
          <UI.Label>{COPY.form.labelEmail}</UI.Label>

          <UI.Input
            value={email}
            onChange={onChangeEmail}
            placeholder={COPY.form.placeholderEmail}
          />

          <UI.PrimaryButton onClick={onCreate} disabled={creating}>
            {creating ? COPY.form.creatingButton : COPY.form.createButton}
          </UI.PrimaryButton>

          {lastCreated && (
            <UI.LastCreatedCard>
              <UI.LastCreatedRow
                left={
                  <>
                    <UI.SubtleText>{COPY.lastCreated.label}</UI.SubtleText>
                    <UI.MonoTruncate>{lastCreated.inviteLink}</UI.MonoTruncate>
                    <UI.SubtleText>
                      {COPY.lastCreated.expires}:{" "}
                      {formatKST(lastCreated.expiresAt)}
                    </UI.SubtleText>
                  </>
                }
                right={
                  <UI.CopyButton
                    onClick={() =>
                      onCopy(location.origin + lastCreated.inviteLink)
                    }
                  >
                    {COPY.lastCreated.copyButton}
                  </UI.CopyButton>
                }
              />
            </UI.LastCreatedCard>
          )}
        </UI.FormCard>
      )}

      <UI.Body>
        <UI.SummaryLine>
          {loading
            ? COPY.loading
            : COPY.summary(pending.length, accepted.length)}
        </UI.SummaryLine>

        {error && <UI.ErrorBox>{error}</UI.ErrorBox>}

        <InvitationsListSection
          mode="pending"
          items={pending}
          formatKST={formatKST}
          onCancel={onCancel}
        />

        <InvitationsListSection
          mode="accepted"
          items={accepted}
          formatKST={formatKST}
          pickAcceptedAt={pickAcceptedAt}
          onRevoke={onRevoke}
          revokingUserId={revokingUserId}
          memberNameById={memberNameById}
        />
      </UI.Body>
    </UI.Root>
  );
}
