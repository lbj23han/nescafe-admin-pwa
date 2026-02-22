import type { Scope, Step } from "@/hooks/ai/internal/types";

export const AI_ASSISTANT_TITLE = "AI비서";

export const AI_ASSISTANT_ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  DATE_REQUIRED:
    '날짜를 포함해서 다시 입력해주세요. (예: "내일", "다음주 수요일", "2/2", "2026-02-02")',
  UNRECOGNIZED_INPUT:
    "입력을 이해하지 못했어요. 날짜 + (메뉴/부서/시간/금액) 중 1개 이상을 포함해 다시 입력해주세요.\n" +
    '예: "내일 3시 A과 아메리카노 2잔 8000원"',
  NOT_IMPLEMENTED: "장부 관리는 아직 준비 중입니다. (예약관리만 가능)",
  INPUT_REQUIRED: "내용을 입력해주세요.",
  OPENAI_KEY_MISSING: "서버 설정이 필요합니다. (OPENAI 키 누락)",
  INVALID_TASK: "지원하지 않는 업무 유형입니다. (예약/장부 중 선택)",
  INVALID_MODEL_OUTPUT: "AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요.",
};

export function toAiAssistantUserErrorMessage(codeOrUnknown: unknown) {
  const code = String(codeOrUnknown ?? "");
  return (
    AI_ASSISTANT_ERROR_MESSAGE_BY_CODE[code] ??
    "AI 요청에 실패했습니다. 잠시 후 다시 시도해주세요."
  );
}

export type AiAssistantCopy = {
  title: string;
  subtitle: string;
  inputPlaceholder: string;
  helperText: string;
};

export function getAiAssistantCopy(args: {
  step: Step;
  scope: Scope | null;
}): AiAssistantCopy {
  const { step, scope } = args;

  const subtitle =
    step === "pickScope"
      ? "업무를 선택한 뒤 명령하면, 확인 후 적용할 수 있어요."
      : step === "input"
      ? "입력 후 [등록]을 누르면 미리보기가 표시됩니다."
      : "미리보기 확인 후 [확인] 또는 [수정]을 선택하세요.";

  const inputPlaceholder =
    scope === "reservation"
      ? '예: "내일 3시 A과 아메리카노 2잔 8000원"'
      : '예: "A과 예치금 5만원 입금"';

  const helperText =
    scope === "reservation"
      ? '예: "내일 3시 B과 라떼 2잔" / "다음주 수요일 A과 아메 2잔 8000원"'
      : '예: "B부서 2만원 추가" / "A과 1만원 차감"';

  return {
    title: AI_ASSISTANT_TITLE,
    subtitle,
    inputPlaceholder,
    helperText,
  };
}
