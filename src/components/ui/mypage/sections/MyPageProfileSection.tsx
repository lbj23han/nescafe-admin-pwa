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
  const {
    shopNameText,
    shopEdit,

    displayName,
    onChangeDisplayName,
    onSaveDisplayName,
    savingName,
    saveNameError,
    canSaveName,

    positionLabel,
    roleLabel,
  } = props;

  const canEditShop = !!shopEdit;

  const [editing, setEditing] = useState(false);

  const [initialShop, setInitialShop] = useState(shopEdit?.shopName ?? "");
  const [initialName, setInitialName] = useState(displayName ?? "");

  const shopValueText = useMemo(() => {
    if (editing && canEditShop) return "";
    if (canEditShop) {
      const t = (shopEdit?.shopName ?? "").trim();
      return t.length > 0 ? t : MYPAGE_COPY.fallback.shopName;
    }
    return shopNameText;
  }, [editing, canEditShop, shopEdit?.shopName, shopNameText]);

  const nameValueText = useMemo(() => {
    const t = (displayName ?? "").trim();
    return t.length > 0 ? t : MYPAGE_COPY.labels.displayNameEmpty;
  }, [displayName]);

  const shopDirty =
    editing && canEditShop && (shopEdit?.shopName ?? "") !== initialShop;

  const nameDirty = editing && (displayName ?? "") !== initialName;

  const anyDirty = shopDirty || nameDirty;

  const anySaving =
    (canEditShop && (shopEdit?.savingShopName ?? false)) || savingName;

  const canSave =
    anyDirty &&
    (!nameDirty || canSaveName) &&
    (!shopDirty || (shopEdit?.canSaveShopName ?? false)) &&
    !anySaving;

  const startEdit = () => {
    setInitialName(displayName ?? "");
    if (canEditShop) setInitialShop(shopEdit?.shopName ?? "");
    setEditing(true);
  };

  const closeEdit = () => setEditing(false);

  const saveEdit = async () => {
    if (!anyDirty) return;

    if (nameDirty && canSaveName) {
      await onSaveDisplayName();
    }

    if (shopDirty && (shopEdit?.canSaveShopName ?? false)) {
      await shopEdit.onSaveShopName();
    }

    setEditing(false);
  };

  const handlePrimaryClick = async () => {
    if (!editing) return startEdit();
    if (!anyDirty) return closeEdit();
    await saveEdit();
  };

  return (
    <UI.Card>
      <UI.SectionTitle>{MYPAGE_COPY.sections.profile}</UI.SectionTitle>

      {/* 가게명 */}
      <UI.InlineRow
        label={MYPAGE_COPY.labels.shopName}
        right={
          editing && canEditShop ? (
            <UI.InputWrap>
              <UI.Input
                value={shopEdit?.shopName ?? ""}
                onChange={(v) => shopEdit?.onChangeShopName(clampShopName(v))}
                placeholder={MYPAGE_COPY.placeholders.shopName}
                disabled={shopEdit?.savingShopName ?? false}
              />
            </UI.InputWrap>
          ) : (
            <UI.ValueText>{shopValueText}</UI.ValueText>
          )
        }
      />
      {shopEdit?.saveShopNameError ? (
        <UI.ErrorText>{shopEdit.saveShopNameError}</UI.ErrorText>
      ) : null}

      {/* 이름 */}
      <UI.InlineRow
        label={MYPAGE_COPY.labels.displayName}
        right={
          editing ? (
            <UI.InputWrap>
              <UI.Input
                value={displayName}
                onChange={(v) => onChangeDisplayName(clampName(v))}
                placeholder={MYPAGE_COPY.placeholders.displayName}
                disabled={savingName}
              />
            </UI.InputWrap>
          ) : (
            <UI.ValueText>{nameValueText}</UI.ValueText>
          )
        }
      />
      {saveNameError ? <UI.ErrorText>{saveNameError}</UI.ErrorText> : null}

      <div className="border-t border-zinc-200 my-3" />

      <UI.Row label={MYPAGE_COPY.labels.position} value={positionLabel} />
      <UI.Row label={MYPAGE_COPY.labels.role} value={roleLabel} />

      <UI.GhostButton
        type="button"
        onClick={handlePrimaryClick}
        disabled={editing ? (anyDirty ? !canSave : anySaving) : false}
      >
        {!editing
          ? MYPAGE_COPY.actions.editDisplayName
          : anyDirty
          ? anySaving
            ? MYPAGE_COPY.actions.saving
            : MYPAGE_COPY.actions.saveDisplayName
          : MYPAGE_COPY.actions.closeEditDisplayName}
      </UI.GhostButton>
    </UI.Card>
  );
}
