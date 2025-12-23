import type { InvitationMeta } from "@/lib/contracts/invitations";

export type InviteLinkInfo = {
  signupHref: string;
  loginHref: string;
};

export type InvitePageViewProps = {
  title: string;
  desc: string;

  token: string;
  meta: InvitationMeta;

  userAuthed: boolean;
  links: InviteLinkInfo;

  processed: boolean;
  expiresLabel: string;
};
