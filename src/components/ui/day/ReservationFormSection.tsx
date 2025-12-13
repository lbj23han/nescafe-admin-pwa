// components/ui/day/ReservationFormSection.tsx
"use client";

import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "./DayUI";
import type { ReservationFormProps } from "./DayPage.types";

export function ReservationFormSection({
  department,
  menu,
  location,
  time,
  amount,
  onChangeDepartment,
  onChangeMenu,
  onChangeLocation,
  onChangeTime,
  onChangeAmount,
}: ReservationFormProps) {
  return (
    <DayUI.Section>
      <div className="space-y-3">
        <DayUI.Field label={DAY_PAGE_COPY.form.department.label}>
          <DayUI.TextInput
            value={department}
            onChange={onChangeDepartment}
            placeholder={DAY_PAGE_COPY.form.department.placeholder}
          />
        </DayUI.Field>

        <DayUI.Field label={DAY_PAGE_COPY.form.menu.label}>
          <DayUI.TextInput
            value={menu}
            onChange={onChangeMenu}
            placeholder={DAY_PAGE_COPY.form.menu.placeholder}
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
          <DayUI.TextInput
            value={time}
            onChange={onChangeTime}
            placeholder={DAY_PAGE_COPY.form.time.placeholder}
          />
        </DayUI.Field>

        <DayUI.Field label={DAY_PAGE_COPY.form.amount.label}>
          <DayUI.TextInput
            value={amount}
            onChange={onChangeAmount}
            placeholder={DAY_PAGE_COPY.form.amount.placeholder}
            numeric
          />
        </DayUI.Field>
      </div>
    </DayUI.Section>
  );
}
