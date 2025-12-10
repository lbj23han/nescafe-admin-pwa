// components/ui/dayPage.tsx
"use client";

import type { ReactNode } from "react";
import type { Reservation } from "@/lib/storage";
import { DAY_PAGE_COPY } from "@/constants/dayPage";

type HeaderProps = {
  dateText: string;
  onBack: () => void;
};

type ReservationListProps = {
  list: Reservation[];
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
};

type ReservationFormProps = {
  department: string;
  menu: string;
  location: string;
  time: string;
  amount: string;
  onChangeDepartment: (v: string) => void;
  onChangeMenu: (v: string) => void;
  onChangeLocation: (v: string) => void;
  onChangeTime: (v: string) => void;
  onChangeAmount: (v: string) => void;
};

type AddButtonProps = {
  showForm: boolean;
  onClick: () => void;
};

export const DayPageUI = {
  Layout({ children }: { children: ReactNode }) {
    return (
      <div className="flex flex-col min-h-screen px-4 pt-5 pb-6">
        {children}
      </div>
    );
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

  Main({ children }: { children: ReactNode }) {
    return <main className="flex-1">{children}</main>;
  },

  ReservationList({ list, onComplete, onCancel }: ReservationListProps) {
    if (list.length === 0) {
      return (
        <section className="mb-4">
          <p className="text-xs text-black">{DAY_PAGE_COPY.emptyList}</p>
        </section>
      );
    }

    return (
      <section className="mb-4">
        <ul className="space-y-2">
          {list.map((r) => {
            const isCompleted = r.status === "completed";

            return (
              <li
                key={r.id}
                className={`border border-zinc-200 rounded-2xl px-3 py-2 text-xs mb-1 ${
                  isCompleted ? "bg-zinc-200 opacity-80" : "bg-zinc-50"
                }`}
              >
                <p className="font-medium text-black">
                  {r.department} · {r.menu}
                </p>
                <p className="mt-1 text-[11px] text-black">
                  금액: {r.amount?.toLocaleString()}원
                  {r.time && ` · 시간: ${r.time}`}
                  {r.location && ` · 위치: ${r.location}`}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  {isCompleted ? (
                    <span className="text-[11px] text-black">
                      {DAY_PAGE_COPY.status.completed}
                    </span>
                  ) : (
                    <span className="text-[11px] text-black">
                      {DAY_PAGE_COPY.status.inProgress}
                    </span>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => onComplete(r.id)}
                      disabled={isCompleted}
                      className={`px-2 py-1 rounded-lg text-[11px] border ${
                        isCompleted
                          ? "border-zinc-300 text-zinc-500 bg-zinc-100 cursor-default"
                          : "border-emerald-500 text-emerald-700 bg-emerald-50"
                      }`}
                    >
                      {DAY_PAGE_COPY.buttons.complete}
                    </button>

                    <button
                      onClick={() => onCancel(r.id)}
                      className="px-2 py-1 rounded-lg text-[11px] border border-red-400 text-red-600 bg-red-50"
                    >
                      {DAY_PAGE_COPY.buttons.cancel}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
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
      <section className="mb-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-black mb-1">
              {DAY_PAGE_COPY.form.department.label}
            </label>
            <input
              value={department}
              onChange={(e) => onChangeDepartment(e.target.value)}
              className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-sm text-black placeholder:text-zinc-400"
              placeholder={DAY_PAGE_COPY.form.department.placeholder}
            />
          </div>
          <div>
            <label className="block text-xs text-black mb-1">
              {DAY_PAGE_COPY.form.menu.label}
            </label>
            <input
              value={menu}
              onChange={(e) => onChangeMenu(e.target.value)}
              className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-sm text-black placeholder:text-zinc-400"
              placeholder={DAY_PAGE_COPY.form.menu.placeholder}
            />
          </div>
          <div>
            <label className="block text-xs text-black mb-1">
              {DAY_PAGE_COPY.form.location.label}
            </label>
            <input
              value={location}
              onChange={(e) => onChangeLocation(e.target.value)}
              className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-sm text-black placeholder:text-zinc-400"
              placeholder={DAY_PAGE_COPY.form.location.placeholder}
            />
          </div>
          <div>
            <label className="block text-xs text-black mb-1">
              {DAY_PAGE_COPY.form.time.label}
            </label>
            <input
              value={time}
              onChange={(e) => onChangeTime(e.target.value)}
              className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-sm text-black placeholder:text-zinc-400"
              placeholder={DAY_PAGE_COPY.form.time.placeholder}
            />
          </div>
          <div>
            <label className="block text-xs text-black mb-1">
              {DAY_PAGE_COPY.form.amount.label}
            </label>
            <input
              value={amount}
              onChange={(e) => onChangeAmount(e.target.value)}
              className="w-full h-10 rounded-xl border border-zinc-200 px-3 text-sm text-black placeholder:text-zinc-400"
              inputMode="numeric"
              placeholder={DAY_PAGE_COPY.form.amount.placeholder}
            />
          </div>
        </div>
      </section>
    );
  },

  AddButton({ showForm, onClick }: AddButtonProps) {
    return (
      <button
        onClick={onClick}
        className="w-full h-11 rounded-xl bg-black text-white text-sm font-semibold shadow-sm active:scale-[0.99] transition"
      >
        {showForm ? DAY_PAGE_COPY.buttons.submit : DAY_PAGE_COPY.buttons.add}
      </button>
    );
  },
};
