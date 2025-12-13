import type { Department } from "@/lib/departmentStorage";

export type DepartmentCardProps = {
  department: Department;
  expanded: boolean;
  onToggle: () => void;
  onChange: (updated: Department) => void;
};
