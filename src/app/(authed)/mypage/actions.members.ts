"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getProfileByAuthUser } from "@/lib/repositories/profile/profile.repo";

/**
 * 이 액션에서 필요한 "내 프로필" 최소 형태
 * - profile repo의 Profile 타입이 프로젝트 상황에 따라 다를 수 있기 때문에
 * - 여기서는 필요한 필드만 안전하게 좁혀서 사용
 */
type AuthedProfile = {
  user_id: string;
  shop_id: string | null;
  role: string | null;
};

export type MemberRow = {
  user_id: string;
  display_name: string | null;
  role: string | null;
};

type ProfileRow = {
  user_id: string;
  display_name: string | null;
  role: string | null;
  shop_id?: string | null;
};

const ADMIN_ROLES = new Set<string>(["owner", "admin"]);

function assertAdmin(role: string | null | undefined) {
  if (!role || !ADMIN_ROLES.has(role)) {
    throw new Error("FORBIDDEN");
  }
}

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

export async function listMembersAction(): Promise<MemberRow[]> {
  const supabase = await createSupabaseServerClient();

  const meRaw = await getProfileByAuthUser(supabase);
  const me = toAuthedProfile(meRaw);
  if (!me?.shop_id) return [];

  assertAdmin(me.role);

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, display_name, role")
    .eq("shop_id", me.shop_id)
    .order("created_at", { ascending: true })
    .returns<Pick<ProfileRow, "user_id" | "display_name" | "role">[]>();

  if (error) throw error;

  return (data ?? []).map((x) => ({
    user_id: x.user_id,
    display_name: x.display_name ?? null,
    role: x.role ?? null,
  }));
}

export async function revokeMemberAction(targetUserId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();

  if (!targetUserId) throw new Error("BAD_REQUEST");

  const { error } = await supabase.rpc("revoke_member", {
    _target_user_id: targetUserId,
  });

  if (error) throw error;
}

export async function getActiveMemberIdsAction(
  userIds: string[]
): Promise<string[]> {
  const supabase = await createSupabaseServerClient();

  const meRaw = await getProfileByAuthUser(supabase);
  const me = toAuthedProfile(meRaw);
  if (!me?.shop_id) return [];

  assertAdmin(me.role);

  if (!Array.isArray(userIds) || userIds.length === 0) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("shop_id", me.shop_id)
    .in("user_id", userIds);

  if (error) throw error;
  return (data ?? []).map((x) => x.user_id);
}
