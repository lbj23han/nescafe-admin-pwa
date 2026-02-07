"use client";

import { useState } from "react";
import { digitsOnly, type ReservationItem } from "../domain/reservationItems";

export type ReservationItemWithId = ReservationItem & { id: string };

export type PrefillFormItem = {
  menu: string;
  quantity: string;
  unitPrice?: string;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyItem(): ReservationItemWithId {
  return { id: createId(), menu: "", quantity: "", unitPrice: "" };
}

function toItem(it: PrefillFormItem): ReservationItemWithId {
  return {
    id: createId(),
    menu: it.menu,
    quantity: digitsOnly(it.quantity),
    unitPrice: digitsOnly(it.unitPrice ?? ""),
  };
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

  // AI 프리필(복수 아이템) 적용용
  const applyPrefillItems = (prefill: PrefillFormItem[]) => {
    const cleaned = prefill
      .map((p) => ({
        menu: p.menu.trim(),
        quantity: digitsOnly(p.quantity ?? ""),
        unitPrice: digitsOnly(p.unitPrice ?? ""),
      }))
      .filter((p) => p.menu.length > 0);

    if (cleaned.length === 0) {
      setItems([createEmptyItem()]);
      return;
    }

    setItems(cleaned.map(toItem));
  };

  return {
    items,
    onAddItem,
    onRemoveItem,
    onChangeItemField,
    resetItems,
    applyPrefillItems,
  };
}
