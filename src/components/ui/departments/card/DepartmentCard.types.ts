import type { ReactNode, FormHTMLAttributes } from "react";
import type { Department, DepartmentHistory } from "@/lib/departmentStorage";

export type DepartmentCardProps = {
  department: Department;
  expanded: boolean;
  onToggle: () => void;
  onChange: (updated: Department) => void;

  onDelete?: (id: string) => void;
};

/** UI primitives 타입들 */
export type RootProps = {
  expanded: boolean;
  onClick: () => void;
  children: ReactNode;
};

export type HeaderProps = {
  name: string;
  deposit: number;
  debt: number;
  expanded: boolean;
  onToggleClick: () => void;
  onDeleteClick?: () => void;
};

export type ExpandedContainerProps = {
  children: ReactNode;
};

export type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
};

export type HistoryListProps = {
  items: DepartmentHistory[];
  renderItem: (h: DepartmentHistory) => ReactNode;
};

export type HistoryItemProps = {
  left: ReactNode;
  right: ReactNode;
};

export type HistoryContentProps = {
  typeLabel: string;
  memo?: string;
  dateLabel: string;
  amountLabel: string;
  positive: boolean;
};
