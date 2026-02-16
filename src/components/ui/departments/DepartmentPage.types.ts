import type { ReactNode } from "react";
import type { Department } from "@/lib/storage/departments.local";

export type LayoutProps = { children: ReactNode };
export type HeaderProps = { title: string; description?: string };
export type MainProps = { children: ReactNode };

export type LedgerPrefill = {
  departmentId: string;
  type: "deposit" | "order" | "debtPayment" | "payment";
  amount: number;
};

export type DepartmentPageProps = {
  title: string;
  description?: string;

  emptyText: string;
  addButtonText: string;

  departments: Department[];
  activeDepartmentId: string | null;

  onBack: () => void;
  onAdd: (name: string) => void;
  onToggle: (id: string) => void;
  onChange: (updated: Department) => void;

  onDelete?: (id: string) => void;
  canEditLedger: boolean;

  // AI Assistant → Departments 페이지 채움
  ledgerPrefill?: LedgerPrefill | null;
};
