"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Reservation, SettlementType } from "@/lib/domain/reservation";
import { ReservationsRepo, DepartmentHistoryRepo } from "@/lib/data";
import { DAY_PAGE_COPY } from "@/constants/dayPage";

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

type CompleteOptions = {
  skipConfirm?: boolean;
};

function toSafeAmount(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return null;
  const out = Math.floor(n);
  return out > 0 ? out : null;
}

export function useReservationStatus({
  date,
  list,
  setList,
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
      // 완료 처리(서버/로컬 저장) + settleType 전달
      const completed = await ReservationsRepo.completeReservation(date, id, {
        settleType: settleType ?? null,
      });

      if (!completed) {
        alert("완료 처리에 실패했어요. 잠시 후 다시 시도해주세요.");
        return;
      }

      // UI 반영 (status + settleType + departmentId 동기화)
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

      // 장부 반영 조건(연동 예약만)
      const deptId = completed.departmentId ?? null;
      const appliedSettleType = completed.settleType ?? null;
      const amount = toSafeAmount(completed.amount);

      if (!deptId) return; // 비연동(직접입력)
      if (!appliedSettleType) return; // 연동 예약인데 settleType이 없으면 반영하지 않음
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

    const updated: Reservation = {
      ...target,
      department: editForm.department,
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
