// hooks/useDayReservation.ts
"use client";

import { useMemo, useState } from "react";
import {
  loadReservationsByDate,
  saveReservation,
  setReservationStatus,
  deleteReservation,
  type Reservation,
} from "@/lib/storage";
import { DAY_PAGE_COPY } from "@/constants/dayPage";

export function useDayReservation(date: string) {
  const [list, setList] = useState<Reservation[]>(() =>
    date ? loadReservationsByDate(date) : []
  );
  const [department, setDepartment] = useState("");
  const [menu, setMenu] = useState("");
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [showForm, setShowForm] = useState(false);

  const formattedDate = useMemo(() => {
    const [y, m, d] = date.split("-");
    return DAY_PAGE_COPY.dateFormat(m, d);
  }, [date]);

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
    setList((prev) => [...prev, newItem]);

    setDepartment("");
    setMenu("");
    setAmount("");
    setTime("");
    setLocation("");

    setShowForm(false);
  };

  const handleAddButtonClick = () => {
    if (!showForm) {
      setShowForm(true);
      return;
    }
    handleAdd();
  };

  const handleComplete = (id: string) => {
    const ok = window.confirm(DAY_PAGE_COPY.alerts.confirmComplete);
    if (!ok) return;

    setList((prev) => {
      const next: Reservation[] = prev.map((r) =>
        r.id === id ? { ...r, status: "completed" } : r
      );

      setReservationStatus(date, id, "completed");
      return next;
    });
  };

  const handleCancel = (id: string) => {
    const ok = window.confirm(DAY_PAGE_COPY.alerts.confirmCancel);
    if (!ok) return;

    setList((prev) => {
      const next: Reservation[] = prev.filter((r) => r.id !== id);
      deleteReservation(date, id);
      return next;
    });
  };

  const handleAmountChange = (value: string) => {
    setAmount(value.replace(/\D/g, ""));
  };

  return {
    list,
    department,
    menu,
    amount,
    time,
    location,
    showForm,
    formattedDate,

    setDepartment,
    setMenu,
    setTime,
    setLocation,

    handleAmountChange,
    handleAddButtonClick,
    handleComplete,
    handleCancel,
  };
}
