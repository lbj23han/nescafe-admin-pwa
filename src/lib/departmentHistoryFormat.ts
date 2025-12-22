import type {
  DepartmentHistory,
  HistoryType,
} from "./storage/departments.local";
import { DEPARTMENT_HISTORY_LABEL } from "@/constants/departments/card";

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

export function isPositiveHistory(h: DepartmentHistory): boolean {
  return h.type === "deposit" || h.type === "debtPayment";
}

export function formatHistoryAmount(h: DepartmentHistory): string {
  const sign = isPositiveHistory(h) ? "+" : "-";
  return `${sign}${h.amount.toLocaleString()}원`;
}
