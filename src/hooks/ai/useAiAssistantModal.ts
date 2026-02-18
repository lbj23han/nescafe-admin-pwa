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
  toLedgerPreviewText,
  toReservationPreviewText,
} from "./internal/pipeline/preview";

import {
  buildDayReservationPrefillQuery,
  toQueryString,
} from "./internal/prefill/prefill";

import { DepartmentsRepo } from "@/lib/data";

import {
  resolveDepartmentLink,
  type DepartmentLinkCandidate,
} from "@/hooks/reservation/internal/departments/resolveDepartmentLink";

import { getKstTodayIso } from "./internal/date/kstDate";
import { resolveRelativeDate } from "./internal/date/resolveRelativeDate";

import { postAiAssistant } from "./internal/api/api";
import { isLedgerIntent, isReservationIntent } from "./internal/guards/guards";
import {
  buildDeptCandidateTextFromRaw,
  firstToken,
  toNonEmpty,
} from "./internal/utils/departmentCandidate";
import { safePositiveInt } from "./internal/utils/number";

import {
  getAiAssistantCopy,
  toAiAssistantUserErrorMessage,
} from "@/constants/aiAssistant";

type DeptLinkSheetState =
  | { open: false }
  | {
      open: true;
      inputText: string;
      candidates: DepartmentLinkCandidate[];
    };

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

  const resetAll = useCallback(() => {
    setStep("pickScope");
    setScope(null);
    setInput("");
    setPreviewText(null);
    setLoadingPreview(false);
    setErrorText(null);
    setIntent(null);
    setNoticeText(null);
    setDeptLink({ open: false });
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
    setNoticeText(null);
    setDeptLink({ open: false });
  }, []);

  const onBack = useCallback(() => {
    resetAll();
  }, [resetAll]);

  const onChangeInput = useCallback((v: string) => {
    setInput(v);
    setPreviewText(null);
    setErrorText(null);
    setIntent(null);
    setNoticeText(null);
    setDeptLink({ open: false });
  }, []);

  const onRequestPreview = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || !scope) return;

    setErrorText(null);
    setPreviewText(null);
    setIntent(null);
    setNoticeText(null);
    setDeptLink({ open: false });

    setLoadingPreview(true);

    try {
      const todayIso = getKstTodayIso();

      const resolved = resolveRelativeDate({ input: trimmed, todayIso });
      const resolvedDateIso = resolved.ok ? resolved.date : undefined;

      const out = await postAiAssistant({
        task: scope,
        text: trimmed,
        todayIso,
        resolvedDateIso,
      });

      if (!out.ok) {
        setStep("input");
        setErrorText(toAiAssistantUserErrorMessage(out.error));
        return;
      }

      if (scope === "reservation") {
        if (!isReservationIntent(out.data)) {
          setStep("input");
          setErrorText(toAiAssistantUserErrorMessage("INVALID_MODEL_OUTPUT"));
          return;
        }

        setIntent(out.data);
        setPreviewText(toReservationPreviewText(out.data));
        setStep("preview");
        return;
      }

      // scope === "ledger"
      if (!isLedgerIntent(out.data)) {
        setStep("input");
        setErrorText(toAiAssistantUserErrorMessage("INVALID_MODEL_OUTPUT"));
        return;
      }

      setIntent(out.data);
      setPreviewText(toLedgerPreviewText(out.data));
      setStep("preview");
    } catch {
      setStep("input");
      setErrorText(toAiAssistantUserErrorMessage("OPENAI_FAILED"));
    } finally {
      setLoadingPreview(false);
    }
  }, [input, scope]);

  const onEdit = useCallback(() => {
    setStep("input");
    setPreviewText(null);
    setErrorText(null);
    setIntent(null);
    setNoticeText(null);
    setDeptLink({ open: false });
  }, []);

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

  /**
   * Confirm 버튼:
   * - reservation: 기존 정책 그대로(항상 연동 sheet)
   * - ledger: departments 페이지로 이동 + 폼 프리필(실제 저장은 사용자가 버튼 클릭)
   */
  const onConfirm = useCallback(async () => {
    if (!intent) return;

    // ledger confirm: departments로 프리필 이동
    if (intent.kind === "ledger") {
      const depText = toNonEmpty(intent.department);
      if (!depText) {
        setNoticeText(
          "부서를 확인할 수 없어요. 부서명을 포함해서 다시 입력해주세요."
        );
        return;
      }

      // 이번 단계 정책: 입금/차감만
      if (intent.action !== "deposit" && intent.action !== "withdraw") {
        setNoticeText('현재 AI 장부 입력은 "입금/차감"만 지원합니다.');
        return;
      }

      const amt = safePositiveInt(intent.amount);
      if (!amt) {
        setNoticeText("금액을 확인할 수 없어요. 예: “공정경제과 100만원 입금”");
        return;
      }

      try {
        const departments = await DepartmentsRepo.getDepartments();

        // 완전 일치 우선
        const exact = departments.find((d) => d.name.trim() === depText.trim());
        if (exact) {
          pushToDepartmentsPrefill({
            departmentId: exact.id,
            type: intent.action === "deposit" ? "deposit" : "order",
            amount: amt,
          });
          return;
        }

        // 후보 확인 시트
        const link = resolveDepartmentLink({
          inputText: depText,
          departments,
        });

        if (link.kind === "confirm") {
          setDeptLink({
            open: true,
            inputText: link.inputText,
            candidates: link.candidates,
          });
          return;
        }

        // 후보 없음
        setDeptLink({
          open: true,
          inputText: depText,
          candidates: [],
        });
      } catch (e) {
        console.error(e);
        setNoticeText(
          "부서 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
        );
      }

      return;
    }

    // ===== reservation 전용 (pushToDay 안 씀) =====
    const reservationIntent = intent as ReservationIntent;

    try {
      const departments = await DepartmentsRepo.getDepartments();

      const depFromModel = toNonEmpty(reservationIntent.department);
      if (depFromModel) {
        const link = resolveDepartmentLink({
          inputText: depFromModel,
          departments,
        });

        if (link.kind === "confirm") {
          setDeptLink({
            open: true,
            inputText: link.inputText,
            candidates: link.candidates,
          });
          return;
        }

        setDeptLink({
          open: true,
          inputText: depFromModel,
          candidates: [],
        });
        return;
      }

      const candidateText = buildDeptCandidateTextFromRaw(
        reservationIntent.raw_text
      );
      const first = firstToken(candidateText);

      if (first) {
        const linkFirst = resolveDepartmentLink({
          inputText: first,
          departments,
        });

        if (linkFirst.kind === "confirm") {
          setDeptLink({
            open: true,
            inputText: linkFirst.inputText,
            candidates: linkFirst.candidates,
          });
          return;
        }

        setDeptLink({
          open: true,
          inputText: first,
          candidates: [],
        });
        return;
      }

      setDeptLink({
        open: true,
        inputText: "",
        candidates: [],
      });
    } catch (e) {
      console.error(e);
      setDeptLink({
        open: true,
        inputText: toNonEmpty(reservationIntent.department) ?? "",
        candidates: [],
      });
    }
  }, [intent, pushToDepartmentsPrefill]);

  const onCloseDeptLink = useCallback(() => {
    setDeptLink({ open: false });
  }, []);

  const onConfirmDeptLink = useCallback(
    (departmentId: string) => {
      if (!intent) return;

      setDeptLink({ open: false });

      // ledger: 선택된 부서로 departments 프리필 이동
      if (intent.kind === "ledger") {
        if (intent.action !== "deposit" && intent.action !== "withdraw") {
          setNoticeText('현재 AI 장부 입력은 "입금/차감"만 지원합니다.');
          return;
        }

        const amt = safePositiveInt(intent.amount);
        if (!amt) {
          setNoticeText("금액을 확인할 수 없어요.");
          return;
        }

        pushToDepartmentsPrefill({
          departmentId,
          type: intent.action === "deposit" ? "deposit" : "order",
          amount: amt,
        });
        return;
      }

      // reservation: 기존 그대로
      if (intent.kind !== "reservation") return;

      pushToDay(intent, {
        departmentMode: "select",
        selectedDepartmentId: departmentId,
      });
    },
    [intent, pushToDay, pushToDepartmentsPrefill]
  );

  const onConfirmDeptUnlink = useCallback(() => {
    if (!intent || intent.kind !== "reservation") return;
    setDeptLink({ open: false });
    pushToDay(intent, { departmentMode: "direct" });
  }, [intent, pushToDay]);

  const copy = useMemo(() => {
    return getAiAssistantCopy({ step, scope });
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
    ]
  );
}
