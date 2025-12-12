// hooks/reservation/useDayReservation.ts
"use client";

import { useMemo, useState } from "react";
import { loadReservationsByDate, type Reservation } from "@/lib/storage";
import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { useReservationForm } from "./useReservationForm";
import { useReservationStatus } from "./useReservationStatus";

export function useDayReservation(date: string) {
  const [list, setList] = useState<Reservation[]>(() =>
    date ? loadReservationsByDate(date) : []
  );

  const formattedDate = useMemo(() => {
    const [y, m, d] = date.split("-");
    return DAY_PAGE_COPY.dateFormat(m, d);
  }, [date]);

  const form = useReservationForm({
    date,
    onAdded: (reservation) => setList((prev) => [...prev, reservation]),
  });

  const statusActions = useReservationStatus({
    date,
    list,
    setList,
  });

  return {
    list,
    formattedDate,
    ...form,
    ...statusActions,
  };
}
