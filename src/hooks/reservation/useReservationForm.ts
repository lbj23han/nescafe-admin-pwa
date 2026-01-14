"use client";

import { useMemo, useState } from "react";
import type { Reservation } from "@/lib/domain/reservation";
import { ReservationsRepo } from "@/lib/data";
import { DAY_PAGE_COPY } from "@/constants/dayPage";
import type { DepartmentInputMode } from "@/components/ui/day/DayPage.types";
import { useDepartments } from "./internal/useDepartments";
import { resolveAddDepartment } from "./internal/resolveAddDepartment";

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
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [showForm, setShowForm] = useState(false);

  const selectedDepartment = useMemo(() => {
    if (!selectedDepartmentId) return null;
    return departments.find((d) => d.id === selectedDepartmentId) ?? null;
  }, [departments, selectedDepartmentId]);

  const handleAmountChange = (value: string) => {
    setAmount(value.replace(/\D/g, ""));
  };

  const resetForm = () => {
    setDepartment("");
    setDepartmentMode("select");
    setSelectedDepartmentId("");
    setMenu("");
    setAmount("");
    setTime("");
    setLocation("");
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
      amount: amount ? Number(amount) || 0 : 0,
      time,
      location,
      status: "pending",
    };

    try {
      const saved = await ReservationsRepo.saveReservation(date, draft);
      onAdded(saved);
      resetForm();
      setShowForm(false);
    } catch (e) {
      console.error(e);
      alert("저장에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleAddButtonClick = () => {
    if (!showForm) {
      setShowForm(true);
      return;
    }
    void handleAdd();
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

    setDepartment,
    setMenu,
    setTime,
    setLocation,
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
