import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile, UpdateMyProfileInput } from "./profile.types";

/**
 * Canonical profile repository
 * - SupabaseClient 주입
 * - server / client 공용
 * - auth user 기준으로 profile 조회
 */
export async function getProfileByAuthUser(
  supabase: SupabaseClient
): Promise<Profile | null> {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) throw userErr;
  if (!user) return null;

  // 1차: user_id 컬럼 기준
  const byUserId = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle<Profile>();

  if (byUserId.error) throw byUserId.error;
  if (byUserId.data) return byUserId.data;

  // 2차: id = auth.uid() 구조 대응
  const byId = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (byId.error) throw byId.error;
  return byId.data ?? null;
}

export async function updateMyProfile(
  supabase: SupabaseClient,
  input: UpdateMyProfileInput
): Promise<Profile> {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) throw userErr;
  if (!user) throw new Error("Not authenticated");

  const patch: Record<string, unknown> = {};
  if ("display_name" in input) patch.display_name = input.display_name ?? null;

  // update: user_id 우선, 실패 시 id
  const updatedByUserId = await supabase
    .from("profiles")
    .update(patch)
    .eq("user_id", user.id)
    .select("*")
    .maybeSingle<Profile>();

  if (updatedByUserId.error) throw updatedByUserId.error;
  if (updatedByUserId.data) return updatedByUserId.data;

  const updatedById = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id)
    .select("*")
    .single<Profile>();

  if (updatedById.error) throw updatedById.error;
  return updatedById.data;
}
