"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

export type DeleteAccountResult = { ok: true } | { ok: false; message: string };

export async function deleteAccountAction(): Promise<DeleteAccountResult> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return { ok: false, message: getErrorMessage(userError) };
    }
    if (!user) {
      return { ok: false, message: "로그인이 필요합니다." };
    }

    const nowIso = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        shop_id: null,
        role: "viewer",
        display_name: null,
        disabled_at: nowIso,
        updated_at: nowIso,
      })
      .eq("user_id", user.id);

    if (updateError) {
      return { ok: false, message: getErrorMessage(updateError) };
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, message: getErrorMessage(e) };
  }
}
