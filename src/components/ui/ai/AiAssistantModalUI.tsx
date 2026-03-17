"use client";

import { FLOATING_MENU_UI } from "@/components/ui/navigation/floatingMenu.ui";
import { ReservationDepartmentLinkConfirmSheet } from "@/components/ui/day/reservations/ReservationDepartmentLinkConfirmSheet";
import { AI_ASSISTANT_MODAL_TEXT as T } from "@/constants/aiAssistantModal";

import type { AiAssistantModalUIProps } from "./AiAssistantModal.types";
import {
  PickScopeSection,
  InputSection,
  PreviewSection,
} from "./AiAssistantModal.sections";

export function AiAssistantModalUI(props: AiAssistantModalUIProps) {
  if (!props.open) return null;

  const linkOpen = !!props.departmentLink?.open;

  return (
    <>
      <button
        type="button"
        className={`${FLOATING_MENU_UI.overlay} ${
          linkOpen ? "pointer-events-none" : ""
        }`}
        data-state={props.open ? "open" : "closed"}
        aria-label={T.ariaCloseOverlay}
        onClick={props.onClose}
      />

      <div
        className={FLOATING_MENU_UI.modal}
        data-state={props.open ? "open" : "closed"}
        role="dialog"
        aria-modal="true"
        aria-label={props.title}
      >
        <div className={FLOATING_MENU_UI.modalInner}>
          <div className={FLOATING_MENU_UI.header}>
            <div className={FLOATING_MENU_UI.titleWrap}>
              <div className={FLOATING_MENU_UI.title}>{props.title}</div>
              <div className={FLOATING_MENU_UI.subtitle}>{props.subtitle}</div>
            </div>

            <button
              type="button"
              className={FLOATING_MENU_UI.closeBtn}
              onClick={props.onClose}
              disabled={linkOpen}
            >
              {T.close}
            </button>
          </div>

          {props.step === "pickScope" ? (
            <PickScopeSection
              linkOpen={linkOpen}
              onPickScope={props.onPickScope}
            />
          ) : props.step === "input" ? (
            <InputSection
              linkOpen={linkOpen}
              scope={props.scope}
              input={props.input}
              inputPlaceholder={props.inputPlaceholder}
              helperText={props.helperText}
              errorText={props.errorText}
              loading={props.loading}
              onBack={props.onBack}
              onChangeInput={props.onChangeInput}
              onRequestPreview={props.onRequestPreview}
            />
          ) : (
            <PreviewSection
              linkOpen={linkOpen}
              previewText={props.previewText}
              noticeText={props.noticeText}
              onEdit={props.onEdit}
              onConfirm={props.onConfirm}
            />
          )}
        </div>
      </div>

      <ReservationDepartmentLinkConfirmSheet
        open={!!props.departmentLink?.open}
        inputText={props.departmentLink?.inputText ?? ""}
        candidates={props.departmentLink?.candidates ?? []}
        onClose={props.onCloseDepartmentLink ?? (() => {})}
        onConfirmLink={props.onConfirmDepartmentLink ?? (() => {})}
        onConfirmUnlink={props.onConfirmDepartmentUnlink ?? (() => {})}
      />
    </>
  );
}
