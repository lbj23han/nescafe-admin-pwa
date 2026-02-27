import type { DepartmentLinkCandidate } from "@/hooks/reservation/internal/departments/resolveDepartmentLink";
import type { ReservationIntent } from "../../types";

export type DeptLinkSheetState =
  | { open: false }
  | { open: true; inputText: string; candidates: DepartmentLinkCandidate[] };

export type PushToDay = (
  it: ReservationIntent,
  extra?: {
    departmentMode?: "select" | "direct";
    selectedDepartmentId?: string;
  }
) => void;

export type PushToDepartmentsPrefill = (args: {
  departmentId: string;
  type: "deposit" | "order";
  amount: number;
}) => void;
