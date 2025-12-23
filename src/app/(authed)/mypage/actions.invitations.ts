"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type {
  CreateInvitationInput,
  CreateInvitationResult,
  InvitationRow,
} from "@/lib/contracts/invitations";
import {
  createInvitation,
  listInvitations,
  cancelInvitation,
} from "@/lib/repositories/invitations/invitations.repo";
import { getMyProfile } from "@/lib/repositories/profile/profile.repo";

function normalizeEmail(email: string) {
  const e = (email ?? "").trim();
  if (!e) throw new Error("email_required");
  return e;
}

function assertOwner(role: string | null | undefined) {
  // 프로젝트 정책에 맞게: owner만 허용 (admin을 owner급으로 보려면 포함)
  if (role !== "owner" && role !== "admin") {
    throw new Error("forbidden_owner_only");
  }
}

export async function listInvitationsAction(): Promise<InvitationRow[]> {
  const supabase = await createSupabaseServerClient();
  const profile = await getMyProfile(supabase);
  assertOwner(profile?.role);
  return listInvitations(supabase);
}

export async function createInvitationAction(
  input: CreateInvitationInput
): Promise<CreateInvitationResult> {
  const supabase = await createSupabaseServerClient();
  const profile = await getMyProfile(supabase);
  assertOwner(profile?.role);

  const email = normalizeEmail(input.email);

  const { invitationId, token, expiresAt } = await createInvitation(supabase, {
    role: "viewer",
    email,
  });

  revalidatePath("/mypage");

  return {
    invitationId,
    inviteLink: `/invite/${token}`,
    expiresAt,
  };
}

export async function cancelInvitationAction(invitationId: string) {
  const supabase = await createSupabaseServerClient();
  const profile = await getMyProfile(supabase);
  assertOwner(profile?.role);

  if (!invitationId) throw new Error("Missing invitationId");
  await cancelInvitation(supabase, { invitationId });
  revalidatePath("/mypage");
}
