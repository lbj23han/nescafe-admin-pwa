// components/ui/day/DayPage.types.ts
import type { ReactNode } from "react";
import type { Reservation } from "@/lib/storage";

export type HeaderProps = {
  dateText: string;
  onBack: () => void;
};

export type ReservationListProps = {
  list: Reservation[];
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
};

export type ReservationFormProps = {
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

export type AddButtonProps = {
  showForm: boolean;
  onClick: () => void;
};

export type LayoutProps = {
  children: ReactNode;
};

export type MainProps = {
  children: ReactNode;
};
