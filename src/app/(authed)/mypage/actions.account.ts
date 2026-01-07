"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";
import { updateMyProfile } from "@/lib/repositories/profile/profile.repo";

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

export type UpdateMyDisplayNameResult =
  | { ok: true; display_name: string | null }
  | { ok: false; message: string };

function normalizeDisplayName(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  if (!t) return null; // 빈 값은 null로 저장
  // 길이 제한은 UI에서도 하고, 서버에서도 최소 방어
  if (t.length > 40) throw new Error("display_name_too_long");
  return t;
}

export async function updateMyDisplayNameAction(
  displayName: string
): Promise<UpdateMyDisplayNameResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const next = normalizeDisplayName(displayName);

    const updated = await updateMyProfile(supabase, { display_name: next });

    // mypage에서 profile 표시를 서버 컴포넌트로 읽는 경우를 대비
    revalidatePath("/mypage");

    return { ok: true, display_name: updated.display_name ?? null };
  } catch (e) {
    return { ok: false, message: getErrorMessage(e) };
  }
}
