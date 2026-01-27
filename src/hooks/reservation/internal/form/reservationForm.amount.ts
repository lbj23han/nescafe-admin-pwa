"use client";

import { useMemo, useState } from "react";
import { digitsOnly, computeItemsTotal } from "../domain/reservationItems";
import { resolveDisplayAmount, type AmountMode } from "../domain/amountCalc";
import type { ReservationItemWithId } from "./reservationForm.items";
function toAutoAmount(items: ReservationItemWithId[]): string {
  const total = computeItemsTotal(items);
  const digits = digitsOnly(String(total ?? ""));
  return digits ? digits : "";
}

export function useReservationFormAmount(items: ReservationItemWithId[]) {
  const [amountMode, setAmountMode] = useState<AmountMode>("auto");
  const [manualAmount, setManualAmount] = useState("");

  const autoAmount = useMemo(() => toAutoAmount(items), [items]);

  const amount = useMemo(
    () =>
      resolveDisplayAmount({
        mode: amountMode,
        autoAmount,
        manualAmount,
      }),
    [amountMode, autoAmount, manualAmount]
  );

  const onChangeAmount = (value: string) => {
    if (amountMode !== "manual") return;
    setManualAmount(digitsOnly(value));
  };

  const onChangeAmountMode = (mode: AmountMode) => {
    setAmountMode(mode);
    if (mode === "manual" && !manualAmount && autoAmount) {
      setManualAmount(autoAmount);
    }
  };

  const resetAmount = () => {
    setAmountMode("auto");
    setManualAmount("");
  };

  return {
    amount,
    amountMode,
    manualAmount,
    autoAmount,
    onChangeAmount,
    onChangeAmountMode,
    resetAmount,
  };
}
