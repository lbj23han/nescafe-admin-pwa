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
  const anyInv = inv as unknown as { accepted_at?: string | null };
  return anyInv.accepted_at ?? null;
}

export function InvitationsSectionContainer() {
  const { items, loading, creating, error, lastCreated, create, cancel } =
    useInvitations();

  const [email, setEmail] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const pending = useMemo(
    () => items.filter((x) => x.status === "pending"),
    [items]
  );

  const accepted = useMemo(
    () => items.filter((x) => x.status === "accepted"),
    [items]
  );

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
    />
  );
}
