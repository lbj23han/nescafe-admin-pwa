import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getMyProfile } from "@/lib/repositories/profile/profile.repo";
import { MyPageContainer } from "@/components/pages/mypage/MyPageContainer";

export default async function MyPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await getMyProfile(supabase);

  const shopName =
    (user?.user_metadata?.shop_name as string | undefined)?.trim() || null;

  return <MyPageContainer initialProfile={profile} shopName={shopName} />;
}
