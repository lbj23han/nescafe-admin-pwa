// src/components/pages/mypage/MyPageContainer.tsx
"use client";

import { useState } from "react";
import type { Profile } from "@/lib/repositories/profile/profile.types";
import { MyPageUI as UI } from "@/components/ui/mypage/MyPageUI";
import { logoutAction } from "@/app/(authed)/mypage/actions";
import { MYPAGE_COPY, getRoleLabel } from "@/constants/mypage";
import { InvitationsSection } from "./InvitationsSection";

type Props = {
  initialProfile: Profile | null;
  shopName: string | null;
};

function normalizeRole(role: unknown) {
  return String(role ?? "")
    .trim()
    .toLowerCase();
}

function getPositionLabelFromRole(role: unknown) {
  const r = normalizeRole(role);
  switch (r) {
    case "owner":
      return "대표";
    case "admin":
      return "관리자";
    case "staff":
    case "viewer":
    case "readonly":
      return "직원";
    default:
      return MYPAGE_COPY.fallback.position;
  }
}

export function MyPageContainer({ initialProfile, shopName }: Props) {
  const roleKey = normalizeRole(initialProfile?.role);
  const isOwner = roleKey === "owner" || roleKey === "admin";

  const position = getPositionLabelFromRole(roleKey);
  const roleLabel = getRoleLabel(roleKey);

  const shopNameText =
    shopName?.trim() ||
    (initialProfile?.shop_id
      ? `shop: ${initialProfile.shop_id}`
      : MYPAGE_COPY.fallback.shopName);

  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <UI.Layout>
      <UI.Header title={MYPAGE_COPY.title} />

      <UI.Card>
        <UI.Row label={MYPAGE_COPY.labels.shopName} value={shopNameText} />
        <UI.Row label={MYPAGE_COPY.labels.position} value={position} />
        <UI.Row label={MYPAGE_COPY.labels.role} value={roleLabel} />
      </UI.Card>

      <UI.Spacer />

      {isOwner ? (
        <>
          <UI.DangerButton
            type="button"
            onClick={() => setInviteOpen((v) => !v)}
          >
            {inviteOpen ? "직원 초대 닫기" : "직원 초대"}
          </UI.DangerButton>

          <div className={inviteOpen ? "mt-3" : "mt-3 hidden"}>
            <InvitationsSection />
          </div>

          <UI.Spacer />
        </>
      ) : null}

      <form action={logoutAction}>
        <UI.DangerButton type="submit">
          {MYPAGE_COPY.actions.logout}
        </UI.DangerButton>
      </form>
    </UI.Layout>
  );
}
