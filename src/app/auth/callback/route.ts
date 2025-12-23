import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

function safeNext(nextPath: string | null) {
  if (!nextPath) return "/main";
  if (!nextPath.startsWith("/")) return "/main";
  return nextPath;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  // code 없으면 그냥 next로
  if (!code) {
    return NextResponse.redirect(new URL(next, url.origin));
  }

  const supabase = await createSupabaseServerClient();

  // auth code → session 교환
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  // 실패해도 next로 보내되, 필요하면 쿼리로 표시
  if (error) {
    const redirectUrl = new URL(next, url.origin);
    redirectUrl.searchParams.set("authError", "1");
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
