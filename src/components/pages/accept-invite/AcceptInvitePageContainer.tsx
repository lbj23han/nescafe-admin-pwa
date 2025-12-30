import type { InvitationMeta } from "@/lib/contracts/invitations";
import { INVITE_PAGE_COPY } from "@/constants/invite";
import {
  AcceptInviteErrorView,
  AcceptInvitePageView,
} from "@/components/ui/accept-invite";
import AcceptInviteClient from "./AcceptInviteClient";

function enc(v: string) {
  return encodeURIComponent(v);
}

function formatKst(iso: string) {
  try {
    return new Date(iso).toLocaleString("ko-KR");
  } catch {
    return iso;
  }
}

export default function AcceptInvitePageContainer({
  token,
  meta,
  userAuthed,
  errorUi,
}: {
  token: string;
  meta: InvitationMeta | null;
  userAuthed: boolean;
  errorUi: string | null;
}) {
  if (errorUi) {
    return <AcceptInviteErrorView message={errorUi} />;
  }

  if (!meta) {
    return (
      <AcceptInviteErrorView message={INVITE_PAGE_COPY.errors.invalidLink} />
    );
  }

  const next = `/invite/${token}?auto=1`;

  const commonQs = `inviteToken=${enc(token)}&email=${enc(
    meta.email ?? ""
  )}&shopName=${enc(meta.shop_name ?? "")}&next=${enc(next)}`;

  const signupHref = `/?mode=signup&${commonQs}`;
  const loginHref = `/?mode=login&${commonQs}`;

  const processed = meta.status !== "pending";
  const expiresLabel = formatKst(meta.expires_at);

  return (
    <AcceptInvitePageView
      title={INVITE_PAGE_COPY.title}
      desc={INVITE_PAGE_COPY.desc}
      token={token}
      meta={meta}
      userAuthed={userAuthed}
      links={{ signupHref, loginHref }}
      processed={processed}
      expiresLabel={expiresLabel}
    >
      <AcceptInviteClient token={token} />
    </AcceptInvitePageView>
  );
}
