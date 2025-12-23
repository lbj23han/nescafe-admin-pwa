import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { acceptInvitation } from "@/lib/repositories/invitations/invitations.repo";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

function mapInviteError(message: string) {
  switch (message) {
    case "not_authenticated":
      return {
        status: 401,
        ui: "로그인이 필요합니다. 로그인 후 다시 시도하세요.",
      };
    case "expired":
      return {
        status: 410,
        ui: "이 초대는 만료되었습니다. 새 초대를 받아주세요.",
      };
    case "not_pending":
      return { status: 409, ui: "이미 처리된 초대입니다." };
    case "email_mismatch":
      return {
        status: 403,
        ui: "초대받은 이메일 계정으로 로그인해야 수락할 수 있어요.",
      };
    case "invalid_token":
      return { status: 404, ui: "유효하지 않은 초대 링크입니다." };
    default:
      return { status: 400, ui: "초대 수락에 실패했습니다." };
  }
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ token: string }> }
) {
  const { token: raw } = await ctx.params;
  const token = (raw ?? "").trim();
  if (!token)
    return NextResponse.json({ error: "Missing token" }, { status: 400 });

  try {
    const supabase = await createSupabaseServerClient();
    await acceptInvitation(supabase, { token });

    const url = new URL("/main", req.url);
    return NextResponse.redirect(url);
  } catch (e: unknown) {
    const msg = getErrorMessage(e, "unknown");
    const mapped = mapInviteError(msg);
    return NextResponse.json(
      { error: mapped.ui, code: msg },
      { status: mapped.status }
    );
  }
}
