"use client";

import { useMemo, useState } from "react";
import { MyPageUI as UI } from "@/components/ui/mypage/MyPageUI";
import { MYPAGE_COPY } from "@/constants/mypage";

type Props = {
  displayName: string;
  onChangeDisplayName: (v: string) => void;
  onSaveDisplayName: () => Promise<void>;
  savingName: boolean;
  saveNameError?: string;
  canSaveName: boolean;
};

function clampName(v: string) {
  return (v ?? "").slice(0, 40);
}

export function MyPageProfileSection(props: Props) {
  const {
    displayName,
    onChangeDisplayName,
    onSaveDisplayName,
    savingName,
    saveNameError,
    canSaveName,
  } = props;

  const [editingName, setEditingName] = useState(false);
  const [initialName, setInitialName] = useState(displayName ?? "");

  const nameValueText = useMemo(() => {
    const t = (displayName ?? "").trim();
    return t.length > 0 ? t : MYPAGE_COPY.labels.displayNameEmpty;
  }, [displayName]);

  const dirty = editingName && (displayName ?? "") !== initialName;

  const startEdit = () => {
    setInitialName(displayName ?? "");
    setEditingName(true);
  };

  const closeEdit = () => setEditingName(false);

  const saveEdit = async () => {
    if (!canSaveName) return;
    await onSaveDisplayName();
    setEditingName(false);
  };

  const handlePrimaryClick = async () => {
    if (!editingName) return startEdit();
    if (!dirty) return closeEdit();
    await saveEdit();
  };

  return (
    <UI.Card>
      <UI.SectionTitle>{MYPAGE_COPY.sections.profile}</UI.SectionTitle>

      <UI.InlineRow
        label={MYPAGE_COPY.labels.displayName}
        right={
          editingName ? (
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

      <UI.GhostButton
        type="button"
        onClick={handlePrimaryClick}
        disabled={editingName ? (dirty ? !canSaveName : savingName) : false}
      >
        {!editingName
          ? MYPAGE_COPY.actions.editDisplayName
          : dirty
          ? savingName
            ? MYPAGE_COPY.actions.saving
            : MYPAGE_COPY.actions.saveDisplayName
          : MYPAGE_COPY.actions.closeEditDisplayName}
      </UI.GhostButton>

      {saveNameError ? <UI.ErrorText>{saveNameError}</UI.ErrorText> : null}
      <UI.HintText>{MYPAGE_COPY.hints.displayName}</UI.HintText>
    </UI.Card>
  );
}
