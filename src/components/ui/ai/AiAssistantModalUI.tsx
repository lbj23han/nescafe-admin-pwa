"use client";

import { FLOATING_MENU_UI } from "@/components/ui/navigation/floatingMenu.ui";

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

  previewText: string | null;

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
  previewText,
  onClose,
  onBack,
  onPickScope,
  onChangeInput,
  onRequestPreview,
  onEdit,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className={FLOATING_MENU_UI.overlay}
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
              />

              <div className={FLOATING_MENU_UI.helper}>{helperText}</div>

              <div className={FLOATING_MENU_UI.actions}>
                <button
                  type="button"
                  className={FLOATING_MENU_UI.ghostBtn}
                  onClick={onBack}
                >
                  뒤로
                </button>

                <button
                  type="button"
                  className={FLOATING_MENU_UI.primaryBtn}
                  onClick={onRequestPreview}
                  disabled={!input.trim()}
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
                >
                  수정
                </button>

                <button
                  type="button"
                  className={FLOATING_MENU_UI.primaryBtn}
                  onClick={onConfirm}
                  disabled={!previewText}
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
