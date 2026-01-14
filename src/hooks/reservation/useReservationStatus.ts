"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Reservation, SettlementType } from "@/lib/domain/reservation";
import type { Department } from "@/lib/storage/departments.local";
import { ReservationsRepo, DepartmentHistoryRepo } from "@/lib/data";
import { DAY_PAGE_COPY } from "@/constants/dayPage";

type ReservationEditForm = {
  departmentId: string; // "" => direct
  department: string; // direct text
  menu: string;
  location: string;
  time: string;
  amount: string;
};

type UseReservationStatusArgs = {
  date: string;
  list: Reservation[];
  setList: Dispatch<SetStateAction<Reservation[]>>;
  departments: Department[];
};

type CompleteOptions = {
  skipConfirm?: boolean;
};

function toSafeAmount(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return null;
  const out = Math.floor(n);
  return out > 0 ? out : null;
}

function findDeptName(departments: Department[], id: string) {
  return departments.find((d) => d.id === id)?.name ?? "";
}

export function useReservationStatus({
  date,
  list,
  setList,
  departments,
}: UseReservationStatusArgs) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ReservationEditForm | null>(null);

  const handleComplete = async (
    id: string,
    settleType?: SettlementType,
    options?: CompleteOptions
  ) => {
    const target = list.find((r) => r.id === id);
    if (!target) return;

    if (target.status === "completed") return;

    if (!options?.skipConfirm) {
      const ok = window.confirm(DAY_PAGE_COPY.alerts.confirmComplete);
      if (!ok) return;
    }

    try {
      const completed = await ReservationsRepo.completeReservation(date, id, {
        settleType: settleType ?? null,
      });

      if (!completed) {
        alert("완료 처리에 실패했어요. 잠시 후 다시 시도해주세요.");
        return;
      }

      setList((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "completed",
                settleType: completed.settleType ?? r.settleType ?? null,
                departmentId: completed.departmentId ?? r.departmentId ?? null,
              }
            : r
        )
      );

      const deptId = completed.departmentId ?? null;
      const appliedSettleType = completed.settleType ?? null;
      const amount = toSafeAmount(completed.amount);

      if (!deptId) return;
      if (!appliedSettleType) return;
      if (!amount) return;

      await DepartmentHistoryRepo.addReservationSettlementHistory({
        reservationId: completed.id,
        departmentId: deptId,
        settleType: appliedSettleType,
        amount,
        memo: `${completed.department} · ${completed.menu}`,
      });
    } catch (e) {
      console.error(e);
      alert("완료 처리에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleCancel = (id: string) => {
    const target = list.find((r) => r.id === id);
    if (!target) return;

    if (target.status === "completed") {
      alert("완료된 예약은 취소할 수 없어요.");
      return;
    }

    const ok = window.confirm(DAY_PAGE_COPY.alerts.confirmCancel);
    if (!ok) return;

    setList((prev) => prev.filter((r) => r.id !== id));
    void ReservationsRepo.deleteReservation(date, id);
  };

  const handleEdit = (id: string) => {
    const target = list.find((r) => r.id === id);
    if (!target) return;

    if (target.status === "completed") {
      alert("완료된 예약은 수정할 수 없어요.");
      return;
    }

    setEditingId(id);
    setEditForm({
      departmentId: target.departmentId ?? "",
      department: target.department ?? "",
      menu: target.menu ?? "",
      location: target.location ?? "",
      time: target.time ?? "",
      amount: target.amount != null ? String(target.amount) : "",
    });
  };

  const handleChangeEditField = (
    field: keyof ReservationEditForm,
    value: string
  ) => {
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmitEdit = () => {
    if (!editingId || !editForm) return;

    const target = list.find((r) => r.id === editingId);
    if (!target) {
      setEditingId(null);
      setEditForm(null);
      return;
    }

    if (target.status === "completed") {
      alert("완료된 예약은 수정할 수 없어요.");
      setEditingId(null);
      setEditForm(null);
      return;
    }

    const ok = window.confirm(DAY_PAGE_COPY.alerts.editConfirm);
    if (!ok) return;

    const isDirect = !editForm.departmentId;

    const resolvedDepartmentId = isDirect ? null : editForm.departmentId;
    const resolvedDepartmentName = isDirect
      ? editForm.department.trim()
      : findDeptName(departments, editForm.departmentId).trim();

    if (!resolvedDepartmentName || !editForm.menu.trim()) {
      alert(DAY_PAGE_COPY.alerts.requiredDepartmentAndMenu);
      return;
    }

    const updated: Reservation = {
      ...target,
      departmentId: resolvedDepartmentId,
      department: resolvedDepartmentName,
      menu: editForm.menu,
      location: editForm.location,
      time: editForm.time,
      amount: editForm.amount ? Number(editForm.amount) || 0 : 0,
    };

    setList((prev) => prev.map((r) => (r.id === editingId ? updated : r)));
    void ReservationsRepo.updateReservation(date, updated);

    setEditingId(null);
    setEditForm(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  return {
    handleComplete,
    handleCancel,
    handleEdit,
    editingId,
    editForm,
    handleChangeEditField,
    handleSubmitEdit,
    handleCancelEdit,
  };
}
