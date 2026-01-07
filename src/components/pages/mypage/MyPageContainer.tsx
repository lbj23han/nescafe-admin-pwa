"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/repositories/profile/profile.types";
import { logoutAction } from "@/app/(authed)/mypage/actions";
import {
  deleteAccountAction,
  updateMyDisplayNameAction,
} from "@/app/(authed)/mypage/actions.account";
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
  const router = useRouter();

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

    // 서버 컴포넌트에서 profile을 다시 읽는 경우까지 동기화
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
    />
  );
}
