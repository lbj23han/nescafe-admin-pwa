"use client";

import type { ReactNode } from "react";
import type { Reservation } from "@/lib/domain/reservation";
import type { Department } from "@/lib/storage/departments.local";

export type HeaderProps = {
  dateText: string;
  onBack: () => void;
};

export type SettleType = "deposit" | "debt";

export type ReservationEditForm = {
  /**
   * ""  => 직접 입력
   * "id" => 기존 부서 선택
   */
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
  departmentsLoading?: boolean;

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
  onSubmitEdit?: () => void | Promise<void>;
  onCancelEdit?: () => void;
  canManageActions?: boolean;
};

export type DepartmentInputMode = "select" | "direct";

export type ReservationFormProps = {
  department: string;
  menu: string;
  location: string;
  time: string;
  amount: string;

  departmentMode: DepartmentInputMode;
  departments: Department[];
  selectedDepartmentId: string;
  departmentsLoading?: boolean;

  onChangeDepartmentMode: (mode: DepartmentInputMode) => void;
  onChangeSelectedDepartmentId: (id: string) => void;

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

export type DayPageViewProps = {
  header: HeaderProps;
  list: ReservationListProps;

  showForm: boolean;
  form?: ReservationFormProps;

  showAddButton: boolean;
  addButton: AddButtonProps;
};
