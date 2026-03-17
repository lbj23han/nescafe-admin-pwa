"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Scope, Step } from "./internal/types";
import { useAiPreviewFlow } from "./internal/hooks/useAiPreviewFlow";
import {
  confirmAiIntent,
  confirmDeptLink,
  confirmDeptUnlink,
} from "./internal/pipeline/confirm/confirm";
import {
  navigateToDayReservation,
  navigateToDepartmentsPrefill,
} from "./internal/pipeline/navigation";
import { getAiAssistantCopy } from "@/constants/aiAssistant";

export function useAiAssistantModal() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("pickScope");
  const [scope, setScope] = useState<Scope | null>(null);
  const [input, setInput] = useState("");

  const {
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
  } = useAiPreviewFlow({
    input,
    scope,
    setStep,
  });

  const resetAll = useCallback(() => {
    setStep("pickScope");
    setScope(null);
    setInput("");
    resetPreviewFlow();
  }, [resetPreviewFlow]);

  const onOpen = useCallback(() => {
    setOpen(true);
    resetAll();
  }, [resetAll]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onPickScope = useCallback(
    (nextScope: Scope) => {
      setScope(nextScope);
      setStep("input");
      setInput("");
      clearPreviewState();
    },
    [clearPreviewState],
  );

  const onBack = useCallback(() => {
    resetAll();
  }, [resetAll]);

  const onChangeInput = useCallback(
    (value: string) => {
      setInput(value);
      clearPreviewState();
    },
    [clearPreviewState],
  );

  const pushToDay = useCallback(
    (
      intent: Parameters<typeof navigateToDayReservation>[0]["intent"],
      extra?: Parameters<typeof navigateToDayReservation>[0]["extra"],
    ) => {
      navigateToDayReservation({
        router,
        intent,
        extra,
      });
      setOpen(false);
    },
    [router],
  );

  const pushToDepartmentsPrefill = useCallback(
    (args: {
      departmentId: string;
      type: "deposit" | "order";
      amount: number;
    }) => {
      navigateToDepartmentsPrefill({
        router,
        departmentId: args.departmentId,
        type: args.type,
        amount: args.amount,
      });
      setOpen(false);
    },
    [router],
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
  }, [intent, pushToDay, pushToDepartmentsPrefill, setDeptLink, setNoticeText]);

  const onCloseDeptLink = useCallback(() => {
    setDeptLink({ open: false });
  }, [setDeptLink]);

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
    [intent, pushToDay, pushToDepartmentsPrefill, setDeptLink, setNoticeText],
  );

  const onConfirmDeptUnlink = useCallback(() => {
    if (!intent) return;

    confirmDeptUnlink({
      intent,
      setDeptLink,
      pushToDay,
    });
  }, [intent, pushToDay, setDeptLink]);

  const copy = useMemo(
    () => getAiAssistantCopy({ step, scope }),
    [scope, step],
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
