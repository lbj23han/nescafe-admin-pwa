import type { InvitationMeta } from "@/lib/contracts/invitations";

export type AcceptInviteLinkInfo = {
  signupHref: string;
  loginHref: string;
};

export type AcceptInvitePageViewProps = {
  title: string;
  desc: string;

  token: string;
  meta: InvitationMeta;

  userAuthed: boolean;
  links: AcceptInviteLinkInfo;

  processed: boolean;
  expiresLabel: string;
};
