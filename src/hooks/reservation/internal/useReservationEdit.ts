"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Reservation } from "@/lib/domain/reservation";
import type { Department } from "@/lib/storage/departments.local";
import { ReservationsRepo } from "@/lib/data";
import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { resolveDepartment } from "./reservationDept";

export type ReservationEditForm = {
  departmentId: string; // "" => direct
  department: string;
  menu: string;
  location: string;
  time: string;
  amount: string;
};

type Args = {
  date: string;
  list: Reservation[];
  setList: Dispatch<SetStateAction<Reservation[]>>;
  departments: Department[];
};

export function useReservationEdit({ date, list, setList, departments }: Args) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ReservationEditForm | null>(null);

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
    if (!target) return;

    const ok = window.confirm(DAY_PAGE_COPY.alerts.editConfirm);
    if (!ok) return;

    const { resolvedDepartmentId, resolvedDepartmentName } = resolveDepartment(
      departments,
      editForm
    );

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
    editingId,
    editForm,
    handleEdit,
    handleChangeEditField,
    handleSubmitEdit,
    handleCancelEdit,
  };
}
