"use client";

import type { ReactNode } from "react";
import type { Reservation } from "@/lib/domain/reservation";
import type { Department } from "@/lib/storage/departments.local";
import type { ReservationItem } from "@/hooks/reservation/internal/reservationItems";

export type HeaderProps = {
  dateText: string;
  onBack: () => void;
};

export type SettleType = "deposit" | "debt";
export type DepartmentInputMode = "select" | "direct";
export type AmountMode = "auto" | "manual";
export type AddButtonIntent = "open" | "close" | "submit";

export type ReservationEditForm = {
  departmentId: string;
  department: string;
  menu: string;
  location: string;
  time: string;
  amount: string;
};

export type ReservationListProps = {
  list: Reservation[];

  departments: Department[];
  departmentsLoading: boolean;

  onComplete: (
    id: string,
    settleType?: SettleType,
    options?: { skipConfirm?: boolean }
  ) => void | Promise<void>;

  onCancel: (id: string) => void;
  onEdit: (id: string) => void;

  editingId?: string | null;
  editForm?: ReservationEditForm | null;
  onChangeEditField?: (field: keyof ReservationEditForm, value: string) => void;
  onSubmitEdit?: (
    override?: Partial<ReservationEditForm>
  ) => void | Promise<void>;
  onCancelEdit?: () => void;

  canManageActions: boolean;
};

type ItemWithId = ReservationItem & { id: string };

export type ReservationFormProps = {
  department: string;
  location: string;
  time: string;

  items: ItemWithId[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onChangeItemField: (
    id: string,
    field: "menu" | "quantity" | "unitPrice",
    value: string
  ) => void;

  amountMode: AmountMode;
  amount: string;
  onChangeAmountMode: (mode: AmountMode) => void;
  onChangeAmount: (v: string) => void;

  departmentMode: DepartmentInputMode;
  departments: Department[];
  selectedDepartmentId: string;
  departmentsLoading: boolean;

  onChangeDepartmentMode: (mode: DepartmentInputMode) => void;
  onChangeSelectedDepartmentId: (id: string) => void;

  onChangeDepartment: (v: string) => void;
  onChangeLocation: (v: string) => void;
  onChangeTime: (v: string) => void;
};

export type AddButtonProps = {
  intent: AddButtonIntent;
  onClick: () => void;
};

export type LayoutProps = {
  children: ReactNode;
};

export type MainProps = {
  children: ReactNode;
};

export type DayPageViewProps = {
  header: HeaderProps;
  list: ReservationListProps;

  showForm: boolean;
  form?: ReservationFormProps;

  showAddButton: boolean;
  addButton: AddButtonProps;
};
