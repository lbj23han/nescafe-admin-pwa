import { useState } from "react";
import {
  digitsOnly,
  computeItemsTotal,
  serializeItemsToMenu,
  type ReservationItem,
} from "@/hooks/reservation/internal/domain/reservationItems";
import { parseMenuToItems } from "@/hooks/reservation/internal/domain/parseMenuToItems";

type ItemWithId = ReservationItem & { id: string };
type AmountMode = "auto" | "manual";

export function useReservationEditItems(
  initialMenu: string,
  initialAmount: string
) {
  const [items, setItems] = useState<ItemWithId[]>(() =>
    parseMenuToItems(initialMenu)
  );
  const [amountMode, setAmountMode] = useState<AmountMode>("manual");
  const [manualAmount, setManualAmount] = useState(
    digitsOnly(initialAmount || "")
  );

  const displayAmount = amountMode === "manual" ? manualAmount : "";

  const addItem = () =>
    setItems((p) => [
      ...p,
      { id: crypto.randomUUID(), menu: "", quantity: "", unitPrice: "" },
    ]);

  const removeItem = (id: string) =>
    setItems((p) => (p.length > 1 ? p.filter((it) => it.id !== id) : p));

  const changeItem = (
    id: string,
    field: "menu" | "quantity" | "unitPrice",
    value: string
  ) =>
    setItems((p) =>
      p.map((it) =>
        it.id === id
          ? { ...it, [field]: field === "menu" ? value : digitsOnly(value) }
          : it
      )
    );

  const changeAmount = (v: string) => {
    if (amountMode === "manual") setManualAmount(digitsOnly(v));
  };

  const changeAmountMode = (m: AmountMode) => {
    setAmountMode(m);
    if (m === "manual" && !manualAmount) {
      const auto = digitsOnly(String(computeItemsTotal(items) ?? ""));
      if (auto) setManualAmount(auto);
    }
  };

  const buildSubmitPayload = () => {
    const menu = serializeItemsToMenu(items);
    const auto = digitsOnly(String(computeItemsTotal(items) ?? ""));
    const amount = amountMode === "auto" ? auto : manualAmount;
    return { menu, amount };
  };

  return {
    items,
    amountMode,
    displayAmount,
    addItem,
    removeItem,
    changeItem,
    changeAmount,
    changeAmountMode,
    buildSubmitPayload,
  };
}
