import type { ReactNode, FormHTMLAttributes } from "react";
import type {
  Department,
  DepartmentHistory,
  HistoryType,
} from "@/lib/storage/departments.local";
import type { LedgerPrefill } from "@/components/ui/departments/DepartmentPage.types";

export type DepartmentCardProps = {
  department: Department;
  expanded: boolean;
  onToggle: () => void;
  onChange: (updated: Department) => void;
  onDelete?: (id: string) => void;

  readOnly?: boolean;

  ledgerPrefill?: LedgerPrefill | null;
};

/** UI primitives 타입들 */
export type RootProps = {
  expanded: boolean;
  onClick: () => void;
  children: ReactNode;
};

export type HeaderProps = {
  name: string;
  nameNode?: ReactNode;
  deposit: number;
  debt: number;
  expanded: boolean;
  onToggleClick: () => void;
  onDeleteClick?: () => void;
  onEditNameToggleClick?: () => void;
  editingName?: boolean;
};

export type ExpandedContainerProps = {
  children: ReactNode;
};

export type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
};

export type HistoryContainerProps = {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  editMode?: boolean;
  stickyHeader?: boolean;
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
  actions?: ReactNode;
};

export type HistoryEditDraft = {
  type: HistoryType;
  amount: string;
  memo: string;
};
