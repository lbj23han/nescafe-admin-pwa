import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getInvitationMeta } from "@/lib/repositories/invitations/invitations.repo";
import InvitePageContainer from "@/components/pages/invite/InvitePageContainer";
import { INVITE_PAGE_COPY } from "@/constants/invite";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token: raw } = await params;
  const token = (raw ?? "").trim();

  if (!token) {
    return (
      <InvitePageContainer
        token=""
        meta={null}
        userAuthed={false}
        errorUi={INVITE_PAGE_COPY.errors.noToken}
      />
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let meta = null;
  let errorUi: string | null = null;

  try {
    meta = await getInvitationMeta(supabase, { token });
    if (!meta) errorUi = INVITE_PAGE_COPY.errors.invalidLink;
  } catch {
    errorUi = INVITE_PAGE_COPY.errors.fetchFailed;
  }

  return (
    <InvitePageContainer
      token={token}
      meta={meta}
      userAuthed={!!user}
      errorUi={errorUi}
    />
  );
}
