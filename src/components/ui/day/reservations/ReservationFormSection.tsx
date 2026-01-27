"use client";

import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "../DayUI";
import type { ReservationFormProps } from "../DayPage.types";
import { ReservationItemsSection } from "./ReservationItemsSection";
import { AmountSection } from "./AmountSection";
import { ReservationTimeField } from "./parts/ReservationTimeField";

export function ReservationFormSection(props: ReservationFormProps) {
  const {
    department,
    location,
    time,

    items,
    onAddItem,
    onRemoveItem,
    onChangeItemField,

    amount,
    amountMode,
    onChangeAmount,
    onChangeAmountMode,

    departments,
    selectedDepartmentId,
    departmentsLoading,
    onChangeDepartmentMode,
    onChangeSelectedDepartmentId,
    onChangeDepartment,

    onChangeLocation,
    onChangeTime,
  } = props;

  const isDirect = !selectedDepartmentId;

  const handleChangeSelect = (value: string) => {
    if (!value) {
      onChangeSelectedDepartmentId("");
      onChangeDepartmentMode("direct");
      return;
    }
    onChangeSelectedDepartmentId(value);
    onChangeDepartmentMode("select");
  };

  return (
    <DayUI.Section>
      <div className="space-y-3">
        <DayUI.Field label={DAY_PAGE_COPY.form.department.label}>
          <div className="space-y-2">
            <select
              className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-sm text-black"
              value={selectedDepartmentId}
              onChange={(e) => handleChangeSelect(e.target.value)}
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
                value={department}
                onChange={onChangeDepartment}
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
            value={location}
            onChange={onChangeLocation}
            placeholder={DAY_PAGE_COPY.form.location.placeholder}
          />
        </DayUI.Field>

        <DayUI.Field label={DAY_PAGE_COPY.form.time.label}>
          <ReservationTimeField
            value={time}
            onChange={onChangeTime}
            placeholder={DAY_PAGE_COPY.form.time.placeholder}
          />
        </DayUI.Field>

        <DayUI.Field label={DAY_PAGE_COPY.form.amount.label}>
          <AmountSection
            items={items}
            amount={amount}
            amountMode={amountMode}
            onChangeAmount={onChangeAmount}
            onChangeAmountMode={onChangeAmountMode}
          />
        </DayUI.Field>
      </div>
    </DayUI.Section>
  );
}
