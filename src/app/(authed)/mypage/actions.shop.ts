"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getProfileByAuthUser } from "@/lib/repositories/profile/profile.repo";

type AuthedProfile = {
  user_id: string;
  shop_id: string | null;
  role: string | null;
};

const ADMIN_ROLES = new Set<string>(["owner", "admin"]);

function toAuthedProfile(profile: unknown): AuthedProfile | null {
  if (!profile || typeof profile !== "object") return null;
  const p = profile as Record<string, unknown>;

  const user_id = typeof p.user_id === "string" ? p.user_id : null;
  const shop_id =
    p.shop_id === null || typeof p.shop_id === "string"
      ? (p.shop_id as string | null)
      : null;
  const role =
    p.role === null || typeof p.role === "string"
      ? (p.role as string | null)
      : null;

  if (!user_id) return null;
  return { user_id, shop_id, role };
}

function normalizeShopName(v: string) {
  return (v ?? "").trim().slice(0, 50);
}

export async function updateShopNameAction(name: string): Promise<{
  ok: boolean;
  message?: string;
}> {
  const nextName = normalizeShopName(name);
  if (!nextName) return { ok: false, message: "가게명을 입력해주세요." };

  const supabase = await createSupabaseServerClient();

  const meRaw = await getProfileByAuthUser(supabase);
  const me = toAuthedProfile(meRaw);

  if (!me?.shop_id) return { ok: false, message: "가게 정보가 없습니다." };
  if (!me.role || !ADMIN_ROLES.has(me.role))
    return { ok: false, message: "가게명 수정 권한이 없습니다." };

  // update 결과를 select로 받아서 확인
  const { data, error } = await supabase
    .from("shops")
    .update({ name: nextName })
    .eq("id", me.shop_id)
    .select("id, name")
    .maybeSingle();

  if (error) {
    // RLS 걸리면 여기로 (또는 data가 null)
    return { ok: false, message: error.message };
  }

  if (!data) {
    // where 매칭 0건 or RLS로 결과가 숨겨지는 케이스
    return {
      ok: false,
      message:
        "가게명 저장에 실패했습니다. (업데이트 대상이 없거나 권한 정책(RLS)으로 차단됨)",
    };
  }

  return { ok: true };
}
