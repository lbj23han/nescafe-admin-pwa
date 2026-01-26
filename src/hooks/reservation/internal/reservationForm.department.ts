"use client";

import { useMemo, useState } from "react";
import type { DepartmentInputMode } from "@/components/ui/day/DayPage.types";
import { useDepartments } from "./useDepartments";

export function useReservationFormDepartment() {
  const [department, setDepartment] = useState("");
  const [departmentMode, setDepartmentMode] =
    useState<DepartmentInputMode>("select");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const { departments, departmentsLoading } = useDepartments();

  const selectedDepartment = useMemo(() => {
    if (!selectedDepartmentId) return null;
    return departments.find((d) => d.id === selectedDepartmentId) ?? null;
  }, [departments, selectedDepartmentId]);

  const handleChangeDepartmentMode = (mode: DepartmentInputMode) => {
    setDepartmentMode(mode);
    if (mode === "direct") setSelectedDepartmentId("");
    else setDepartment("");
  };

  const resetDepartment = () => {
    setDepartment("");
    setDepartmentMode("select");
    setSelectedDepartmentId("");
  };

  return {
    department,
    departmentMode,
    selectedDepartmentId,
    departments,
    departmentsLoading,
    selectedDepartment,

    setDepartment,
    setSelectedDepartmentId,
    setDepartmentMode: handleChangeDepartmentMode,

    resetDepartment,
  };
}
