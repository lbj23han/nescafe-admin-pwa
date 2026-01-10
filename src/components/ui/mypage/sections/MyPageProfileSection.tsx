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

  // 단일 편집 모드
  const [editing, setEditing] = useState(false);

  // initial snapshots (dirty 감지용)
  const [initialShop, setInitialShop] = useState(shopEdit?.shopName ?? "");
  const [initialName, setInitialName] = useState(displayName ?? "");

  const shopValueText = useMemo(() => {
    if (editing && canEditShop) return ""; // input 렌더링하므로 텍스트는 사용 안 함
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

  // 저장 가능 조건: 변경된 항목이 있고, 그 항목이 저장 가능해야 함
  // - 이름이 dirty면 canSaveName 필요
  // - 가게명이 dirty면 shopEdit.canSaveShopName 필요
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
    // 변경된 것만 저장
    // (둘 다 dirty면 둘 다 저장)
    if (!anyDirty) return;

    // 이름 저장
    if (nameDirty && canSaveName) {
      await onSaveDisplayName();
    }

    // 가게명 저장(owner/admin만 shopEdit 존재)
    if (shopDirty && (shopEdit?.canSaveShopName ?? false)) {
      await shopEdit!.onSaveShopName();
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

      {/* 버튼 하나 */}
      <UI.GhostButton
        type="button"
        onClick={handlePrimaryClick}
        disabled={editing ? (anyDirty ? !canSave : anySaving) : false}
      >
        {!editing
          ? MYPAGE_COPY.actions.openEditName // 기존 "내 정보 관리" / 또는 "편집"
          : anyDirty
          ? anySaving
            ? MYPAGE_COPY.actions.saving
            : MYPAGE_COPY.actions.saveDisplayName // 문구 재사용(원하면 saveAll로 새로 추가)
          : MYPAGE_COPY.actions.closeEditName}
      </UI.GhostButton>

      <UI.HintText>{MYPAGE_COPY.hints.displayName}</UI.HintText>
      {canEditShop ? (
        <UI.HintText>{MYPAGE_COPY.hints.shopName}</UI.HintText>
      ) : null}

      <div className="border-t border-zinc-200 my-3" />

      <UI.Row label={MYPAGE_COPY.labels.position} value={positionLabel} />
      <UI.Row label={MYPAGE_COPY.labels.role} value={roleLabel} />
    </UI.Card>
  );
}
