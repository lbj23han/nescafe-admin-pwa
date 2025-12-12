// hooks/reservation/useReservationStatus.ts
"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Reservation } from "@/lib/storage";
import { setReservationStatus, deleteReservation } from "@/lib/storage";
import { DAY_PAGE_COPY } from "@/constants/dayPage";

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

  const handleCancel = (id: string) => {
    const ok = window.confirm(DAY_PAGE_COPY.alerts.confirmCancel);
    if (!ok) return;

    setList((prev) => {
      const next: Reservation[] = prev.filter((r) => r.id !== id);
      deleteReservation(date, id);
      return next;
    });
  };

  return {
    handleComplete,
    handleCancel,
  };
}
