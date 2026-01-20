"use client";

import { useMemo, useState } from "react";
import type { Reservation } from "@/lib/domain/reservation";
import { ReservationsRepo } from "@/lib/data";
import { DAY_PAGE_COPY } from "@/constants/dayPage";
import type { DepartmentInputMode } from "@/components/ui/day/DayPage.types";
import { useDepartments } from "./internal/useDepartments";
import { resolveAddDepartment } from "./internal/resolveAddDepartment";
import {
  computeAutoAmount,
  digitsOnly,
  resolveDisplayAmount,
  resolveFinalAmountNumber,
  type AmountMode,
} from "./internal/amountCalc";

type UseReservationFormArgs = {
  date: string;
  onAdded: (reservation: Reservation) => void;
};

export function useReservationForm({ date, onAdded }: UseReservationFormArgs) {
  const [department, setDepartment] = useState("");
  const [departmentMode, setDepartmentMode] =
    useState<DepartmentInputMode>("select");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const { departments, departmentsLoading } = useDepartments();

  const [menu, setMenu] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [showForm, setShowForm] = useState(false);

  // UI only
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [amountMode, setAmountMode] = useState<AmountMode>("manual");
  const [manualAmount, setManualAmount] = useState("");

  const autoAmount = useMemo(
    () => computeAutoAmount(quantity, unitPrice),
    [quantity, unitPrice]
  );

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
    setMenu("");
    setTime("");
    setLocation("");
    setShowForm(false);

    setQuantity("");
    setUnitPrice("");
    setAmountMode("manual");
    setManualAmount("");
  };

  const handleAdd = async () => {
    const { resolvedDepartmentId, resolvedDepartmentName } =
      resolveAddDepartment({
        departmentMode,
        selectedDepartmentId,
        departmentText: department,
        departments,
      });

    if (!resolvedDepartmentName || !menu) {
      alert(DAY_PAGE_COPY.alerts.requiredDepartmentAndMenu);
      return;
    }

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

  const handleAmountChange = (value: string) => {
    if (amountMode !== "manual") return;
    setManualAmount(digitsOnly(value));
  };

  const handleChangeAmountMode = (mode: AmountMode) => {
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
    department,
    menu,
    amount,
    time,
    location,
    showForm,

    quantity,
    unitPrice,
    amountMode,

    setDepartment,
    setMenu,
    setTime,
    setLocation,

    onChangeQuantity: (v: string) => setQuantity(digitsOnly(v)),
    onChangeUnitPrice: (v: string) => setUnitPrice(digitsOnly(v)),
    onChangeAmountMode: handleChangeAmountMode,

    handleAmountChange,
    handleAddButtonClick,

    departmentMode,
    departments,
    selectedDepartmentId,
    departmentsLoading,
    setDepartmentMode: handleChangeDepartmentMode,
    setSelectedDepartmentId,

    selectedDepartment,
  };
}
