import type { Department } from "@/lib/storage/departments.local";

export type LedgerPrefill = {
  departmentId: string;
  type: "deposit" | "order" | "debtPayment" | "payment";
  amount: number;
};

export type DepartmentPageProps = {
  title: string;
  description: string;
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
  ledgerPrefill?: LedgerPrefill | null;
};
