"use client";

import type {
  AddButtonIntent,
  DepartmentInputMode,
} from "@/components/ui/day/DayPage.types";
import type { AmountMode } from "./amountCalc";
import { digitsOnly } from "./reservationItems";
import type { ReservationItemWithId } from "./reservationForm.items";

type Args = {
  showForm: boolean;

  departmentMode: DepartmentInputMode;
  selectedDepartmentId: string;
  department: string;

  time: string;
  location: string;

  items: ReservationItemWithId[];

  amountMode: AmountMode;
  manualAmount: string;
};

function hasAnyDraftInput(args: Omit<Args, "showForm">) {
  const dep =
    args.departmentMode === "select"
      ? args.selectedDepartmentId.trim()
      : args.department.trim();

  return (
    dep.length > 0 ||
    args.time.trim().length > 0 ||
    args.location.trim().length > 0 ||
    args.items.some(
      (it) =>
        it.menu.trim().length > 0 ||
        digitsOnly(it.quantity || "").length > 0 ||
        digitsOnly(it.unitPrice || "").length > 0
    ) ||
    (args.amountMode === "manual" &&
      digitsOnly(args.manualAmount || "").length > 0)
  );
}

export function resolveReservationFormIntent(args: Args): AddButtonIntent {
  if (!args.showForm) return "open";

  const hasInput = hasAnyDraftInput({
    departmentMode: args.departmentMode,
    selectedDepartmentId: args.selectedDepartmentId,
    department: args.department,
    time: args.time,
    location: args.location,
    items: args.items,
    amountMode: args.amountMode,
    manualAmount: args.manualAmount,
  });

  return hasInput ? "submit" : "close";
}
