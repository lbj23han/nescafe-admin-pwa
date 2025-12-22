"use client";

import { useState } from "react";
import type { Reservation } from "@/lib/domain/reservation";
import { ReservationsRepo } from "@/lib/data";
import { DAY_PAGE_COPY } from "@/constants/dayPage";

type UseReservationFormArgs = {
  date: string;
  onAdded: (reservation: Reservation) => void;
};

export function useReservationForm({ date, onAdded }: UseReservationFormArgs) {
  const [department, setDepartment] = useState("");
  const [menu, setMenu] = useState("");
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleAmountChange = (value: string) => {
    setAmount(value.replace(/\D/g, ""));
  };

  const resetForm = () => {
    setDepartment("");
    setMenu("");
    setAmount("");
    setTime("");
    setLocation("");
  };

  const handleAdd = async () => {
    if (!department || !menu) {
      alert(DAY_PAGE_COPY.alerts.requiredDepartmentAndMenu);
      return;
    }

    const draft: Reservation = {
      id: `${Date.now()}`,
      department,
      menu,
      amount: amount ? Number(amount) || 0 : 0,
      time,
      location,
      status: "pending",
    };

    try {
      const saved = await ReservationsRepo.saveReservation(date, draft);
      onAdded(saved);
      resetForm();
      setShowForm(false);
    } catch (e) {
      console.error(e);
      alert("저장에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleAddButtonClick = () => {
    if (!showForm) {
      setShowForm(true);
      return;
    }
    void handleAdd();
  };

  return {
    department,
    menu,
    amount,
    time,
    location,
    showForm,
    setDepartment,
    setMenu,
    setTime,
    setLocation,
    handleAmountChange,
    handleAddButtonClick,
  };
}
