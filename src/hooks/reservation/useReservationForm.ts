"use client";

import { useState } from "react";
import type { Reservation } from "@/lib/domain/reservation";
import { ReservationsRepo } from "@/lib/data";
import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { resolveAddDepartment } from "./internal/resolveAddDepartment";
import { serializeItemsToMenu } from "./internal/reservationItems";
import { resolveFinalAmountNumber } from "./internal/amountCalc";
import { useReservationFormItems } from "./internal/reservationForm.items";
import { useReservationFormAmount } from "./internal/reservationForm.amount";
import { useReservationFormDepartment } from "./internal/reservationForm.department";
import { resolveReservationFormIntent } from "./internal/reservationForm.intent";

type UseReservationFormArgs = {
  date: string;
  onAdded: (reservation: Reservation) => void;
};

export function useReservationForm({ date, onAdded }: UseReservationFormArgs) {
  const dept = useReservationFormDepartment();
  const itemsState = useReservationFormItems();
  const amountState = useReservationFormAmount(itemsState.items);

  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [showForm, setShowForm] = useState(false);

  const addButtonIntent = resolveReservationFormIntent({
    showForm,
    departmentMode: dept.departmentMode,
    selectedDepartmentId: dept.selectedDepartmentId,
    department: dept.department,
    time,
    location,
    items: itemsState.items,
    amountMode: amountState.amountMode,
    manualAmount: amountState.manualAmount,
  });

  const resetForm = () => {
    dept.resetDepartment();
    itemsState.resetItems();
    amountState.resetAmount();
    setTime("");
    setLocation("");
    setShowForm(false);
  };

  const handleAdd = async () => {
    const { resolvedDepartmentId, resolvedDepartmentName } =
      resolveAddDepartment({
        departmentMode: dept.departmentMode,
        selectedDepartmentId: dept.selectedDepartmentId,
        departmentText: dept.department,
        departments: dept.departments,
      });

    const hasMenu = itemsState.items.some((it) => it.menu.trim().length > 0);
    if (!resolvedDepartmentName || !hasMenu) {
      alert(DAY_PAGE_COPY.alerts.requiredDepartmentAndMenu);
      return;
    }

    const menu = serializeItemsToMenu(itemsState.items);
    const amount = resolveFinalAmountNumber({
      mode: amountState.amountMode,
      autoAmount: amountState.autoAmount,
      manualAmount: amountState.manualAmount,
    });

    const draft: Reservation = {
      id: `${Date.now()}`,
      departmentId: resolvedDepartmentId,
      department: resolvedDepartmentName,
      menu,
      amount,
      time,
      location,
      status: "pending",
    };

    try {
      const saved = await ReservationsRepo.saveReservation(date, draft);
      onAdded(saved);
      resetForm();
    } catch (e) {
      console.error(e);
      alert("저장에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleAddButtonClick = () => {
    if (addButtonIntent === "open") return void setShowForm(true);
    if (addButtonIntent === "close") return void setShowForm(false);
    void handleAdd();
  };

  return {
    department: dept.department,
    departmentMode: dept.departmentMode,
    selectedDepartmentId: dept.selectedDepartmentId,
    departments: dept.departments,
    departmentsLoading: dept.departmentsLoading,
    selectedDepartment: dept.selectedDepartment,
    setDepartment: dept.setDepartment,
    setSelectedDepartmentId: dept.setSelectedDepartmentId,
    setDepartmentMode: dept.setDepartmentMode,

    items: itemsState.items,
    onAddItem: itemsState.onAddItem,
    onRemoveItem: itemsState.onRemoveItem,
    onChangeItemField: itemsState.onChangeItemField,

    time,
    location,
    setTime,
    setLocation,
    onChangeDepartment: dept.setDepartment,
    onChangeLocation: setLocation,
    onChangeTime: setTime,

    amount: amountState.amount,
    amountMode: amountState.amountMode,
    onChangeAmount: amountState.onChangeAmount,
    onChangeAmountMode: amountState.onChangeAmountMode,

    showForm,
    addButtonIntent,
    handleAddButtonClick,
  };
}
