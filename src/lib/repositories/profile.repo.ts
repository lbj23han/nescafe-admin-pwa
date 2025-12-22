import { supabase } from "@/lib/supabaseClient";

export type Profile = {
  user_id: string;
  shop_id: string | null;
  role: "admin" | "viewer";
  display_name: string | null;
};

export async function getMyProfile(): Promise<Profile> {
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
  return data as Profile;
}
