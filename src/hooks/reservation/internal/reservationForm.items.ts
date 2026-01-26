"use client";

import { useState } from "react";
import { digitsOnly, type ReservationItem } from "./reservationItems";

export type ReservationItemWithId = ReservationItem & { id: string };

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyItem(): ReservationItemWithId {
  return { id: createId(), menu: "", quantity: "", unitPrice: "" };
}

export function useReservationFormItems() {
  const [items, setItems] = useState<ReservationItemWithId[]>([
    createEmptyItem(),
  ]);

  const onAddItem = () => setItems((p) => [...p, createEmptyItem()]);

  const onRemoveItem = (id: string) => {
    setItems((p) => {
      const next = p.filter((it) => it.id !== id);
      return next.length > 0 ? next : [createEmptyItem()];
    });
  };

  const onChangeItemField = (
    id: string,
    field: "menu" | "quantity" | "unitPrice",
    value: string
  ) => {
    setItems((p) =>
      p.map((it) => {
        if (it.id !== id) return it;
        if (field === "menu") return { ...it, menu: value };
        if (field === "quantity") return { ...it, quantity: digitsOnly(value) };
        return { ...it, unitPrice: digitsOnly(value) };
      })
    );
  };

  const resetItems = () => setItems([createEmptyItem()]);

  return { items, onAddItem, onRemoveItem, onChangeItemField, resetItems };
}
