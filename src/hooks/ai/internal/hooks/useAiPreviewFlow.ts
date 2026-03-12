import { useCallback, useState } from "react";

import type { AiIntent, Scope, Step } from "../types";
import { requestAiPreview } from "../pipeline/requestPreview";
import type { DeptLinkSheetState } from "../pipeline/confirm/confirm";
import { toAiAssistantUserErrorMessage } from "@/constants/aiAssistant";

export function useAiPreviewFlow(args: {
  input: string;
  scope: Scope | null;
  setStep: (step: Step) => void;
}) {
  const { input, scope, setStep } = args;

  const [previewText, setPreviewText] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [intent, setIntent] = useState<AiIntent | null>(null);
  const [noticeText, setNoticeText] = useState<string | null>(null);
  const [deptLink, setDeptLink] = useState<DeptLinkSheetState>({ open: false });

  const clearPreviewState = useCallback(() => {
    setPreviewText(null);
    setErrorText(null);
    setIntent(null);
    setNoticeText(null);
    setDeptLink({ open: false });
  }, []);

  const resetPreviewFlow = useCallback(() => {
    clearPreviewState();
    setLoadingPreview(false);
  }, [clearPreviewState]);

  const onRequestPreview = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || !scope) return;

    clearPreviewState();
    setLoadingPreview(true);

    try {
      const result = await requestAiPreview({ scope, input: trimmed });

      if (!result.ok) {
        setStep("input");
        setErrorText(toAiAssistantUserErrorMessage(result.errorCode));
        return;
      }

      setIntent(result.intent);
      setPreviewText(result.previewText);
      setStep("preview");
    } catch {
      setStep("input");
      setErrorText(toAiAssistantUserErrorMessage("OPENAI_FAILED"));
    } finally {
      setLoadingPreview(false);
    }
  }, [clearPreviewState, input, scope, setStep]);

  const onEdit = useCallback(() => {
    setStep("input");
    clearPreviewState();
  }, [clearPreviewState, setStep]);

  return {
    previewText,
    loadingPreview,
    errorText,
    intent,
    noticeText,
    deptLink,

    setDeptLink,
    setNoticeText,

    clearPreviewState,
    resetPreviewFlow,
    onRequestPreview,
    onEdit,
  };
}
