export type InviteRole = "viewer";
export type InvitationStatus = "pending" | "accepted" | "cancelled" | "expired";

export type InvitationRow = {
  id: string;
  shop_id: string;
  role: InviteRole; //
  email: string | null;
  status: InvitationStatus;

  invited_by: string;
  accepted_by: string | null;
  accepted_at: string | null;

  expires_at: string;
  cancelled_at: string | null;

  created_at: string;
  updated_at: string;
};

export type CreateInvitationInput = {
  email: string;
};

export type CreateInvitationResult = {
  invitationId: string;
  inviteLink: string;
  expiresAt: string;
};

export type AcceptInvitationResult = {
  shopId: string;
  role: InviteRole; // viewer
};

export type InvitationMeta = {
  email: string | null;
  role: InviteRole;
  status: InvitationStatus;
  expires_at: string;
  shop_name: string | null;
};
