import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile, UpdateMyProfileInput } from "./profile.types";

export async function getMyProfile(supabase: SupabaseClient) {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) throw userErr;
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle<Profile>();

  if (error) throw error;
  return data;
}

export async function updateMyProfile(
  supabase: SupabaseClient,
  input: UpdateMyProfileInput
) {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) throw userErr;
  if (!user) throw new Error("Not authenticated");

  const patch: Record<string, unknown> = {};
  if ("display_name" in input) patch.display_name = input.display_name ?? null;

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("user_id", user.id)
    .select("*")
    .single<Profile>();

  if (error) throw error;
  return data;
}
