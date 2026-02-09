"use client";

import { FLOATING_MENU_UI } from "@/components/ui/navigation/floatingMenu.ui";
import { ReservationDepartmentLinkConfirmSheet } from "@/components/ui/day/reservations";
import type { DepartmentLinkCandidate } from "@/hooks/reservation/internal/departments/resolveDepartmentLink";

type AiAssistantScope = "reservation" | "ledger";

type Props = {
  open: boolean;

  title: string;
  subtitle: string;

  step: "pickScope" | "input" | "preview";
  scope: AiAssistantScope | null;

  input: string;
  inputPlaceholder: string;
  helperText: string;

  errorText: string | null;
  previewText: string | null;

  departmentLink?: {
    open: boolean;
    inputText: string;
    candidates: DepartmentLinkCandidate[];
  };
  onCloseDepartmentLink?: () => void;
  onConfirmDepartmentLink?: (departmentId: string) => void;
  onConfirmDepartmentUnlink?: () => void;

  onClose: () => void;
  onBack: () => void;

  onPickScope: (scope: AiAssistantScope) => void;
  onChangeInput: (v: string) => void;

  onRequestPreview: () => void;
  onEdit: () => void;
  onConfirm: () => void;
};

export function AiAssistantModalUI({
  open,
  title,
  subtitle,
  step,
  scope,
  input,
  inputPlaceholder,
  helperText,
  errorText,
  previewText,

  departmentLink,
  onCloseDepartmentLink,
  onConfirmDepartmentLink,
  onConfirmDepartmentUnlink,

  onClose,
  onBack,
  onPickScope,
  onChangeInput,
  onRequestPreview,
  onEdit,
  onConfirm,
}: Props) {
  if (!open) return null;

  const linkOpen = !!departmentLink?.open;

  return (
    <>
      <button
        type="button"
        className={`${FLOATING_MENU_UI.overlay} ${
          linkOpen ? "pointer-events-none" : ""
        }`}
        data-state={open ? "open" : "closed"}
        aria-label="AI비서 닫기"
        onClick={onClose}
      />

      <div
        className={FLOATING_MENU_UI.modal}
        data-state={open ? "open" : "closed"}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={FLOATING_MENU_UI.modalInner}>
          <div className={FLOATING_MENU_UI.header}>
            <div className={FLOATING_MENU_UI.titleWrap}>
              <div className={FLOATING_MENU_UI.title}>{title}</div>
              <div className={FLOATING_MENU_UI.subtitle}>{subtitle}</div>
            </div>

            <button
              type="button"
              className={FLOATING_MENU_UI.closeBtn}
              onClick={onClose}
              disabled={linkOpen}
            >
              닫기
            </button>
          </div>

          {step === "pickScope" ? (
            <div className={FLOATING_MENU_UI.section}>
              <div className={FLOATING_MENU_UI.sectionTitle}>업무 선택</div>
              <div className={FLOATING_MENU_UI.grid}>
                <button
                  type="button"
                  className={FLOATING_MENU_UI.cardBtn}
                  onClick={() => onPickScope("reservation")}
                  disabled={linkOpen}
                >
                  <div className={FLOATING_MENU_UI.cardTitle}>예약관리</div>
                  <div className={FLOATING_MENU_UI.cardDesc}>
                    예약 등록/수정/삭제
                  </div>
                </button>

                <button
                  type="button"
                  className={FLOATING_MENU_UI.cardBtn}
                  onClick={() => onPickScope("ledger")}
                  disabled={linkOpen}
                >
                  <div className={FLOATING_MENU_UI.cardTitle}>장부관리</div>
                  <div className={FLOATING_MENU_UI.cardDesc}>
                    예치금/미수금/정산
                  </div>
                </button>
              </div>
            </div>
          ) : step === "input" ? (
            <div className={FLOATING_MENU_UI.section}>
              <div className={FLOATING_MENU_UI.sectionTitle}>
                {scope === "reservation" ? "예약관리" : "장부관리"}
              </div>

              <input
                className={FLOATING_MENU_UI.input}
                value={input}
                placeholder={inputPlaceholder}
                onChange={(e) => onChangeInput(e.target.value)}
                disabled={linkOpen}
              />

              {errorText ? (
                <div
                  className={FLOATING_MENU_UI.helper}
                  role="alert"
                  aria-live="polite"
                >
                  {errorText}
                </div>
              ) : null}

              <div className={FLOATING_MENU_UI.helper}>{helperText}</div>

              <div className={FLOATING_MENU_UI.actions}>
                <button
                  type="button"
                  className={FLOATING_MENU_UI.ghostBtn}
                  onClick={onBack}
                  disabled={linkOpen}
                >
                  뒤로
                </button>

                <button
                  type="button"
                  className={FLOATING_MENU_UI.primaryBtn}
                  onClick={onRequestPreview}
                  disabled={linkOpen || !input.trim()}
                >
                  등록
                </button>
              </div>
            </div>
          ) : (
            <div className={FLOATING_MENU_UI.section}>
              <div className={FLOATING_MENU_UI.sectionTitle}>미리보기</div>

              {previewText ? (
                <div className={FLOATING_MENU_UI.previewBox}>{previewText}</div>
              ) : (
                <div className={FLOATING_MENU_UI.previewBox}>
                  미리보기 생성 중…
                </div>
              )}

              <div className={FLOATING_MENU_UI.actions}>
                <button
                  type="button"
                  className={FLOATING_MENU_UI.ghostBtn}
                  onClick={onEdit}
                  disabled={linkOpen}
                >
                  수정
                </button>

                <button
                  type="button"
                  className={FLOATING_MENU_UI.primaryBtn}
                  onClick={onConfirm}
                  disabled={linkOpen || !previewText}
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ReservationDepartmentLinkConfirmSheet
        open={!!departmentLink?.open}
        inputText={departmentLink?.inputText ?? ""}
        candidates={departmentLink?.candidates ?? []}
        onClose={onCloseDepartmentLink ?? (() => {})}
        onConfirmLink={onConfirmDepartmentLink ?? (() => {})}
        onConfirmUnlink={onConfirmDepartmentUnlink ?? (() => {})}
      />
    </>
  );
}
