import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getProfileByAuthUser } from "@/lib/repositories/profile/profile.repo";
import type { Profile } from "@/lib/repositories/profile/profile.types";
import { MyPageContainer } from "@/components/pages/mypage/MyPageContainer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MyPage() {
  const supabase = await createSupabaseServerClient();

  const profile = (await getProfileByAuthUser(supabase)) as Profile | null;

  let shopName: string | null = null;

  if (profile?.shop_id) {
    const { data, error } = await supabase
      .from("shops")
      .select("name")
      .eq("id", profile.shop_id)
      .maybeSingle<{ name: string | null }>();

    if (error) throw error;
    shopName = data?.name?.trim() ?? null;
  }

  return <MyPageContainer initialProfile={profile} shopName={shopName} />;
}
