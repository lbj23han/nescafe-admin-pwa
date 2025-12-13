import type { DepartmentHistory, HistoryType } from "./departmentStorage";
import { DEPARTMENT_HISTORY_LABEL } from "@/constants/department";

export function formatHistoryType(type: HistoryType): string {
  return DEPARTMENT_HISTORY_LABEL[type];
}

export function formatHistoryDate(date: string): string {
  try {
    return new Date(date).toLocaleString("ko-KR");
  } catch {
    return date;
  }
}

export function formatHistoryAmount(h: DepartmentHistory): string {
  const sign = h.type === "deposit" ? "+" : "-";
  return `${sign}${h.amount.toLocaleString()}원`;
}

export function isPositiveHistory(h: DepartmentHistory): boolean {
  return h.type === "deposit" || h.type === "debtPayment";
}
