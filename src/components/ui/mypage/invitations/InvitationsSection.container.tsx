"use client";

import { useMemo, useState } from "react";
import { useInvitations } from "./useInvitations";
import type { InvitationRow } from "@/lib/contracts/invitations";
import { InvitationsSectionView } from "./InvitationsSection.view";
import { INVITATIONS_COPY as COPY } from "@/constants/mypage/invitations";

function formatKST(iso: string) {
  try {
    return new Date(iso).toLocaleString("ko-KR");
  } catch {
    return iso;
  }
}

function pickAcceptedAt(inv: InvitationRow) {
  return inv.accepted_at ?? null;
}

export function InvitationsSectionContainer() {
  const {
    items,
    loading,
    creating,
    error,
    lastCreated,
    create,
    cancel,

    revoke,
    revokingUserId,
    activeMemberUserIds,
  } = useInvitations();

  const [email, setEmail] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const pending = useMemo(
    () => items.filter((x) => x.status === "pending"),
    [items]
  );

  const accepted = useMemo(() => {
    const base = items
      .filter((x) => x.status === "accepted")
      .filter(
        (x) => typeof x.accepted_by === "string" && x.accepted_by.length > 0
      )
      // 현재 멤버만
      .filter((x) => activeMemberUserIds.has(x.accepted_by as string));

    // 같은 사람(accepted_by) 중 최신 1개만 남김
    const map = new Map<string, InvitationRow>();
    for (const inv of base) {
      const uid = inv.accepted_by as string;
      const prev = map.get(uid);
      if (!prev) {
        map.set(uid, inv);
        continue;
      }

      // 최신 판단 키: accepted_at > updated_at > created_at 순
      const prevKey =
        (prev.accepted_at ?? prev.updated_at ?? prev.created_at) || "";
      const nextKey =
        (inv.accepted_at ?? inv.updated_at ?? inv.created_at) || "";

      if (String(nextKey) > String(prevKey)) {
        map.set(uid, inv);
      }
    }

    return Array.from(map.values());
  }, [items, activeMemberUserIds]);

  const showCreateForm = createOpen && !lastCreated;

  const handleToggleCreate = () => {
    setCreateOpen((v) => !v);
  };

  const handleCreate = async () => {
    if (!email.trim()) {
      alert(COPY.alerts.emailRequired);
      return;
    }
    await create({ email: email.trim() });
    setEmail("");
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(COPY.lastCreated.copied);
    } catch {
      alert(COPY.lastCreated.copyFailed);
    }
  };

  return (
    <InvitationsSectionView
      pending={pending}
      accepted={accepted}
      loading={loading}
      creating={creating}
      error={error}
      lastCreated={lastCreated}
      email={email}
      onChangeEmail={setEmail}
      onCreate={handleCreate}
      onCancel={cancel}
      onCopy={handleCopy}
      formatKST={formatKST}
      pickAcceptedAt={pickAcceptedAt}
      createOpen={createOpen}
      showCreateForm={showCreateForm}
      onToggleCreate={handleToggleCreate}
      onRevoke={revoke}
      revokingUserId={revokingUserId}
    />
  );
}
