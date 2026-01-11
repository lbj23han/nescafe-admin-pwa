"use client";

import { useMemo, useState } from "react";
import { MyPageUI as UI } from "@/components/ui/mypage/MyPageUI";
import { MYPAGE_COPY } from "@/constants/mypage";

type Props = {
  // shop (optional: owner/admin일 때만)
  shopNameText: string;
  shopEdit?: {
    shopName: string;
    onChangeShopName: (v: string) => void;
    onSaveShopName: () => Promise<void>;
    savingShopName: boolean;
    saveShopNameError?: string;
    canSaveShopName: boolean;
  };

  // display name
  displayName: string;
  onChangeDisplayName: (v: string) => void;
  onSaveDisplayName: () => Promise<void>;
  savingName: boolean;
  saveNameError?: string;
  canSaveName: boolean;

  // read-only
  positionLabel: string;
  roleLabel: string;
};

function clampName(v: string) {
  return (v ?? "").slice(0, 40);
}

function clampShopName(v: string) {
  return (v ?? "").slice(0, 50);
}

export function MyPageProfileSection(props: Props) {
  const shopEdit = props.shopEdit;
  const canEditShop = !!shopEdit;

  const [editing, setEditing] = useState(false);
  const [initialShop, setInitialShop] = useState(shopEdit?.shopName ?? "");
  const [initialName, setInitialName] = useState(props.displayName ?? "");

  const shopNameText = useMemo(() => {
    if (!canEditShop) return props.shopNameText;
    const t = (shopEdit?.shopName ?? "").trim();
    return t.length > 0 ? t : MYPAGE_COPY.fallback.shopName;
  }, [canEditShop, shopEdit?.shopName, props.shopNameText]);

  const displayNameText = useMemo(() => {
    const t = (props.displayName ?? "").trim();
    return t.length > 0 ? t : MYPAGE_COPY.labels.displayNameEmpty;
  }, [props.displayName]);

  const shopDirty =
    editing && canEditShop && (shopEdit?.shopName ?? "") !== initialShop;

  const nameDirty = editing && (props.displayName ?? "") !== initialName;

  const anyDirty = shopDirty || nameDirty;

  const anySaving =
    (canEditShop && (shopEdit?.savingShopName ?? false)) || props.savingName;

  const canSave =
    anyDirty &&
    (!nameDirty || props.canSaveName) &&
    (!shopDirty || (shopEdit?.canSaveShopName ?? false)) &&
    !anySaving;

  const startEdit = () => {
    setInitialName(props.displayName ?? "");
    if (shopEdit) setInitialShop(shopEdit.shopName ?? "");
    setEditing(true);
  };

  const closeEdit = () => setEditing(false);

  const saveEdit = async () => {
    if (!anyDirty) return;

    if (nameDirty && props.canSaveName) {
      await props.onSaveDisplayName();
    }

    if (shopDirty && shopEdit && shopEdit.canSaveShopName) {
      await shopEdit.onSaveShopName();
    }

    setEditing(false);
  };

  const handlePrimaryClick = async () => {
    if (!editing) return startEdit();
    if (!anyDirty) return closeEdit();
    await saveEdit();
  };

  const primaryLabel = !editing
    ? MYPAGE_COPY.actions.editDisplayName
    : anyDirty
    ? MYPAGE_COPY.actions.saveDisplayName
    : MYPAGE_COPY.actions.closeEditDisplayName;

  const showSaveSpinner = editing && anyDirty && anySaving;

  const primaryDisabled = editing ? (anyDirty ? !canSave : anySaving) : false;

  return (
    <UI.ProfilePanel
      canEditShop={canEditShop}
      editing={editing}
      shopNameText={shopNameText}
      shopNameValue={shopEdit?.shopName ?? ""}
      onChangeShopName={(v) => {
        if (!shopEdit) return;
        shopEdit.onChangeShopName(clampShopName(v));
      }}
      savingShopName={shopEdit?.savingShopName ?? false}
      saveShopNameError={shopEdit?.saveShopNameError}
      displayNameText={displayNameText}
      displayNameValue={props.displayName}
      onChangeDisplayName={(v) => props.onChangeDisplayName(clampName(v))}
      savingName={props.savingName}
      saveNameError={props.saveNameError}
      positionLabel={props.positionLabel}
      roleLabel={props.roleLabel}
      primaryLabel={primaryLabel}
      primaryDisabled={primaryDisabled}
      onPrimaryClick={handlePrimaryClick}
      showSaveSpinner={showSaveSpinner}
    />
  );
}
