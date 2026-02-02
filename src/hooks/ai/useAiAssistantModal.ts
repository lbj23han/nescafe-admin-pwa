"use client";

import { useCallback, useMemo, useState } from "react";

type Scope = "reservation" | "ledger";
type Step = "pickScope" | "input" | "preview";

export function useAiAssistantModal() {
  const [open, setOpen] = useState(false);

  const [step, setStep] = useState<Step>("pickScope");
  const [scope, setScope] = useState<Scope | null>(null);

  const [input, setInput] = useState("");
  const [previewText, setPreviewText] = useState<string | null>(null);

  const onOpen = useCallback(() => {
    setOpen(true);
    setStep("pickScope");
    setScope(null);
    setInput("");
    setPreviewText(null);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onPickScope = useCallback((s: Scope) => {
    setScope(s);
    setStep("input");
    setInput("");
    setPreviewText(null);
  }, []);

  const onBack = useCallback(() => {
    setStep("pickScope");
    setScope(null);
    setInput("");
    setPreviewText(null);
  }, []);

  const onChangeInput = useCallback((v: string) => {
    setInput(v);
    // 입력이 바뀌면 프리뷰 무효화
    setPreviewText(null);
  }, []);

  // input -> preview (강제)
  const onRequestPreview = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || !scope) return;

    setStep("preview");

    // 지금은 placeholder 프리뷰
    const title = scope === "reservation" ? "예약관리" : "장부관리";
    setPreviewText(
      `${title} 요청을 아래 내용으로 처리할까요?\n\n“${trimmed}”\n\n(다음 단계에서 AI가 구조화 결과를 보여줍니다)`
    );
  }, [input, scope]);

  // preview -> input
  const onEdit = useCallback(() => {
    setStep("input");
    // previewText는 남겨도 되지만, 수정 유도라면 null 처리하는 게 깔끔
    setPreviewText(null);
  }, []);

  // 확인(적용) - 다음 단계에서 기존 로직에 위임
  const onConfirm = useCallback(() => {
    // placeholder: 실제 적용 연결 예정
    setPreviewText((p) => (p ? `${p}\n\n✅ 확인됨 (적용 연결 예정)` : p));
  }, []);

  const copy = useMemo(() => {
    const subtitle =
      step === "pickScope"
        ? "업무를 선택한 뒤 명령하면, 확인 후 적용할 수 있어요."
        : step === "input"
        ? "입력 후 [등록]을 누르면 미리보기가 표시됩니다."
        : "미리보기 확인 후 [확인] 또는 [수정]을 선택하세요.";

    const inputPlaceholder =
      scope === "reservation"
        ? '예: "오늘 A부서 아메리카노 2잔 8000원"'
        : '예: "A부서 예치금 5만원 입금"';

    const helperText =
      scope === "reservation"
        ? '예: "어제 예약 중 김철수 삭제" / "오늘 3시 B부서 라떼 2잔"'
        : '예: "B부서 미수금 2만원 추가" / "A부서 예치금에서 1만원 차감"';

    return {
      title: "AI비서",
      subtitle,
      inputPlaceholder,
      helperText,
    };
  }, [scope, step]);

  return useMemo(
    () => ({
      open,
      step,
      scope,
      input,
      previewText,
      copy,
      onOpen,
      onClose,
      onBack,
      onPickScope,
      onChangeInput,
      onRequestPreview,
      onEdit,
      onConfirm,
    }),
    [
      open,
      step,
      scope,
      input,
      previewText,
      copy,
      onOpen,
      onClose,
      onBack,
      onPickScope,
      onChangeInput,
      onRequestPreview,
      onEdit,
      onConfirm,
    ]
  );
}
