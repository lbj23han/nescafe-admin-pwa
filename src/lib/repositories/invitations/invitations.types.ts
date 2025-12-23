import type {
  InvitationMeta,
  InviteRole,
  InvitationRow,
  InvitationStatus,
} from "@/lib/contracts/invitations";

/** 결과 타입 */
export type ListInvitationsResult = InvitationRow[];

export type RepoCreateInvitationResult = {
  invitationId: string;
  token: string;
  expiresAt: string;
};

export type CreateInvitationParams = {
  role: InviteRole; // viewer only
  email?: string;
};

export type AcceptInvitationParams = {
  token: string;
};

export type CancelInvitationParams = {
  invitationId: string;
};

export type AcceptInvitationRepoResult = {
  shopId: string;
  role: InviteRole; // viewer
};

/** RPC 응답 타입 */
export type RpcInviteMetaRow = {
  email: string | null;
  role: InviteRole;
  status: InvitationStatus;
  expires_at: string;
  shop_name: string | null;
};

export type RpcInviteCreateRow = {
  invitation_id: string;
  token: string;
  expires_at: string;
};

export type RpcInviteAcceptJson = {
  ok: boolean;
  shop_id?: string | null;
  code?: string;
  error?: string;
};

/** utils / guards */
export function ensureString(v: unknown, name: string): string {
  if (typeof v !== "string" || v.length === 0)
    throw new Error(`Invalid ${name}`);
  return v;
}

export function pickFirstRow<T>(data: unknown): T | null {
  if (!data) return null;
  if (Array.isArray(data)) return (data[0] ?? null) as T | null;
  return data as T;
}

export function assertRole(v: unknown): asserts v is InviteRole {
  if (v !== "viewer") throw new Error(`Unexpected role: ${String(v)}`);
}

export function assertStatus(v: unknown): asserts v is InvitationStatus {
  if (
    v !== "pending" &&
    v !== "accepted" &&
    v !== "cancelled" &&
    v !== "expired"
  ) {
    throw new Error(`Unexpected status: ${String(v)}`);
  }
}

export type GetInvitationMetaResult = InvitationMeta | null;
