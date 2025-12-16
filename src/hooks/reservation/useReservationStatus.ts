// hooks/reservation/useReservationStatus.ts
"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Reservation } from "@/lib/storage";
import {
  saveReservation,
  setReservationStatus,
  deleteReservation,
} from "@/lib/storage";
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
  list: Reservation[]; // 현재 예약 리스트(렌더링용)
  setList: Dispatch<SetStateAction<Reservation[]>>; // 리스트 상태 업데이트
};

export function useReservationStatus({
  date,
  list,
  setList,
}: UseReservationStatusArgs) {
  //  수정 모드 관련 상태
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ReservationEditForm | null>(null);

  // 완료 처리
  const handleComplete = (id: string) => {
    const ok = window.confirm(DAY_PAGE_COPY.alerts.confirmComplete);
    if (!ok) return;

    setList((prev) => {
      const next: Reservation[] = prev.map((r) =>
        r.id === id ? { ...r, status: "completed" } : r
      );
      setReservationStatus(date, id, "completed");
      return next;
    });
  };

  // 삭제(취소)
  const handleCancel = (id: string) => {
    const ok = window.confirm(DAY_PAGE_COPY.alerts.confirmCancel);
    if (!ok) return;

    setList((prev) => {
      const next: Reservation[] = prev.filter((r) => r.id !== id);
      deleteReservation(date, id);
      return next;
    });
  };

  // ✅ 수정 버튼 클릭
  const handleEdit = (id: string) => {
    const target = list.find((r) => r.id === id);
    if (!target) return;

    setEditingId(id);
    setEditForm({
      department: target.department ?? "",
      menu: target.menu ?? "",
      location: target.location ?? "",
      time: target.time ?? "",
      amount: target.amount != null ? String(target.amount) : "",
    });
  };

  //  수정 폼 입력 핸들러
  const handleChangeEditField = (
    field: keyof ReservationEditForm,
    value: string
  ) => {
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  //  수정 완료
  const handleSubmitEdit = () => {
    if (!editingId || !editForm) return;

    const ok = window.confirm(DAY_PAGE_COPY.alerts.editConfirm);
    if (!ok) return;

    const target = list.find((r) => r.id === editingId);
    if (!target) {
      setEditingId(null);
      setEditForm(null);
      return;
    }

    const updated: Reservation = {
      ...target,
      department: editForm.department,
      menu: editForm.menu,
      location: editForm.location,
      time: editForm.time,
      amount: editForm.amount ? Number(editForm.amount) || 0 : 0,
    };

    // 상태 업데이트
    setList((prev) => prev.map((r) => (r.id === editingId ? updated : r)));

    // 로컬스토리지에도 반영
    deleteReservation(date, editingId);
    saveReservation(date, updated);

    setEditingId(null);
    setEditForm(null);
  };

  // ✅ 수정 취소
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  return {
    // 기존 기능
    handleComplete,
    handleCancel,
    // 새로 추가된 수정 관련
    handleEdit,
    editingId,
    editForm,
    handleChangeEditField,
    handleSubmitEdit,
    handleCancelEdit,
  };
}
