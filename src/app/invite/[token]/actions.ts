"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { acceptInvitation } from "@/lib/repositories/invitations/invitations.repo";

function getToken(formData: FormData): string {
  const raw = formData.get("token");
  if (typeof raw !== "string") return "";
  return raw.trim();
}

export async function acceptInvitationFormAction(formData: FormData) {
  const token = getToken(formData);
  if (!token) throw new Error("Missing token");

  const supabase = await createSupabaseServerClient();
  await acceptInvitation(supabase, { token });

  revalidatePath("/main");
  revalidatePath("/mypage");

  redirect("/main");
}
