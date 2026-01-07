import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { acceptInvitation } from "@/lib/repositories/invitations/invitations.repo";
import { getErrorMessage } from "@/lib/errors/getErrorMessage";

type AcceptOk = { ok: true; redirectTo: string };
type AcceptFail = { ok: false; code: string; error: string; detail?: string };

function mapInviteError(codeOrMessage: string): {
  status: number;
  code: string;
  ui: string;
} {
  // repo / rpc / db 에러 메시지를 "UI용 code"로 정규화
  switch (codeOrMessage) {
    case "not_authenticated":
    case "not_authed":
    case "unauthorized":
      return {
        status: 401,
        code: "unauthorized",
        ui: "로그인이 필요합니다. 로그인 후 다시 시도하세요.",
      };

    case "expired":
      return {
        status: 410,
        code: "expired",
        ui: "이 초대는 만료되었습니다. 새 초대를 받아주세요.",
      };

    case "not_pending":
    case "already_handled":
    case "not_pending_or_missing":
      return {
        status: 409,
        code: "already_handled",
        ui: "이미 처리된 초대입니다.",
      };

    case "email_mismatch":
      return {
        status: 403,
        code: "email_mismatch",
        ui: "초대받은 이메일 계정으로 로그인해야 수락할 수 있어요.",
      };

    case "invalid_token":
      return {
        status: 404,
        code: "invalid_token",
        ui: "유효하지 않은 초대 링크입니다.",
      };

    default:
      return { status: 400, code: "failed", ui: "초대 수락에 실패했습니다." };
  }
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ token: string }> }
) {
  const { token: raw } = await ctx.params;
  const token = (raw ?? "").trim();

  if (!token) {
    const body: AcceptFail = {
      ok: false,
      code: "invalid_token",
      error: "Missing token",
    };
    return NextResponse.json(body, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();

    // 여기서 세션이 없으면 repo 내부/DB에서 unauthorized로 떨어질 수도 있지만
    // UX 명확화를 위해 선검사(원하면 제거해도 됨)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      const body: AcceptFail = {
        ok: false,
        code: "unauthorized",
        error: "로그인이 필요합니다.",
      };
      return NextResponse.json(body, { status: 401 });
    }

    await acceptInvitation(supabase, { token });

    const body: AcceptOk = { ok: true, redirectTo: "/main" };
    return NextResponse.json(body, { status: 200 });
  } catch (e: unknown) {
    const msg = getErrorMessage(e, "failed");
    const mapped = mapInviteError(msg);

    const body: AcceptFail = {
      ok: false,
      code: mapped.code,
      error: mapped.ui,
      detail: msg !== mapped.code ? msg : undefined,
    };

    return NextResponse.json(body, { status: mapped.status });
  }
}
