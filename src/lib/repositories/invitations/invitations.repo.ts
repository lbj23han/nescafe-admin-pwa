import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AcceptInvitationParams,
  AcceptInvitationRepoResult,
  CancelInvitationParams,
  CreateInvitationParams,
  ListInvitationsResult,
  RepoCreateInvitationResult,
  RpcInviteAcceptJson,
  RpcInviteCreateRow,
  RpcInviteMetaRow,
} from "./invitations.types";
import type {
  InvitationMeta,
  InvitationRow,
} from "@/lib/contracts/invitations";
import {
  ensureString as _ensureString,
  pickFirstRow as _pickFirstRow,
  assertRole as _assertRole,
  assertStatus as _assertStatus,
} from "./invitations.types";

function normalizeOptionalText(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}

export async function getInvitationMeta(
  supabase: SupabaseClient,
  params: { token: string }
): Promise<InvitationMeta | null> {
  const token = (params.token ?? "").trim();
  if (!token) throw new Error("Missing token");

  const { data, error } = await supabase.rpc("app_invite_get_meta", {
    _token: token,
  });
  if (error) throw error;

  const row = _pickFirstRow<RpcInviteMetaRow>(data);
  if (!row) return null;

  _assertRole(row.role);
  _assertStatus(row.status);
  _ensureString(row.expires_at, "expires_at");

  return {
    email: row.email ?? null,
    role: row.role,
    status: row.status,
    expires_at: row.expires_at,
    shop_name: row.shop_name ?? null,
  };
}

export async function listInvitations(
  supabase: SupabaseClient
): Promise<ListInvitationsResult> {
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as InvitationRow[];
}

export async function createInvitation(
  supabase: SupabaseClient,
  params: CreateInvitationParams
): Promise<RepoCreateInvitationResult> {
  const { role, email, inviteeName } = params;
  if (role !== "viewer") throw new Error("Invalid role");

  const { data, error } = await supabase.rpc("app_invite_create", {
    _role: role,
    _email: (email ?? "").trim(),
    _invitee_name: normalizeOptionalText(inviteeName),
  });
  if (error) throw error;

  const row = _pickFirstRow<RpcInviteCreateRow>(data);
  const invitationId = _ensureString(row?.invitation_id, "invitation_id");
  const token = _ensureString(row?.token, "token");
  const expiresAt = _ensureString(row?.expires_at, "expires_at");

  return { invitationId, token, expiresAt };
}

export async function cancelInvitation(
  supabase: SupabaseClient,
  params: CancelInvitationParams
): Promise<void> {
  const { invitationId } = params;

  const { error } = await supabase.rpc("app_invite_cancel", {
    _invitation_id: invitationId,
  });
  if (error) throw error;
}

export async function acceptInvitation(
  supabase: SupabaseClient,
  params: AcceptInvitationParams
): Promise<AcceptInvitationRepoResult> {
  const token = (params.token ?? "").trim();
  if (!token) throw new Error("invalid_token");

  const { data, error } = await supabase.rpc("app_invite_accept", {
    _token: token,
  });

  if (error) throw error;

  const payload = data as unknown as RpcInviteAcceptJson | null;
  if (!payload?.ok) throw new Error(payload?.code ?? "unknown");

  const shopId = _ensureString(payload.shop_id, "shop_id");
  return { shopId, role: "viewer" };
}
