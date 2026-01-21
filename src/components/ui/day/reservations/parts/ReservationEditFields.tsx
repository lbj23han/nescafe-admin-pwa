"use client";

import { useState } from "react";
import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "../../DayUI";
import type { Department } from "@/lib/storage/departments.local";
import type { ReservationEditForm } from "@/hooks/reservation/internal/useReservationEdit";

import type { ReservationItem } from "@/hooks/reservation/internal/reservationItems";
import {
  digitsOnly,
  computeItemsTotal,
  serializeItemsToMenu,
} from "@/hooks/reservation/internal/reservationItems";

import { ReservationItemsSection } from "../ReservationItemsSection";
import { AmountSection } from "../AmountSection";

type ItemWithId = ReservationItem & { id: string };
type AmountMode = "auto" | "manual";

type Props = {
  editForm: ReservationEditForm;
  departments: Department[];
  departmentsLoading: boolean;
  onChangeEditField?: (field: keyof ReservationEditForm, value: string) => void;
  onSubmitEdit?: (override?: Partial<ReservationEditForm>) => void;
  onCancelEdit?: () => void;
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** menu(string) → items(UI용) */
function parseMenuToItems(menu: string): ItemWithId[] {
  const text = (menu ?? "").trim();
  if (!text) {
    return [{ id: makeId(), menu: "", quantity: "", unitPrice: "" }];
  }

  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => {
      const m = p.match(/^(.*?)(?:\s*x(\d+))?(?:\((\d+)\))?\s*$/);
      if (!m) {
        return { id: makeId(), menu: p, quantity: "", unitPrice: "" };
      }
      return {
        id: makeId(),
        menu: (m[1] ?? p).trim(),
        quantity: m[2] ? String(Number(m[2])) : "",
        unitPrice: m[3] ? String(Number(m[3])) : "",
      };
    });
}

export function ReservationEditFields({
  editForm,
  departments,
  departmentsLoading,
  onChangeEditField,
  onSubmitEdit,
  onCancelEdit,
}: Props) {
  const isDirect = editForm.departmentId === "";

  const [items, setItems] = useState<ItemWithId[]>(() =>
    parseMenuToItems(editForm.menu)
  );
  const [amountMode, setAmountMode] = useState<AmountMode>("manual");
  const [manualAmount, setManualAmount] = useState<string>(() =>
    digitsOnly(editForm.amount || "")
  );

  const displayAmount = amountMode === "manual" ? manualAmount : "";

  function onAddItem() {
    setItems((prev) => [
      ...prev,
      { id: makeId(), menu: "", quantity: "", unitPrice: "" },
    ]);
  }

  function onRemoveItem(id: string) {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      return next.length
        ? next
        : [{ id: makeId(), menu: "", quantity: "", unitPrice: "" }];
    });
  }

  function onChangeItemField(
    id: string,
    field: "menu" | "quantity" | "unitPrice",
    value: string
  ) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              [field]: field === "menu" ? value : digitsOnly(value),
            }
          : it
      )
    );
  }

  function handleChangeAmount(v: string) {
    if (amountMode !== "manual") return;
    setManualAmount(digitsOnly(v));
  }

  function handleChangeAmountMode(m: AmountMode) {
    setAmountMode(m);

    if (m === "manual" && !manualAmount) {
      const auto = digitsOnly(String(computeItemsTotal(items) ?? ""));
      if (auto) setManualAmount(auto);
    }
  }

  function handleSubmit() {
    const nextMenu = serializeItemsToMenu(items);
    onChangeEditField?.("menu", nextMenu);

    const auto = digitsOnly(String(computeItemsTotal(items) ?? ""));
    const nextAmount = amountMode === "auto" ? auto : manualAmount;
    onChangeEditField?.("amount", nextAmount);

    onSubmitEdit?.({
      menu: nextMenu,
      amount: nextAmount,
    });
  }

  return (
    <DayUI.EditSection>
      <div className="space-y-3">
        <DayUI.Field label={DAY_PAGE_COPY.form.department.label}>
          <div className="space-y-2">
            <select
              className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-sm text-black"
              value={editForm.departmentId}
              onChange={(e) =>
                onChangeEditField?.("departmentId", e.target.value)
              }
              disabled={departmentsLoading}
            >
              <option value="">
                {departmentsLoading
                  ? DAY_PAGE_COPY.form.department.loadingPlaceholder
                  : DAY_PAGE_COPY.form.department.selectPlaceholder}
              </option>

              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {isDirect && (
              <DayUI.TextInput
                value={editForm.department}
                onChange={(v) => onChangeEditField?.("department", v)}
                placeholder={DAY_PAGE_COPY.form.department.placeholder}
              />
            )}
          </div>
        </DayUI.Field>

        <DayUI.Field label={DAY_PAGE_COPY.form.menu.label}>
          <ReservationItemsSection
            items={items}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
            onChangeItemField={onChangeItemField}
          />
        </DayUI.Field>

        <DayUI.Field label={DAY_PAGE_COPY.form.location.label}>
          <DayUI.TextInput
            value={editForm.location}
            onChange={(v) => onChangeEditField?.("location", v)}
            placeholder={DAY_PAGE_COPY.form.location.placeholder}
          />
        </DayUI.Field>

        <DayUI.Field label={DAY_PAGE_COPY.form.time.label}>
          <DayUI.TextInput
            value={editForm.time}
            onChange={(v) => onChangeEditField?.("time", v)}
            placeholder={DAY_PAGE_COPY.form.time.placeholder}
          />
        </DayUI.Field>

        <DayUI.Field label={DAY_PAGE_COPY.form.amount.label}>
          <AmountSection
            items={items}
            amount={displayAmount}
            amountMode={amountMode}
            onChangeAmount={handleChangeAmount}
            onChangeAmountMode={handleChangeAmountMode}
          />
        </DayUI.Field>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <DayUI.ActionButton variant="edit" onClick={() => onCancelEdit?.()}>
          {DAY_PAGE_COPY.buttons.editCancel}
        </DayUI.ActionButton>
        <DayUI.ActionButton variant="complete" onClick={handleSubmit}>
          {DAY_PAGE_COPY.buttons.editSave}
        </DayUI.ActionButton>
      </div>
    </DayUI.EditSection>
  );
}
