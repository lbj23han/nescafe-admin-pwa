"use client";

import type { InvitationRow } from "@/lib/contracts/invitations";
import { INVITATIONS_COPY as COPY } from "@/constants/mypage/invitations";
import { InvitationsSectionUI as UI } from "./InvitationsSectionUI";

type Mode = "pending" | "accepted";

type Props = {
  mode: Mode;
  items: InvitationRow[];
  formatKST: (iso: string) => string;

  // accepted 전용
  pickAcceptedAt?: (inv: InvitationRow) => string | null;

  // pending 전용
  onCancel?: (id: string) => void;
};

function canCancel(inv: InvitationRow) {
  return inv.status === "pending";
}

export function InvitationsListSection({
  mode,
  items,
  formatKST,
  pickAcceptedAt,
  onCancel,
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

            return (
              <UI.Item key={inv.id}>
                <UI.ItemRow
                  left={
                    <>
                      <div className="flex items-center gap-2">
                        <UI.StatusBadge>{status}</UI.StatusBadge>
                      </div>

                      <UI.FieldLine
                        label={COPY.fields.email}
                        value={inv.email}
                      />

                      {isPending ? (
                        <div className="mt-1 text-xs text-zinc-500">
                          {COPY.fields.created}:{" "}
                          <span className="text-zinc-700">
                            {formatKST(inv.created_at)}
                          </span>{" "}
                          / {COPY.fields.expires}:{" "}
                          <span className="text-zinc-700">
                            {formatKST(inv.expires_at)}
                          </span>
                        </div>
                      ) : (
                        <UI.FieldLine
                          label={COPY.fields.accepted}
                          value={formatKST(String(acceptedAt))}
                        />
                      )}
                    </>
                  }
                  right={
                    isPending && canCancel(inv) && onCancel ? (
                      <UI.SecondaryButton onClick={() => onCancel(inv.id)}>
                        {COPY.actions.cancel}
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
