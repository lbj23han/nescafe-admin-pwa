"use client";

import { FLOATING_MENU_UI } from "@/components/ui/navigation/floatingMenu.ui";
import { Spinner } from "@/components/Spinner";
import { AI_ASSISTANT_MODAL_TEXT as T } from "@/constants/aiAssistantModal";

import type {
  InputSectionProps,
  PickScopeSectionProps,
  PreviewSectionProps,
} from "./AiAssistantModal.types";

export function PickScopeSection(props: PickScopeSectionProps) {
  return (
    <div className={FLOATING_MENU_UI.section}>
      <div className={FLOATING_MENU_UI.sectionTitle}>{T.pickScopeTitle}</div>

      <div className={FLOATING_MENU_UI.grid}>
        <button
          type="button"
          className={FLOATING_MENU_UI.cardBtn}
          onClick={() => props.onPickScope("reservation")}
          disabled={props.linkOpen}
        >
          <div className={FLOATING_MENU_UI.cardTitle}>
            {T.scopeReservationTitle}
          </div>
          <div className={FLOATING_MENU_UI.cardDesc}>
            {T.scopeReservationDesc}
          </div>
        </button>

        <button
          type="button"
          className={FLOATING_MENU_UI.cardBtn}
          onClick={() => props.onPickScope("ledger")}
          disabled={props.linkOpen}
        >
          <div className={FLOATING_MENU_UI.cardTitle}>{T.scopeLedgerTitle}</div>
          <div className={FLOATING_MENU_UI.cardDesc}>{T.scopeLedgerDesc}</div>
        </button>
      </div>
    </div>
  );
}

export function InputSection(props: InputSectionProps) {
  const title =
    props.scope === "reservation"
      ? T.scopeReservationTitle
      : T.scopeLedgerTitle;

  return (
    <div className={FLOATING_MENU_UI.section}>
      <div className={FLOATING_MENU_UI.sectionTitle}>{title}</div>

      <input
        className={FLOATING_MENU_UI.input}
        value={props.input}
        placeholder={props.inputPlaceholder}
        onChange={(e) => props.onChangeInput(e.target.value)}
        disabled={props.linkOpen || props.loading}
      />

      {props.errorText ? (
        <div
          className={FLOATING_MENU_UI.helper}
          role="alert"
          aria-live="polite"
        >
          {props.errorText}
        </div>
      ) : null}

      <div className={FLOATING_MENU_UI.helper}>{props.helperText}</div>

      <div className={FLOATING_MENU_UI.actions}>
        <button
          type="button"
          className={FLOATING_MENU_UI.ghostBtn}
          onClick={props.onBack}
          disabled={props.linkOpen || props.loading}
        >
          {T.back}
        </button>

        <button
          type="button"
          className={`${FLOATING_MENU_UI.primaryBtn} min-w-[50px] flex items-center justify-center`}
          onClick={props.onRequestPreview}
          disabled={props.linkOpen || props.loading || !props.input.trim()}
          aria-busy={props.loading}
          aria-label={props.loading ? "로딩 중" : T.requestPreview}
        >
          {props.loading ? <Spinner size="sm" /> : T.requestPreview}
        </button>
      </div>
    </div>
  );
}

export function PreviewSection(props: PreviewSectionProps) {
  return (
    <div className={FLOATING_MENU_UI.section}>
      <div className={FLOATING_MENU_UI.sectionTitle}>{T.previewTitle}</div>

      <div className={FLOATING_MENU_UI.previewBox}>
        {props.previewText ?? T.previewLoading}
      </div>

      {props.noticeText ? (
        <div className={FLOATING_MENU_UI.helper} aria-live="polite">
          {props.noticeText}
        </div>
      ) : null}

      <div className={FLOATING_MENU_UI.actions}>
        <button
          type="button"
          className={FLOATING_MENU_UI.ghostBtn}
          onClick={props.onEdit}
          disabled={props.linkOpen}
        >
          {T.edit}
        </button>

        <button
          type="button"
          className={FLOATING_MENU_UI.primaryBtn}
          onClick={props.onConfirm}
          disabled={props.linkOpen || !props.previewText}
        >
          {T.confirm}
        </button>
      </div>
    </div>
  );
}
