"use client";

import type { InvitationRow } from "@/lib/contracts/invitations";
import { INVITATIONS_COPY as COPY } from "@/constants/mypage/invitations";
import { InvitationsSectionUI as UI } from "./InvitationsSectionUI";

type Mode = "pending" | "accepted";

type Props = {
  mode: Mode;
  items: InvitationRow[];
  formatKST: (iso: string) => string;

  // accepted
  pickAcceptedAt?: (inv: InvitationRow) => string | null;
  onRevoke?: (targetUserId: string) => void;
  revokingUserId?: string | null;

  // accepted 이름 소스
  memberNameById?: Map<string, string>;

  // pending
  onCancel?: (id: string) => void;
};

function canCancel(inv: InvitationRow) {
  return inv.status === "pending";
}

function getAcceptedUserId(inv: InvitationRow): string | null {
  return inv.accepted_by ?? null;
}

function normalizeName(v: string | null | undefined): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

export function InvitationsListSection({
  mode,
  items,
  formatKST,
  pickAcceptedAt,
  onCancel,
  onRevoke,
  revokingUserId,
  memberNameById,
}: Props) {
  const isPending = mode === "pending";
  const title = isPending ? COPY.sections.pending : COPY.sections.accepted;
  const right = isPending ? `${items.length}건` : `${items.length}명`;
  const empty = isPending ? COPY.empty.pending : COPY.empty.accepted;
  const emptyTone = isPending ? ("subtle" as const) : ("normal" as const);
  const status = isPending ? COPY.status.pending : COPY.status.accepted;

  return (
    <div className={isPending ? "" : "mt-6"}>
      <UI.SectionHeader title={title} right={right} />

      {items.length === 0 ? (
        <UI.EmptyBox tone={emptyTone}>{empty}</UI.EmptyBox>
      ) : (
        <UI.List>
          {items.map((inv) => {
            const acceptedAt = !isPending
              ? pickAcceptedAt?.(inv) ?? inv.updated_at ?? inv.created_at
              : null;

            const targetUserId = !isPending ? getAcceptedUserId(inv) : null;

            const canRevoke =
              !isPending && inv.status === "accepted" && !!targetUserId;

            const isRevoking =
              !isPending && !!targetUserId && revokingUserId === targetUserId;

            const revokeDisabled = !canRevoke || isRevoking;

            const inviteeName = normalizeName(inv.invitee_name ?? null);

            const profileName =
              !isPending && targetUserId && memberNameById
                ? normalizeName(memberNameById.get(targetUserId) ?? null)
                : null;

            // accepted는 profiles.display_name 우선
            const displayName = isPending
              ? inviteeName
              : profileName ?? inviteeName;

            const handleRevoke = () => {
              if (revokeDisabled) return;
              if (!onRevoke || !targetUserId) return;

              const ok = window.confirm(COPY.confirm.revoke);
              if (!ok) return;

              onRevoke(targetUserId);
            };

            return (
              <UI.Item key={inv.id}>
                <UI.ItemRow
                  left={
                    <>
                      <div className="flex items-center gap-2">
                        <UI.StatusBadge>{status}</UI.StatusBadge>
                      </div>

                      {displayName ? (
                        <UI.FieldLine
                          label={COPY.fields.name}
                          value={displayName}
                        />
                      ) : null}

                      <UI.FieldLine
                        label={COPY.fields.email}
                        value={inv.email}
                      />

                      {isPending ? (
                        <UI.SubInfoLine>
                          {COPY.fields.created}:{" "}
                          <UI.SubInfoStrong>
                            {formatKST(inv.created_at)}
                          </UI.SubInfoStrong>{" "}
                          / {COPY.fields.expires}:{" "}
                          <UI.SubInfoStrong>
                            {formatKST(inv.expires_at)}
                          </UI.SubInfoStrong>
                        </UI.SubInfoLine>
                      ) : (
                        <UI.FieldLine
                          label={COPY.fields.accepted}
                          value={formatKST(String(acceptedAt))}
                        />
                      )}

                      {!isPending &&
                      inv.status === "accepted" &&
                      !targetUserId ? (
                        <UI.WarningText>
                          {COPY.warnings.missingAcceptedBy}
                        </UI.WarningText>
                      ) : null}
                    </>
                  }
                  right={
                    isPending && canCancel(inv) && onCancel ? (
                      <UI.SecondaryButton onClick={() => onCancel(inv.id)}>
                        {COPY.actions.cancel}
                      </UI.SecondaryButton>
                    ) : !isPending && onRevoke ? (
                      <UI.SecondaryButton
                        onClick={handleRevoke}
                        disabled={revokeDisabled}
                      >
                        {isRevoking
                          ? COPY.actions.revoking
                          : COPY.actions.revoke}
                      </UI.SecondaryButton>
                    ) : null
                  }
                />
              </UI.Item>
            );
          })}
        </UI.List>
      )}
    </div>
  );
}
