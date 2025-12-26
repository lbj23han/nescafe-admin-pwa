"use client";

import { useMemo, useState } from "react";
import type { Profile } from "@/lib/repositories/profile/profile.types";
import { logoutAction } from "@/app/(authed)/mypage/actions";
import { MyPageView } from "@/components/ui/mypage/MyPage.view";
import {
  MYPAGE_COPY,
  normalizeRole,
  canInviteByRole,
  getPositionLabel,
  getRoleLabel,
  getShopNameText,
} from "@/constants/mypage";

type Props = {
  initialProfile: Profile | null;
  shopName: string | null;
};

export function MyPageContainer({ initialProfile, shopName }: Props) {
  const roleKey = useMemo(
    () => normalizeRole(initialProfile?.role),
    [initialProfile?.role]
  );

  const canInvite = useMemo(() => canInviteByRole(roleKey), [roleKey]);

  const positionLabel = useMemo(() => getPositionLabel(roleKey), [roleKey]);
  const roleLabel = useMemo(() => getRoleLabel(roleKey), [roleKey]);

  const shopNameText = useMemo(
    () =>
      getShopNameText({
        shopName,
        shopId: initialProfile?.shop_id ?? null,
      }),
    [shopName, initialProfile?.shop_id]
  );

  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <MyPageView
      title={MYPAGE_COPY.title}
      subtitle={MYPAGE_COPY.subtitle}
      shopNameText={shopNameText}
      positionLabel={positionLabel}
      roleLabel={roleLabel}
      canInvite={canInvite}
      inviteOpen={inviteOpen}
      onToggleInviteOpen={() => setInviteOpen((v) => !v)}
      logoutAction={logoutAction}
    />
  );
}
