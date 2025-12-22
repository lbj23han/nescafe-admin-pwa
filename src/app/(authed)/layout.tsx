import { redirect } from "next/navigation";
import { BottomNav } from "@/components/navigation/BottomNav";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인 안 했으면 authed 그룹 진입 자체를 차단
  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen pb-14">
      {children}
      <BottomNav />
    </div>
  );
}
