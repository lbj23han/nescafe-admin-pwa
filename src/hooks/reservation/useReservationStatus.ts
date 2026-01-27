"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Reservation, SettlementType } from "@/lib/domain/reservation";
import type { Department } from "@/lib/storage/departments.local";
import { useReservationActions } from "./internal/actions/useReservationActions";
import { useReservationEdit } from "./internal/actions/useReservationEdit";

type UseReservationStatusArgs = {
  date: string;
  list: Reservation[];
  setList: Dispatch<SetStateAction<Reservation[]>>;
  departments: Department[];
};

type CompleteOptions = {
  skipConfirm?: boolean;
};

export function useReservationStatus({
  date,
  list,
  setList,
  departments,
}: UseReservationStatusArgs) {
  const { handleComplete, handleCancel } = useReservationActions({
    date,
    list,
    setList,
  });

  const {
    editingId,
    editForm,
    handleEdit,
    handleChangeEditField,
    handleSubmitEdit,
    handleCancelEdit,
  } = useReservationEdit({ date, list, setList, departments });

  return {
    handleComplete: (
      id: string,
      settleType?: SettlementType,
      options?: CompleteOptions
    ) => handleComplete(id, settleType, options),
    handleCancel,
    handleEdit,

    editingId,
    editForm,
    handleChangeEditField,
    handleSubmitEdit,
    handleCancelEdit,
  };
}
