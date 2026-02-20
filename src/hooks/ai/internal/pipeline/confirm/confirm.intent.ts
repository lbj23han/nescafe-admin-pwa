import { DepartmentsRepo } from "@/lib/data";
import { resolveDepartmentLink } from "@/hooks/reservation/internal/departments/resolveDepartmentLink";

import type { AiIntent, ReservationIntent } from "../../types";
import { safePositiveInt } from "../../utils/number";
import {
  buildDeptCandidateTextFromRaw,
  firstToken,
  toNonEmpty,
} from "../../utils/departmentCandidate";

import type {
  DeptLinkSheetState,
  PushToDay,
  PushToDepartmentsPrefill,
} from "./confirm.types";

async function confirmLedgerIntent(args: {
  intent: Extract<AiIntent, { kind: "ledger" }>;
  setDeptLink: (v: DeptLinkSheetState) => void;
  setNoticeText: (v: string | null) => void;
  pushToDepartmentsPrefill: PushToDepartmentsPrefill;
}): Promise<void> {
  const { intent, setDeptLink, setNoticeText, pushToDepartmentsPrefill } = args;

  const depText = toNonEmpty(intent.department);
  if (!depText) {
    setNoticeText(
      "부서를 확인할 수 없어요. 부서명을 포함해서 다시 입력해주세요."
    );
    return;
  }

  // 정책: 입금/차감만
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

    const exact = departments.find((d) => d.name.trim() === depText.trim());
    if (exact) {
      pushToDepartmentsPrefill({
        departmentId: exact.id,
        type: intent.action === "deposit" ? "deposit" : "order",
        amount: amt,
      });
      return;
    }

    const link = resolveDepartmentLink({ inputText: depText, departments });

    if (link.kind === "confirm") {
      setDeptLink({
        open: true,
        inputText: link.inputText,
        candidates: link.candidates,
      });
      return;
    }

    setDeptLink({ open: true, inputText: depText, candidates: [] });
  } catch (e) {
    console.error(e);
    setNoticeText(
      "부서 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
    );
  }
}

async function confirmReservationIntent(args: {
  intent: ReservationIntent;
  setDeptLink: (v: DeptLinkSheetState) => void;
}): Promise<void> {
  const { intent, setDeptLink } = args;

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

      setDeptLink({ open: true, inputText: depFromModel, candidates: [] });
      return;
    }

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

      setDeptLink({ open: true, inputText: first, candidates: [] });
      return;
    }

    setDeptLink({ open: true, inputText: "", candidates: [] });
  } catch (e) {
    console.error(e);
    setDeptLink({
      open: true,
      inputText: toNonEmpty(intent.department) ?? "",
      candidates: [],
    });
  }
}

export async function confirmAiIntent(args: {
  intent: AiIntent;

  setDeptLink: (v: DeptLinkSheetState) => void;
  setNoticeText: (v: string | null) => void;

  pushToDay: PushToDay;
  pushToDepartmentsPrefill: PushToDepartmentsPrefill;
}): Promise<void> {
  const {
    intent,
    setDeptLink,
    setNoticeText,
    //pushToDay,
    pushToDepartmentsPrefill,
  } = args;

  if (intent.kind === "ledger") {
    await confirmLedgerIntent({
      intent,
      setDeptLink,
      setNoticeText,
      pushToDepartmentsPrefill,
    });
    return;
  }

  await confirmReservationIntent({
    intent,
    setDeptLink,
  });
}
