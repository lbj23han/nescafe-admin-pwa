"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Reservation, SettlementType } from "@/lib/domain/reservation";
import { ReservationsRepo, DepartmentHistoryRepo } from "@/lib/data";
import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { toSafeAmount } from "./toSafeAmount";

type Args = {
  date: string;
  list: Reservation[];
  setList: Dispatch<SetStateAction<Reservation[]>>;
};

type CompleteOptions = {
  skipConfirm?: boolean;
};

export function useReservationActions({ date, list, setList }: Args) {
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

      if (!deptId || !appliedSettleType || !amount) return;

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

  return { handleComplete, handleCancel };
}
