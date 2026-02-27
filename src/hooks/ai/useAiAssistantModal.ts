"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  AiIntent,
  ReservationIntent,
  Scope,
  Step,
} from "./internal/types";

import {
  buildDayReservationPrefillQuery,
  toQueryString,
} from "./internal/prefill/prefill";

import {
  confirmAiIntent,
  confirmDeptLink,
  confirmDeptUnlink,
  type DeptLinkSheetState,
} from "./internal/pipeline/confirm/confirm";

import { requestAiPreview } from "./internal/pipeline/requestPreview";

import {
  getAiAssistantCopy,
  toAiAssistantUserErrorMessage,
} from "@/constants/aiAssistant";

export function useAiAssistantModal() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [step, setStep] = useState<Step>("pickScope");
  const [scope, setScope] = useState<Scope | null>(null);

  const [input, setInput] = useState("");
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

  const resetAll = useCallback(() => {
    setStep("pickScope");
    setScope(null);
    setInput("");
    clearPreviewState();
    setLoadingPreview(false);
  }, [clearPreviewState]);

  const onOpen = useCallback(() => {
    setOpen(true);
    resetAll();
  }, [resetAll]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onPickScope = useCallback(
    (s: Scope) => {
      setScope(s);
      setStep("input");
      setInput("");
      clearPreviewState();
    },
    [clearPreviewState]
  );

  const onBack = useCallback(() => {
    resetAll();
  }, [resetAll]);

  const onChangeInput = useCallback(
    (v: string) => {
      setInput(v);
      clearPreviewState();
    },
    [clearPreviewState]
  );

  const onRequestPreview = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || !scope) return;

    clearPreviewState();
    setLoadingPreview(true);

    try {
      const r = await requestAiPreview({ scope, input: trimmed });

      if (!r.ok) {
        setStep("input");
        setErrorText(toAiAssistantUserErrorMessage(r.errorCode));
        return;
      }

      setIntent(r.intent);
      setPreviewText(r.previewText);
      setStep("preview");
    } catch {
      setStep("input");
      setErrorText(toAiAssistantUserErrorMessage("OPENAI_FAILED"));
    } finally {
      setLoadingPreview(false);
    }
  }, [clearPreviewState, input, scope]);

  const onEdit = useCallback(() => {
    setStep("input");
    clearPreviewState();
  }, [clearPreviewState]);

  const pushToDay = useCallback(
    (
      it: ReservationIntent,
      extra?: {
        departmentMode?: "select" | "direct";
        selectedDepartmentId?: string;
      }
    ) => {
      const q = buildDayReservationPrefillQuery(it, extra);
      const qs = toQueryString(q);
      router.push(`/day/${it.date}${qs}`);
      setOpen(false);
    },
    [router]
  );

  const pushToDepartmentsPrefill = useCallback(
    (args: {
      departmentId: string;
      type: "deposit" | "order";
      amount: number;
    }) => {
      const qs =
        `?ai=1` +
        `&deptId=${encodeURIComponent(args.departmentId)}` +
        `&type=${encodeURIComponent(args.type)}` +
        `&amount=${encodeURIComponent(String(args.amount))}`;

      router.push(`/departments${qs}`);
      setOpen(false);
    },
    [router]
  );

  const onConfirm = useCallback(async () => {
    if (!intent) return;

    await confirmAiIntent({
      intent,
      setDeptLink,
      setNoticeText,
      pushToDay,
      pushToDepartmentsPrefill,
    });
  }, [intent, pushToDay, pushToDepartmentsPrefill]);

  const onCloseDeptLink = useCallback(() => {
    setDeptLink({ open: false });
  }, []);

  const onConfirmDeptLink = useCallback(
    (departmentId: string) => {
      if (!intent) return;

      confirmDeptLink({
        intent,
        departmentId,
        setDeptLink,
        setNoticeText,
        pushToDay,
        pushToDepartmentsPrefill,
      });
    },
    [intent, pushToDay, pushToDepartmentsPrefill]
  );

  const onConfirmDeptUnlink = useCallback(() => {
    if (!intent) return;

    confirmDeptUnlink({
      intent,
      setDeptLink,
      pushToDay,
    });
  }, [intent, pushToDay]);

  const copy = useMemo(
    () => getAiAssistantCopy({ step, scope }),
    [scope, step]
  );

  return {
    open,
    step,
    scope,
    input,
    previewText,
    loadingPreview,
    errorText,
    intent,
    noticeText,

    deptLink,
    onCloseDeptLink,
    onConfirmDeptLink,
    onConfirmDeptUnlink,

    copy,
    onOpen,
    onClose,
    onBack,
    onPickScope,
    onChangeInput,
    onRequestPreview,
    onEdit,
    onConfirm,
  };
}
