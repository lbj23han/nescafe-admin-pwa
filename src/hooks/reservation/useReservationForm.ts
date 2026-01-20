"use client";

import { useMemo, useState } from "react";
import type { Reservation } from "@/lib/domain/reservation";
import { ReservationsRepo } from "@/lib/data";
import { DAY_PAGE_COPY } from "@/constants/dayPage";
import type { DepartmentInputMode } from "@/components/ui/day/DayPage.types";
import { useDepartments } from "./internal/useDepartments";
import { resolveAddDepartment } from "./internal/resolveAddDepartment";
import {
  digitsOnly,
  serializeItemsToMenu,
  type ReservationItem,
} from "./internal/reservationItems";
import {
  resolveDisplayAmount,
  resolveFinalAmountNumber,
  type AmountMode,
} from "./internal/amountCalc";

type UseReservationFormArgs = {
  date: string;
  onAdded: (reservation: Reservation) => void;
};

type ItemWithId = ReservationItem & { id: string };

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createEmptyItem(): ItemWithId {
  return {
    id: createId(),
    menu: "",
    quantity: "",
    unitPrice: "",
  };
}

function computeItemsAutoAmount(items: ItemWithId[]): string {
  // amountCalc가 string 기반을 기대하는 구조라 string으로 반환
  let total = 0;
  for (const it of items) {
    const q = Number(digitsOnly(it.quantity || "0")) || 0;
    const p = Number(digitsOnly(it.unitPrice || "0")) || 0;
    total += q * p;
  }
  return total > 0 ? String(total) : "";
}

export function useReservationForm({ date, onAdded }: UseReservationFormArgs) {
  const [department, setDepartment] = useState("");
  const [departmentMode, setDepartmentMode] =
    useState<DepartmentInputMode>("select");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const { departments, departmentsLoading } = useDepartments();

  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [items, setItems] = useState<ItemWithId[]>([createEmptyItem()]);
  const [amountMode, setAmountMode] = useState<AmountMode>("auto");
  const [manualAmount, setManualAmount] = useState("");

  const autoAmount = useMemo(() => computeItemsAutoAmount(items), [items]);

  const amount = useMemo(
    () =>
      resolveDisplayAmount({
        mode: amountMode,
        autoAmount,
        manualAmount,
      }),
    [amountMode, autoAmount, manualAmount]
  );

  const selectedDepartment = useMemo(() => {
    if (!selectedDepartmentId) return null;
    return departments.find((d) => d.id === selectedDepartmentId) ?? null;
  }, [departments, selectedDepartmentId]);

  const resetForm = () => {
    setDepartment("");
    setDepartmentMode("select");
    setSelectedDepartmentId("");
    setTime("");
    setLocation("");
    setShowForm(false);

    setItems([createEmptyItem()]);
    setAmountMode("auto");
    setManualAmount("");
  };

  const onAddItem = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  const onRemoveItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      return next.length > 0 ? next : [createEmptyItem()];
    });
  };

  const onChangeItemField = (
    id: string,
    field: "menu" | "quantity" | "unitPrice",
    value: string
  ) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        if (field === "menu") return { ...it, menu: value };
        if (field === "quantity") return { ...it, quantity: digitsOnly(value) };
        return { ...it, unitPrice: digitsOnly(value) };
      })
    );
  };

  const handleAdd = async () => {
    const { resolvedDepartmentId, resolvedDepartmentName } =
      resolveAddDepartment({
        departmentMode,
        selectedDepartmentId,
        departmentText: department,
        departments,
      });

    const hasMenu = items.some((it) => it.menu.trim().length > 0);
    if (!resolvedDepartmentName || !hasMenu) {
      alert(DAY_PAGE_COPY.alerts.requiredDepartmentAndMenu);
      return;
    }

    const menu = serializeItemsToMenu(items);

    const draft: Reservation = {
      id: `${Date.now()}`,
      departmentId: resolvedDepartmentId,
      department: resolvedDepartmentName,
      menu,
      amount: resolveFinalAmountNumber({
        mode: amountMode,
        autoAmount,
        manualAmount,
      }),
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
    if (!showForm) return void setShowForm(true);
    void handleAdd();
  };

  const onChangeAmount = (value: string) => {
    if (amountMode !== "manual") return;
    setManualAmount(digitsOnly(value));
  };

  const onChangeAmountMode = (mode: AmountMode) => {
    setAmountMode(mode);
    if (mode === "manual" && !manualAmount && autoAmount) {
      setManualAmount(autoAmount);
    }
  };

  const handleChangeDepartmentMode = (mode: DepartmentInputMode) => {
    setDepartmentMode(mode);
    if (mode === "direct") setSelectedDepartmentId("");
    else setDepartment("");
  };

  return {
    // values
    department,
    location,
    time,
    amount,
    amountMode,
    showForm,

    // items props
    items,
    onAddItem,
    onRemoveItem,
    onChangeItemField,

    // setters (기존 컨벤션 유지)
    setDepartment,
    setTime,
    setLocation,

    // handlers (ReservationFormProps 맞춤)
    onChangeDepartment: setDepartment,
    onChangeLocation: setLocation,
    onChangeTime: setTime,
    onChangeAmount,
    onChangeAmountMode,

    // add
    handleAddButtonClick,

    // department select/direct
    departmentMode,
    departments,
    selectedDepartmentId,
    departmentsLoading,
    setDepartmentMode: handleChangeDepartmentMode,
    setSelectedDepartmentId,

    selectedDepartment,
  };
}
