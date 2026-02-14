// src/components/ui/departments/card/DepartmentCard.types.ts
import type { Department } from "@/lib/storage/departments.local";
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
