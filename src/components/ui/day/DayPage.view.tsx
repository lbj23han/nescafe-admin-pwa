// components/ui/day/DayPage.view.tsx
"use client";

import { DAY_PAGE_COPY } from "@/constants/dayPage";
import { DayUI } from "./DayUI";
import type {
  HeaderProps,
  ReservationListProps,
  ReservationFormProps,
  AddButtonProps,
  LayoutProps,
  MainProps,
} from "./DayPage.types";

export const DayPageUI = {
  Layout({ children }: LayoutProps) {
    return <DayUI.Layout>{children}</DayUI.Layout>;
  },

  Header({ dateText, onBack }: HeaderProps) {
    return (
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-xs text-black">
          {DAY_PAGE_COPY.backButton}
        </button>
        <div className="text-right">
          <p className="text-sm text-black">{DAY_PAGE_COPY.title}</p>
          <p className="text-lg font-semibold text-black">{dateText}</p>
        </div>
      </div>
    );
  },

  Main({ children }: MainProps) {
    return <DayUI.Main>{children}</DayUI.Main>;
  },

  ReservationList({ list, onComplete, onCancel }: ReservationListProps) {
    if (list.length === 0) {
      return (
        <DayUI.Section>
          <p className="text-xs text-black">{DAY_PAGE_COPY.emptyList}</p>
        </DayUI.Section>
      );
    }

    return (
      <DayUI.Section>
        <ul className="space-y-2">
          {list.map((r) => {
            const isCompleted = r.status === "completed";

            return (
              <DayUI.ReservationCard key={r.id} isCompleted={isCompleted}>
                <p className="font-medium text-black">
                  {r.department} · {r.menu}
                </p>

                <p className="mt-1 text-[11px] text-black">
                  금액: {r.amount?.toLocaleString()}원
                  {r.time && ` · 시간: ${r.time}`}
                  {r.location && ` · 위치: ${r.location}`}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-black">
                    {isCompleted
                      ? DAY_PAGE_COPY.status.completed
                      : DAY_PAGE_COPY.status.inProgress}
                  </span>

                  <div className="flex gap-2">
                    <DayUI.ActionButton
                      variant="complete"
                      disabled={isCompleted}
                      onClick={() => onComplete(r.id)}
                    >
                      {DAY_PAGE_COPY.buttons.complete}
                    </DayUI.ActionButton>

                    <DayUI.ActionButton
                      variant="cancel"
                      onClick={() => onCancel(r.id)}
                    >
                      {DAY_PAGE_COPY.buttons.cancel}
                    </DayUI.ActionButton>
                  </div>
                </div>
              </DayUI.ReservationCard>
            );
          })}
        </ul>
      </DayUI.Section>
    );
  },

  ReservationForm({
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
          <div>
            <DayUI.Label>{DAY_PAGE_COPY.form.department.label}</DayUI.Label>
            <DayUI.TextInput
              value={department}
              onChange={onChangeDepartment}
              placeholder={DAY_PAGE_COPY.form.department.placeholder}
            />
          </div>

          <div>
            <DayUI.Label>{DAY_PAGE_COPY.form.menu.label}</DayUI.Label>
            <DayUI.TextInput
              value={menu}
              onChange={onChangeMenu}
              placeholder={DAY_PAGE_COPY.form.menu.placeholder}
            />
          </div>

          <div>
            <DayUI.Label>{DAY_PAGE_COPY.form.location.label}</DayUI.Label>
            <DayUI.TextInput
              value={location}
              onChange={onChangeLocation}
              placeholder={DAY_PAGE_COPY.form.location.placeholder}
            />
          </div>

          <div>
            <DayUI.Label>{DAY_PAGE_COPY.form.time.label}</DayUI.Label>
            <DayUI.TextInput
              value={time}
              onChange={onChangeTime}
              placeholder={DAY_PAGE_COPY.form.time.placeholder}
            />
          </div>

          <div>
            <DayUI.Label>{DAY_PAGE_COPY.form.amount.label}</DayUI.Label>
            <DayUI.TextInput
              value={amount}
              onChange={onChangeAmount}
              placeholder={DAY_PAGE_COPY.form.amount.placeholder}
              numeric
            />
          </div>
        </div>
      </DayUI.Section>
    );
  },

  AddButton({ showForm, onClick }: AddButtonProps) {
    return (
      <DayUI.PrimaryButton onClick={onClick}>
        {showForm ? DAY_PAGE_COPY.buttons.submit : DAY_PAGE_COPY.buttons.add}
      </DayUI.PrimaryButton>
    );
  },
};
