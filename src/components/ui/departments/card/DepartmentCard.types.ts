import type { ReactNode, FormHTMLAttributes } from "react";
import type {
  Department,
  DepartmentHistory,
  HistoryType,
} from "@/lib/storage/departments.local";

export type DepartmentCardProps = {
  department: Department;
  expanded: boolean;
  onToggle: () => void;
  onChange: (updated: Department) => void;
  onDelete?: (id: string) => void;

  readOnly?: boolean;
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

  /** ✅ 마감 퀄리티: 편집 모드 스타일링 */
  editMode?: boolean;

  /** ✅ 마감 퀄리티: 헤더 sticky */
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
