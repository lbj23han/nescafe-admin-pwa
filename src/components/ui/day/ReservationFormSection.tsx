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

  departmentMode,
  departments,
  selectedDepartmentId,
  departmentsLoading,
  onChangeDepartmentMode,
  onChangeSelectedDepartmentId,
}: ReservationFormProps) {
  return (
    <DayUI.Section>
      <div className="space-y-3">
        <DayUI.Field label={DAY_PAGE_COPY.form.department.label}>
          <div className="space-y-2">
            <select
              className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-sm text-black"
              value={departmentMode}
              onChange={(e) =>
                onChangeDepartmentMode(
                  e.target.value === "direct" ? "direct" : "select"
                )
              }
            >
              <option value="select">기존 부서 선택</option>
              <option value="direct">직접 입력</option>
            </select>

            {departmentMode === "select" ? (
              <select
                className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-sm text-black"
                value={selectedDepartmentId}
                onChange={(e) => onChangeSelectedDepartmentId(e.target.value)}
                disabled={departmentsLoading}
              >
                <option value="">
                  {departmentsLoading
                    ? "부서 목록 불러오는 중…"
                    : "부서를 선택하세요"}
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            ) : (
              // 직접 입력
              <DayUI.TextInput
                value={department}
                onChange={onChangeDepartment}
                placeholder={DAY_PAGE_COPY.form.department.placeholder}
              />
            )}
          </div>
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
