import type { AiIntent } from "../../types";
import { safePositiveInt } from "../../utils/number";

import type {
  DeptLinkSheetState,
  PushToDay,
  PushToDepartmentsPrefill,
} from "./confirm.types";

export function confirmDeptLink(args: {
  intent: AiIntent;
  departmentId: string;

  setDeptLink: (v: DeptLinkSheetState) => void;
  setNoticeText: (v: string | null) => void;

  pushToDay: PushToDay;
  pushToDepartmentsPrefill: PushToDepartmentsPrefill;
}) {
  const {
    intent,
    departmentId,
    setDeptLink,
    setNoticeText,
    pushToDay,
    pushToDepartmentsPrefill,
  } = args;

  setDeptLink({ open: false });

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

  if (intent.kind !== "reservation") return;

  pushToDay(intent, {
    departmentMode: "select",
    selectedDepartmentId: departmentId,
  });
}

export function confirmDeptUnlink(args: {
  intent: AiIntent;
  setDeptLink: (v: DeptLinkSheetState) => void;
  pushToDay: PushToDay;
}) {
  const { intent, setDeptLink, pushToDay } = args;
  if (intent.kind !== "reservation") return;

  setDeptLink({ open: false });
  pushToDay(intent, { departmentMode: "direct" });
}
