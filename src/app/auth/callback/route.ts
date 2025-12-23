import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(
  _req: Request,
  { params }: { params: { token: string } }
) {
  const token = (params.token ?? "").trim();
  if (!token) {
    return NextResponse.json(
      { error: "토큰이 없습니다.", code: "missing_token" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다.", code: "unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase.rpc("app_invite_accept", {
    p_token: token,
  });

  if (error) {
    // supabase 에러 메시지를 그대로 노출하지 말고, 최소한으로 래핑
    return NextResponse.json(
      {
        error: "초대 수락에 실패했습니다.",
        code: "rpc_error",
        detail: error.message,
      },
      { status: 403 }
    );
  }

  if (!data?.ok) {
    return NextResponse.json(
      {
        error: data?.error ?? "초대 수락에 실패했습니다.",
        code: data?.code ?? "failed",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
