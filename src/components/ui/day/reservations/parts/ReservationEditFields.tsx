"use client";

import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "../../DayUI";
import type { Department } from "@/lib/storage/departments.local";
import type { ReservationEditForm } from "@/hooks/reservation/internal/actions/useReservationEdit";

import { ReservationItemsSection } from "../ReservationItemsSection";
import { AmountSection } from "../AmountSection";
import { useReservationEditItems } from "./hooks/useReservationEditItems";
import { ReservationTimeField } from "./ReservationTimeField";
import { RESERVATION_UI } from "../reservation.ui";

type Props = {
  editForm: ReservationEditForm;
  departments: Department[];
  departmentsLoading: boolean;
  onChangeEditField?: (field: keyof ReservationEditForm, value: string) => void;
  onSubmitEdit?: (override?: Partial<ReservationEditForm>) => void;
  onCancelEdit?: () => void;
};

export function ReservationEditFields({
  editForm,
  departments,
  departmentsLoading,
  onChangeEditField,
  onSubmitEdit,
  onCancelEdit,
}: Props) {
  const isDirect = editForm.departmentId === "";

  const {
    items,
    amountMode,
    displayAmount,
    addItem,
    removeItem,
    changeItem,
    changeAmount,
    changeAmountMode,
    buildSubmitPayload,
  } = useReservationEditItems(editForm.menu, editForm.amount);

  const handleSubmit = () => {
    const { menu, amount } = buildSubmitPayload();
    onSubmitEdit?.({ menu, amount });
  };

  return (
    <DayUI.EditSection>
      <div className={RESERVATION_UI.formStack}>
        <DayUI.Field label={DAY_PAGE_COPY.form.department.label}>
          <div className={RESERVATION_UI.stack2}>
            <select
              className={RESERVATION_UI.selectBase}
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
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onChangeItemField={changeItem}
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
          <ReservationTimeField
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
            onChangeAmount={changeAmount}
            onChangeAmountMode={changeAmountMode}
          />
        </DayUI.Field>
      </div>

      <div className={RESERVATION_UI.footerActions}>
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
