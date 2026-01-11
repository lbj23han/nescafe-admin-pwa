"use client";

import { MyPageUI as UI } from "@/components/ui/mypage/MyPageUI";
import { MYPAGE_COPY } from "@/constants/mypage";
import { Spinner } from "@/components/Spinner";

export type MyPageProfilePanelProps = {
  // shop
  canEditShop: boolean;
  editing: boolean;
  shopNameText: string;
  shopNameValue: string;
  onChangeShopName: (v: string) => void;
  savingShopName: boolean;
  saveShopNameError?: string;

  // display name
  displayNameText: string;
  displayNameValue: string;
  onChangeDisplayName: (v: string) => void;
  savingName: boolean;
  saveNameError?: string;

  // read-only
  positionLabel: string;
  roleLabel: string;

  // primary action
  primaryLabel: string;
  primaryDisabled: boolean;
  onPrimaryClick: () => void;
  showSaveSpinner: boolean;
};

export function ProfilePanel(props: MyPageProfilePanelProps) {
  return (
    <UI.Card>
      <UI.SectionTitle>{MYPAGE_COPY.sections.profile}</UI.SectionTitle>

      {/* 가게명 */}
      <UI.InlineRow
        label={MYPAGE_COPY.labels.shopName}
        right={
          props.editing && props.canEditShop ? (
            <UI.InputWrap>
              <UI.Input
                value={props.shopNameValue}
                onChange={props.onChangeShopName}
                placeholder={MYPAGE_COPY.placeholders.shopName}
                disabled={props.savingShopName}
              />
            </UI.InputWrap>
          ) : (
            <UI.ValueText>{props.shopNameText}</UI.ValueText>
          )
        }
      />
      {props.saveShopNameError ? (
        <UI.ErrorText>{props.saveShopNameError}</UI.ErrorText>
      ) : null}

      {/* 이름 */}
      <UI.InlineRow
        label={MYPAGE_COPY.labels.displayName}
        right={
          props.editing ? (
            <UI.InputWrap>
              <UI.Input
                value={props.displayNameValue}
                onChange={props.onChangeDisplayName}
                placeholder={MYPAGE_COPY.placeholders.displayName}
                disabled={props.savingName}
              />
            </UI.InputWrap>
          ) : (
            <UI.ValueText>{props.displayNameText}</UI.ValueText>
          )
        }
      />
      {props.saveNameError ? (
        <UI.ErrorText>{props.saveNameError}</UI.ErrorText>
      ) : null}

      <UI.ThinDivider />

      <UI.Row label={MYPAGE_COPY.labels.position} value={props.positionLabel} />
      <UI.Row label={MYPAGE_COPY.labels.role} value={props.roleLabel} />

      <UI.GhostButton
        type="button"
        onClick={props.onPrimaryClick}
        disabled={props.primaryDisabled}
      >
        {props.showSaveSpinner ? (
          <UI.InlineStack>
            <Spinner size="xs" />
            <span>{props.primaryLabel}</span>
          </UI.InlineStack>
        ) : (
          props.primaryLabel
        )}
      </UI.GhostButton>
    </UI.Card>
  );
}
