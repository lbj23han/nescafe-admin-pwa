"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/repositories/profile/profile.types";
import { logoutAction } from "@/app/(authed)/mypage/actions";
import {
  deleteAccountAction,
  updateMyDisplayNameAction,
} from "@/app/(authed)/mypage/actions.account";
import { updateShopNameAction } from "@/app/(authed)/mypage/actions.shop";
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

function clampShopName(v: string) {
  return (v ?? "").slice(0, 50);
}

export function MyPageContainer({ initialProfile, shopName }: Props) {
  const router = useRouter();

  const roleKey = useMemo(
    () => normalizeRole(initialProfile?.role),
    [initialProfile?.role]
  );

  // owner/admin
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

  // ---- shop name edit (owner/admin only) ----
  const [shopNameDraft, setShopNameDraft] = useState(shopName ?? "");
  const [savingShopName, setSavingShopName] = useState(false);
  const [saveShopNameError, setSaveShopNameError] = useState<string>();

  const resetShopNameDraft = () => {
    setShopNameDraft(shopName ?? "");
    setSaveShopNameError(undefined);
  };

  const canSaveShopName =
    canInvite &&
    !savingShopName &&
    clampShopName(shopNameDraft).trim().length > 0;

  const handleSaveShopName = async () => {
    if (!canInvite) return;
    if (!canSaveShopName) return;

    setSavingShopName(true);
    setSaveShopNameError(undefined);

    const res = await updateShopNameAction(shopNameDraft);

    if (!res.ok) {
      setSaveShopNameError(res.message ?? "가게명 저장에 실패했습니다.");
      setSavingShopName(false);
      return;
    }

    router.refresh();
    setSavingShopName(false);
  };

  const shopEdit = canInvite
    ? {
        shopName: shopNameDraft,
        onChangeShopName: (v: string) => setShopNameDraft(clampShopName(v)),
        onSaveShopName: handleSaveShopName,
        savingShopName,
        saveShopNameError,
        canSaveShopName,
        resetShopNameDraft,
      }
    : undefined;

  // ---- display name edit ----
  const [displayName, setDisplayName] = useState(
    initialProfile?.display_name ?? ""
  );
  const [savingName, setSavingName] = useState(false);
  const [saveNameError, setSaveNameError] = useState<string>();

  const canSaveName = !savingName;

  const handleSaveDisplayName = async () => {
    if (!canSaveName) return;

    setSavingName(true);
    setSaveNameError(undefined);

    const res = await updateMyDisplayNameAction(displayName);

    if (!res.ok) {
      setSaveNameError(res.message);
      setSavingName(false);
      return;
    }

    router.refresh();
    setSavingName(false);
  };

  // ---- account delete ----
  const [accountOpen, setAccountOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<string>();

  const canSubmitDelete =
    deleteConfirmText === MYPAGE_COPY.account.confirmKeyword &&
    !deletingAccount;

  const handleToggleAccountOpen = () => {
    setAccountOpen((v) => {
      const next = !v;
      if (!next) {
        setDeleteConfirmText("");
        setDeleteAccountError(undefined);
        setDeletingAccount(false);
      }
      return next;
    });
  };

  const handleLogout = async () => {
    const ok = window.confirm(MYPAGE_COPY.actions.logoutConfirmDialog);
    if (!ok) return;

    try {
      await logoutAction();
    } finally {
      router.replace("/");
    }
  };

  const handleDeleteAccount = async () => {
    if (!canSubmitDelete) return;

    const ok = window.confirm(MYPAGE_COPY.account.confirmDialog);
    if (!ok) return;

    setDeletingAccount(true);
    setDeleteAccountError(undefined);

    const result = await deleteAccountAction();

    if (!result.ok) {
      setDeleteAccountError(result.message);
      setDeletingAccount(false);
      return;
    }

    try {
      await logoutAction();
    } finally {
      router.replace("/");
    }
  };

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
      onLogout={handleLogout}
      accountOpen={accountOpen}
      onToggleAccountOpen={handleToggleAccountOpen}
      deleteConfirmText={deleteConfirmText}
      onChangeDeleteConfirmText={setDeleteConfirmText}
      canSubmitDelete={canSubmitDelete}
      deletingAccount={deletingAccount}
      deleteAccountError={deleteAccountError}
      onDeleteAccount={handleDeleteAccount}
      displayName={displayName}
      onChangeDisplayName={setDisplayName}
      onSaveDisplayName={handleSaveDisplayName}
      savingName={savingName}
      saveNameError={saveNameError}
      canSaveName={canSaveName}
      shopEdit={shopEdit}
    />
  );
}
