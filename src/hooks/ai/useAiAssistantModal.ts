"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  AiAssistantResponse,
  ReservationIntent,
  Scope,
  Step,
} from "./internal/types";
import { toReservationPreviewText } from "./internal/preview";

type PostArgs = {
  task: Scope;
  text: string;
};

async function postAiAssistant(args: PostArgs): Promise<AiAssistantResponse> {
  const res = await fetch("/api/ai/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: args.task, input: args.text }),
  });

  const json = (await res.json().catch(() => null)) as unknown;

  if (json && typeof json === "object" && "ok" in json) {
    return json as AiAssistantResponse;
  }

  return { ok: false, error: "OPENAI_FAILED" };
}

function isReservationIntent(v: unknown): v is ReservationIntent {
  if (!v || typeof v !== "object") return false;
  const obj = v as Record<string, unknown>;
  return (
    obj.kind === "reservation" &&
    typeof obj.date === "string" &&
    "assumptions" in obj &&
    "warnings" in obj
  );
}

function toUserErrorMessage(codeOrUnknown: unknown) {
  // error code 기반 UX(최소). 상세 메시지는 추후 확장 가능.
  const code = String(codeOrUnknown ?? "");
  switch (code) {
    case "DATE_REQUIRED":
      return "날짜를 포함해서 다시 입력해주세요. (예: 2/2, 2026-02-02)";
    case "UNRECOGNIZED_INPUT":
      return (
        "입력을 이해하지 못했어요. 날짜 + (메뉴/부서/시간/금액) 중 1개 이상을 포함해 다시 입력해주세요.\n" +
        '예: "2/2 3시 A부서 아메리카노 2잔 8000원"'
      );
    case "NOT_IMPLEMENTED":
      return "장부 관리는 아직 준비 중입니다. (예약관리만 가능)";
    case "INPUT_REQUIRED":
      return "내용을 입력해주세요.";
    case "OPENAI_KEY_MISSING":
      return "서버 설정이 필요합니다. (OPENAI 키 누락)";
    case "INVALID_TASK":
      return "지원하지 않는 업무 유형입니다. (예약/장부 중 선택)";
    case "INVALID_MODEL_OUTPUT":
      return "AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요.";
    default:
      return "AI 요청에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
}

export function useAiAssistantModal() {
  const [open, setOpen] = useState(false);

  const [step, setStep] = useState<Step>("pickScope");
  const [scope, setScope] = useState<Scope | null>(null);

  const [input, setInput] = useState("");
  const [previewText, setPreviewText] = useState<string | null>(null);

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [intent, setIntent] = useState<ReservationIntent | null>(null);

  const resetAll = useCallback(() => {
    setStep("pickScope");
    setScope(null);
    setInput("");
    setPreviewText(null);
    setLoadingPreview(false);
    setErrorText(null);
    setIntent(null);
  }, []);

  const onOpen = useCallback(() => {
    setOpen(true);
    resetAll();
  }, [resetAll]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onPickScope = useCallback((s: Scope) => {
    setScope(s);
    setStep("input");
    setInput("");
    setPreviewText(null);
    setErrorText(null);
    setIntent(null);
  }, []);

  const onBack = useCallback(() => {
    resetAll();
  }, [resetAll]);

  const onChangeInput = useCallback((v: string) => {
    setInput(v);
    setPreviewText(null);
    setErrorText(null);
    setIntent(null);
  }, []);

  // input -> preview (강제)
  const onRequestPreview = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || !scope) return;

    // reset
    setErrorText(null);
    setPreviewText(null);
    setIntent(null);

    setLoadingPreview(true);

    try {
      const out = await postAiAssistant({ task: scope, text: trimmed });

      if (!out.ok) {
        // 실패 시: input 단계로 되돌림 + 에러 표시
        setStep("input");
        setErrorText(toUserErrorMessage(out.error));
        return;
      }

      // ok: true
      if (!isReservationIntent(out.data)) {
        // ledger거나 스키마가 예상과 다르면 입력으로 복귀
        setStep("input");
        setErrorText(
          scope === "ledger"
            ? "장부 관리는 아직 준비 중입니다. (예약관리만 가능)"
            : "AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요."
        );
        return;
      }

      // 성공: preview 단계로 전환 + 요약 텍스트 생성
      setIntent(out.data);
      setPreviewText(toReservationPreviewText(out.data));
      setStep("preview");
    } catch {
      setStep("input");
      setErrorText("AI 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoadingPreview(false);
    }
  }, [input, scope]);

  // preview -> input
  const onEdit = useCallback(() => {
    setStep("input");
    setPreviewText(null);
    setErrorText(null);
    // intent는 수정 후 다시 preview 생성해야 하므로 제거
    setIntent(null);
  }, []);

  const onConfirm = useCallback(() => {
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
      loadingPreview,
      errorText,
      intent,

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
      loadingPreview,
      errorText,
      intent,
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
