"use client";

import { useEffect, useMemo, useState } from "react";
import type { Reservation } from "@/lib/domain/reservation";
import { DepartmentsRepo, ReservationsRepo } from "@/lib/data";
import { DAY_PAGE_COPY } from "@/constants/dayPage";
import type { Department } from "@/lib/storage/departments.local";
import type { DepartmentInputMode } from "@/components/ui/day/DayPage.types";

type UseReservationFormArgs = {
  date: string;
  onAdded: (reservation: Reservation) => void;
};

export function useReservationForm({ date, onAdded }: UseReservationFormArgs) {
  // direct input 텍스트
  const [department, setDepartment] = useState("");

  // 모드 + 선택값
  const [departmentMode, setDepartmentMode] =
    useState<DepartmentInputMode>("select");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  // 부서 목록
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  const [menu, setMenu] = useState("");
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [showForm, setShowForm] = useState(false);

  // 선택된 부서 객체
  const selectedDepartment = useMemo(() => {
    if (!selectedDepartmentId) return null;
    return departments.find((d) => d.id === selectedDepartmentId) ?? null;
  }, [departments, selectedDepartmentId]);

  // 폼이 열릴 때 부서 목록 로드
  useEffect(() => {
    if (!showForm) return;

    let alive = true;
    setDepartmentsLoading(true);

    (async () => {
      try {
        const items = await DepartmentsRepo.getDepartments();
        if (!alive) return;
        setDepartments(items);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setDepartments([]);
      } finally {
        if (alive) setDepartmentsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [showForm]);

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
    // 부서 값 확정 (연동/비연동)
    const isDirect = departmentMode === "direct";

    const resolvedDepartmentName = isDirect
      ? department.trim()
      : (selectedDepartment?.name ?? "").trim();

    const resolvedDepartmentId = isDirect
      ? null
      : selectedDepartment?.id ?? null;

    if (!resolvedDepartmentName || !menu) {
      alert(DAY_PAGE_COPY.alerts.requiredDepartmentAndMenu);
      return;
    }

    // draft 생성: departmentId/department 스냅샷 세팅
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

  // 모드 변경 시 상태 정리
  const handleChangeDepartmentMode = (mode: DepartmentInputMode) => {
    setDepartmentMode(mode);
    if (mode === "direct") {
      setSelectedDepartmentId("");
    } else {
      setDepartment("");
    }
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
  };
}
