"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AiAssistantResponse,
  ReservationIntent,
  Scope,
  Step,
} from "./internal/types";
import { toReservationPreviewText } from "./internal/preview";
import {
  buildDayReservationPrefillQuery,
  toQueryString,
} from "./internal/prefill";
import { DepartmentsRepo } from "@/lib/data";
import {
  resolveDepartmentLink,
  type DepartmentLinkCandidate,
} from "@/hooks/reservation/internal/departments/resolveDepartmentLink";
import { getKstTodayIso } from "./internal/date/kstDate";
import { resolveRelativeDate } from "./internal/date/resolveRelativeDate";

type PostArgs = {
  task: Scope;
  text: string;

  // commit8
  todayIso?: string;
  resolvedDateIso?: string;
};

async function postAiAssistant(args: PostArgs): Promise<AiAssistantResponse> {
  const res = await fetch("/api/ai/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      task: args.task,
      input: args.text,
      ...(args.todayIso ? { todayIso: args.todayIso } : {}),
      ...(args.resolvedDateIso
        ? { resolvedDateIso: args.resolvedDateIso }
        : {}),
    }),
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
  const code = String(codeOrUnknown ?? "");
  switch (code) {
    case "DATE_REQUIRED":
      return '날짜를 포함해서 다시 입력해주세요. (예: "내일", "다음주 수요일", "2/2", "2026-02-02")';
    case "UNRECOGNIZED_INPUT":
      return (
        "입력을 이해하지 못했어요. 날짜 + (메뉴/부서/시간/금액) 중 1개 이상을 포함해 다시 입력해주세요.\n" +
        '예: "내일 3시 A부서 아메리카노 2잔 8000원"'
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

type DeptLinkSheetState =
  | { open: false }
  | {
      open: true;
      inputText: string;
      candidates: DepartmentLinkCandidate[];
    };

function toNonEmpty(v: string | null | undefined): string | null {
  if (!v) return null;
  const t = v.trim();
  return t ? t : null;
}

function buildDeptCandidateTextFromRaw(raw: string) {
  let t = raw;

  // 날짜
  t = t
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, " ")
    .replace(/\b\d{1,2}[./]\d{1,2}\b/g, " ")
    .replace(/\b\d{1,2}\s*월\s*\d{1,2}\s*일\b/g, " ");

  // 시간(경계 문제로 시만 남는 케이스 방지: \b 제거)
  t = t
    .replace(/(?:^|[\s,])\d{1,2}\s*:\s*\d{2}(?=\s|,|$)/g, " ")
    .replace(/(?:^|[\s,])\d{1,2}\s*시(\s*\d{1,2}\s*분)?(?=\s|,|$)/g, " ")
    .replace(
      /(?:^|[\s,])(오전|오후)\s*\d{1,2}\s*시(\s*\d{1,2}\s*분)?(?=\s|,|$)/g,
      " "
    );

  // 금액
  t = t.replace(/\b\d{1,3}(?:,\d{3})+\s*원\b/g, " ");
  t = t.replace(/\b\d+\s*원\b/g, " ");

  // 수량
  t = t.replace(/\b\d+\s*(잔|개|명|건)\b/g, " ");

  // 총액 키워드
  t = t.replace(/(총액|합계|총\s*금액|총\s*계|총\s*[:：]?)/g, " ");

  // 구두점
  t = t.replace(/[(){}\[\]_.,:;'"“”‘’·\-]/g, " ");

  return t.replace(/\s+/g, " ").trim();
}

function firstToken(v: string): string {
  const t = v.trim();
  if (!t) return "";
  return t.split(/\s+/)[0] ?? "";
}

export function useAiAssistantModal() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [step, setStep] = useState<Step>("pickScope");
  const [scope, setScope] = useState<Scope | null>(null);

  const [input, setInput] = useState("");
  const [previewText, setPreviewText] = useState<string | null>(null);

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [intent, setIntent] = useState<ReservationIntent | null>(null);

  // ✅ Dept link sheet state (단일 타입으로 고정)
  const [deptLink, setDeptLink] = useState<DeptLinkSheetState>({ open: false });

  const resetAll = useCallback(() => {
    setStep("pickScope");
    setScope(null);
    setInput("");
    setPreviewText(null);
    setLoadingPreview(false);
    setErrorText(null);
    setIntent(null);
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
    setDeptLink({ open: false });
  }, []);

  const onRequestPreview = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || !scope) return;

    setErrorText(null);
    setPreviewText(null);
    setIntent(null);
    setDeptLink({ open: false });

    setLoadingPreview(true);

    try {
      // commit8: today는 클라이언트(KST) 기준
      const todayIso = getKstTodayIso();

      // commit8: 상대 날짜가 들어오면 클라에서 ISO로 확정
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
        setErrorText(toUserErrorMessage(out.error));
        return;
      }

      if (!isReservationIntent(out.data)) {
        setStep("input");
        setErrorText(
          scope === "ledger"
            ? "장부 관리는 아직 준비 중입니다. (예약관리만 가능)"
            : "AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요."
        );
        return;
      }

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

  const onEdit = useCallback(() => {
    setStep("input");
    setPreviewText(null);
    setErrorText(null);
    setIntent(null);
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

  /**
   * Confirm 버튼: "항상" 연동 여부 sheet를 띄우되,
   * - 후보가 있으면 후보 리스트 포함
   * - 후보가 없으면 candidates=[] 로 "연동 안 함/그대로" 선택만 하게(UX는 UI에서)
   *
   * 주의: open:false 케이스에 candidates를 두지 않아서 never[] 문제 원천 차단
   */
  const onConfirm = useCallback(async () => {
    if (!intent) return;

    try {
      const departments = await DepartmentsRepo.getDepartments();

      const depFromModel = toNonEmpty(intent.department);
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

        // confirm이 아니면(= linked/unlinked)이라도, "항상 띄우기" 정책이면 sheet는 띄워야 함
        setDeptLink({
          open: true,
          inputText: depFromModel,
          candidates: [],
        });
        return;
      }

      // department를 못 받았으면 raw_text에서 후보 시도
      const candidateText = buildDeptCandidateTextFromRaw(intent.raw_text);
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
      // 실패해도 시트는 띄우기(사용자가 unlink 선택 가능)
      setDeptLink({
        open: true,
        inputText: toNonEmpty(intent.department) ?? "",
        candidates: [],
      });
    }
  }, [intent]);

  const onCloseDeptLink = useCallback(() => {
    setDeptLink({ open: false });
  }, []);

  const onConfirmDeptLink = useCallback(
    (departmentId: string) => {
      if (!intent) return;
      setDeptLink({ open: false });
      pushToDay(intent, {
        departmentMode: "select",
        selectedDepartmentId: departmentId,
      });
    },
    [intent, pushToDay]
  );

  const onConfirmDeptUnlink = useCallback(() => {
    if (!intent) return;
    setDeptLink({ open: false });
    pushToDay(intent, { departmentMode: "direct" });
  }, [intent, pushToDay]);

  const copy = useMemo(() => {
    const subtitle =
      step === "pickScope"
        ? "업무를 선택한 뒤 명령하면, 확인 후 적용할 수 있어요."
        : step === "input"
        ? "입력 후 [등록]을 누르면 미리보기가 표시됩니다."
        : "미리보기 확인 후 [확인] 또는 [수정]을 선택하세요.";

    const inputPlaceholder =
      scope === "reservation"
        ? '예: "내일 3시 A부서 아메리카노 2잔 8000원"'
        : '예: "A부서 예치금 5만원 입금"';

    const helperText =
      scope === "reservation"
        ? '예: "내일 3시 B부서 라떼 2잔" / "다음주 수요일 A부서 아메 2잔 8000원"'
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
