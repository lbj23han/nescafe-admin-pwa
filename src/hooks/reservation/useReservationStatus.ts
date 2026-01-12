"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Reservation } from "@/lib/domain/reservation";
import { ReservationsRepo } from "@/lib/data";
import { DAY_PAGE_COPY } from "@/constants/dayPage";

// 수정 폼 상태 타입
type ReservationEditForm = {
  department: string;
  menu: string;
  location: string;
  time: string;
  amount: string;
};

type UseReservationStatusArgs = {
  date: string;
  list: Reservation[];
  setList: Dispatch<SetStateAction<Reservation[]>>;
};

export function useReservationStatus({
  date,
  list,
  setList,
}: UseReservationStatusArgs) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ReservationEditForm | null>(null);

  const handleComplete = (id: string) => {
    const target = list.find((r) => r.id === id);
    if (!target) return;

    if (target.status === "completed") return;

    const ok = window.confirm(DAY_PAGE_COPY.alerts.confirmComplete);
    if (!ok) return;

    // NOTE(task5): department_id 연동 예약일 경우 완료 시 settleType(deposit|debt)을 반드시 받아야 함.
    // 지금은 UI가 없으므로 status만 completed 처리(= settle_type은 null일 수 있음).
    setList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "completed" } : r))
    );
    void ReservationsRepo.setReservationStatus(date, id, "completed");
  };

  const handleCancel = (id: string) => {
    const target = list.find((r) => r.id === id);
    if (!target) return;

    // 완료 후 수정/취소 금지 정책
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

    // 완료 후 수정 금지 정책
    if (target.status === "completed") {
      alert("완료된 예약은 수정할 수 없어요.");
      return;
    }

    setEditingId(id);
    setEditForm({
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

    // 완료 후 수정 금지 정책
    if (target.status === "completed") {
      alert("완료된 예약은 수정할 수 없어요.");
      setEditingId(null);
      setEditForm(null);
      return;
    }

    const ok = window.confirm(DAY_PAGE_COPY.alerts.editConfirm);
    if (!ok) return;

    const updated: Reservation = {
      ...target,
      department: editForm.department,
      menu: editForm.menu,
      location: editForm.location,
      time: editForm.time,
      amount: editForm.amount ? Number(editForm.amount) || 0 : 0,
    };

    setList((prev) => prev.map((r) => (r.id === editingId ? updated : r)));

    // supabase에서도 id 유지 (update)
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
