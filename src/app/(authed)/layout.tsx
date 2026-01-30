import { redirect } from "next/navigation";
import { BottomNav } from "@/components/navigation/BottomNav";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { APP_SHELL } from "@/constants/layout";

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
    <div className="min-h-screen">
      <div className={`${APP_SHELL.container} ${APP_SHELL.width}`}>
        <div className="min-h-screen pb-14">{children}</div>
      </div>

      <div className={`${APP_SHELL.navWrapper} ${APP_SHELL.width}`}>
        <div
          className={`${APP_SHELL.container} border-t border-zinc-300 bg-white`}
        >
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
