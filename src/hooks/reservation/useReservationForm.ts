"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { Reservation } from "@/lib/domain/reservation";
import { ReservationsRepo } from "@/lib/data";
import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { resolveAddDepartment } from "./internal/departments/resolveAddDepartment";
import { serializeItemsToMenu } from "./internal/domain/reservationItems";
import { resolveFinalAmountNumber } from "./internal/domain/amountCalc";
import {
  useReservationFormItems,
  type PrefillFormItem,
} from "./internal/form/reservationForm.items";
import { useReservationFormAmount } from "./internal/form/reservationForm.amount";
import { useReservationFormDepartment } from "./internal/form/reservationForm.department";
import { resolveReservationFormIntent } from "./internal/form/reservationForm.intent";

export type ReservationFormAiPrefill = {
  items: PrefillFormItem[] | null; // 복수 아이템
  department: string | null;
  time: string | null;
  location: string | null;
  amount: string | null; // digits only string (총액)
  memo: string | null; // 현재 폼에 memo 필드 없음
};

type UseReservationFormArgs = {
  date: string;
  onAdded: (reservation: Reservation) => void;
};

function toNonEmpty(v: string | null): string | null {
  if (!v) return null;
  const t = v.trim();
  return t ? t : null;
}

function digitsOnly(v: string | null): string | null {
  if (!v) return null;
  const out = v.replace(/[^\d]/g, "");
  return out ? out : null;
}

function normalizePrefillItems(
  items: PrefillFormItem[] | null
): PrefillFormItem[] | null {
  if (!items || items.length === 0) return null;

  const cleaned = items
    .map((it) => ({
      menu: (it.menu ?? "").trim(),
      quantity: (it.quantity ?? "").toString(),
      unitPrice: (it.unitPrice ?? "").toString(),
    }))
    .filter((it) => it.menu.length > 0);

  return cleaned.length > 0 ? cleaned : null;
}

export function useReservationForm({ date, onAdded }: UseReservationFormArgs) {
  const dept = useReservationFormDepartment();
  const itemsState = useReservationFormItems();
  const amountState = useReservationFormAmount(itemsState.items);

  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [showForm, setShowForm] = useState(false);

  const lastPrefillKeyRef = useRef<string | null>(null);

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

  const resetForm = useCallback(() => {
    dept.resetDepartment();
    itemsState.resetItems();
    amountState.resetAmount();
    setTime("");
    setLocation("");
    setShowForm(false);
    lastPrefillKeyRef.current = null;
  }, [amountState, dept, itemsState]);

  const handleAdd = useCallback(async () => {
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
  }, [
    amountState.amountMode,
    amountState.autoAmount,
    amountState.manualAmount,
    date,
    dept.department,
    dept.departmentMode,
    dept.departments,
    dept.selectedDepartmentId,
    itemsState.items,
    location,
    onAdded,
    resetForm,
    time,
  ]);

  const handleAddButtonClick = useCallback(() => {
    if (addButtonIntent === "open") return void setShowForm(true);
    if (addButtonIntent === "close") return void setShowForm(false);
    void handleAdd();
  }, [addButtonIntent, handleAdd]);

  const openForm = useCallback(() => {
    setShowForm(true);
  }, []);

  const applyAiPrefill = useCallback(
    (prefill: ReservationFormAiPrefill) => {
      const dep = toNonEmpty(prefill.department);
      const t = toNonEmpty(prefill.time);
      const loc = toNonEmpty(prefill.location);
      const amt = digitsOnly(prefill.amount);
      const items = normalizePrefillItems(prefill.items);

      const key = [
        dep ?? "",
        t ?? "",
        loc ?? "",
        amt ?? "",
        items ? JSON.stringify(items) : "",
      ]
        .join("|")
        .trim();

      if (!key) return;
      if (lastPrefillKeyRef.current === key) return;
      lastPrefillKeyRef.current = key;

      if (dep) {
        dept.setDepartmentMode("direct");
        dept.setDepartment(dep);
      }
      if (t) setTime(t);
      if (loc) setLocation(loc);

      if (items) {
        itemsState.applyPrefillItems(items);
      }

      if (amt) {
        // manual 모드 전환 + 값 주입(원자적)
        // (총액 자동확정 금지 정책: amount가 들어온 경우만 manual로 고정)
        amountState.applyManualAmount(amt);
      }

      // memo는 아직 폼에 필드 없음(Commit 6 범위 밖)
    },
    [amountState, dept, itemsState]
  );

  return useMemo(
    () => ({
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

      openForm,
      applyAiPrefill,
    }),
    [
      dept.department,
      dept.departmentMode,
      dept.selectedDepartmentId,
      dept.departments,
      dept.departmentsLoading,
      dept.selectedDepartment,
      dept.setDepartment,
      dept.setSelectedDepartmentId,
      dept.setDepartmentMode,

      itemsState.items,
      itemsState.onAddItem,
      itemsState.onRemoveItem,
      itemsState.onChangeItemField,

      time,
      location,

      amountState.amount,
      amountState.amountMode,
      amountState.onChangeAmount,
      amountState.onChangeAmountMode,

      showForm,
      addButtonIntent,
      handleAddButtonClick,
      openForm,
      applyAiPrefill,
    ]
  );
}
