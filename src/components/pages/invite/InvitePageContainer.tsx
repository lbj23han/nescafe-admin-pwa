import type { InvitationMeta } from "@/lib/contracts/invitations";
import { INVITE_PAGE_COPY } from "@/constants/invite";
import {
  InviteErrorView,
  InvitePageView,
} from "@/components/ui/invite/InvitePage.view";
import InviteAcceptClient from "@/components/pages/invite/InviteAcceptClient";

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

export default function InvitePageContainer({
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
    return <InviteErrorView message={errorUi} />;
  }

  if (!meta) {
    return <InviteErrorView message={INVITE_PAGE_COPY.errors.invalidLink} />;
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
    <InvitePageView
      title={INVITE_PAGE_COPY.title}
      desc={INVITE_PAGE_COPY.desc}
      token={token}
      meta={meta}
      userAuthed={userAuthed}
      links={{ signupHref, loginHref }}
      processed={processed}
      expiresLabel={expiresLabel}
    >
      <InviteAcceptClient token={token} />
    </InvitePageView>
  );
}
