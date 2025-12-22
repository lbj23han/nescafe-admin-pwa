"use client";

import { useEffect, useMemo, useState } from "react";
import { DAY_PAGE_COPY } from "@/constants/dayPage";
import type { Reservation } from "@/lib/domain/reservation";
import { ReservationsRepo } from "@/lib/data";
import { useReservationForm } from "./useReservationForm";
import { useReservationStatus } from "./useReservationStatus";

export function useDayReservation(date: string) {
  const [list, setList] = useState<Reservation[]>([]);

  // local/supabase 공통 로드
  useEffect(() => {
    if (!date) return;
    let alive = true;

    (async () => {
      try {
        const items = await ReservationsRepo.loadReservationsByDate(date);
        if (alive) setList(items);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [date]);

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
