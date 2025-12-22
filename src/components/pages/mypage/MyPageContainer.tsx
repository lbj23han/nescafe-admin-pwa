"use client";

import type { Profile } from "@/lib/repositories/profile/profile.types";
import { MyPageUI as UI } from "@/components/ui/mypage/MyPageUI";
import { logoutAction } from "@/app/(authed)/mypage/actions";
import { MYPAGE_COPY, getRoleLabel } from "@/constants/mypage";

type Props = {
  initialProfile: Profile | null;
  shopName: string | null;
};

export function MyPageContainer({ initialProfile, shopName }: Props) {
  const position =
    initialProfile?.display_name?.trim() || MYPAGE_COPY.fallback.position;
  const roleLabel = getRoleLabel(initialProfile?.role);
  const shopNameText = shopName ?? MYPAGE_COPY.fallback.shopName;

  return (
    <UI.Layout>
      <UI.Header title={MYPAGE_COPY.title} />

      <UI.Card>
        <UI.Row label={MYPAGE_COPY.labels.shopName} value={shopNameText} />
        <UI.Row label={MYPAGE_COPY.labels.position} value={position} />
        <UI.Row label={MYPAGE_COPY.labels.role} value={roleLabel} />
      </UI.Card>

      <UI.Spacer />

      <form action={logoutAction}>
        <UI.DangerButton type="submit">
          {MYPAGE_COPY.actions.logout}
        </UI.DangerButton>
      </form>
    </UI.Layout>
  );
}
