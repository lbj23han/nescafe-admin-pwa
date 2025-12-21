"use client";

import { useState } from "react";
import type { Reservation } from "@/lib/storage";
import { saveReservation } from "@/lib/storage";
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

  const handleAdd = () => {
    if (!department || !menu) {
      alert(DAY_PAGE_COPY.alerts.requiredDepartmentAndMenu);
      return;
    }

    const newItem: Reservation = {
      id: `${Date.now()}`,
      department,
      menu,
      amount: amount ? Number(amount) || 0 : 0,
      time,
      location,
      status: "pending",
    };

    saveReservation(date, newItem);
    onAdded(newItem);
    resetForm();
    setShowForm(false);
  };

  const handleAddButtonClick = () => {
    if (!showForm) {
      setShowForm(true);
      return;
    }
    handleAdd();
  };

  return {
    // state
    department,
    menu,
    amount,
    time,
    location,
    showForm,
    // setters
    setDepartment,
    setMenu,
    setTime,
    setLocation,
    // actions
    handleAmountChange,
    handleAddButtonClick,
  };
}
