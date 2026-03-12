import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import type { ReservationIntent } from "../types";
import {
  buildDayReservationPrefillQuery,
  toQueryString,
} from "../prefill/prefill";

export function navigateToDayReservation(args: {
  router: AppRouterInstance;
  intent: ReservationIntent;
  extra?: {
    departmentMode?: "select" | "direct";
    selectedDepartmentId?: string;
  };
}) {
  const { router, intent, extra } = args;

  const query = buildDayReservationPrefillQuery(intent, extra);
  const qs = toQueryString(query);

  router.push(`/day/${intent.date}${qs}`);
}

export function navigateToDepartmentsPrefill(args: {
  router: AppRouterInstance;
  departmentId: string;
  type: "deposit" | "order";
  amount: number;
}) {
  const { router, departmentId, type, amount } = args;

  const qs =
    `?ai=1` +
    `&deptId=${encodeURIComponent(departmentId)}` +
    `&type=${encodeURIComponent(type)}` +
    `&amount=${encodeURIComponent(String(amount))}`;

  router.push(`/departments${qs}`);
}
