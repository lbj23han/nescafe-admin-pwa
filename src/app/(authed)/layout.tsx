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
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen pb-14">
      {children}
      <BottomNav />
    </div>
  );
}
