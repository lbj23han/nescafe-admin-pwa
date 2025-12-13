// components/ui/day/DayPage.types.ts
import type { ReactNode } from "react";
import type { Reservation } from "@/lib/storage";

export type HeaderProps = {
  dateText: string;
  onBack: () => void;
};

// 수정 폼에서 사용할 필드 타입
export type ReservationEditForm = {
  department: string;
  menu: string;
  location: string;
  time: string;
  amount: string;
};

export type ReservationListProps = {
  list: Reservation[];
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;

  // 수정 관련 props
  onEdit: (id: string) => void;
  editingId?: string | null;
  editForm?: ReservationEditForm | null;
  onChangeEditField?: (field: keyof ReservationEditForm, value: string) => void;
  onSubmitEdit?: () => void;
  onCancelEdit?: () => void;
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
