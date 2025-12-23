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

function normalizeEmail(email: string) {
  const e = (email ?? "").trim();
  if (!e) throw new Error("email_required");
  return e;
}

export async function listInvitationsAction(): Promise<InvitationRow[]> {
  const supabase = await createSupabaseServerClient();
  return listInvitations(supabase);
}

export async function createInvitationAction(
  input: CreateInvitationInput
): Promise<CreateInvitationResult> {
  const supabase = await createSupabaseServerClient();

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
  if (!invitationId) throw new Error("Missing invitationId");
  await cancelInvitation(supabase, { invitationId });
  revalidatePath("/mypage");
}
