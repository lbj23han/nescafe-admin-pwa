import { supabase } from "@/lib/supabaseClient";

export type ClientProfile = {
  user_id: string;
  shop_id: string | null;
  role: "admin" | "viewer";
  display_name: string | null;
};

/**
 * Client-side에서 내 프로필을 가져오기
 * - Browser session 기반
 * - supabaseClient singleton 사용
 * - server action / DI 환경에서 사용 금지
 */
export async function getMyProfileFromClient(): Promise<ClientProfile> {
  const { data: sessionRes, error: sessionErr } =
    await supabase.auth.getSession();

  if (sessionErr) throw sessionErr;

  const userId = sessionRes.session?.user.id;
  if (!userId) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, shop_id, role, display_name")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data as ClientProfile;
}
