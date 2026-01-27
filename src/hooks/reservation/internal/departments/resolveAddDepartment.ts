import type { Department } from "@/lib/storage/departments.local";
import type { DepartmentInputMode } from "@/components/ui/day/DayPage.types";

export function resolveAddDepartment(args: {
  departmentMode: DepartmentInputMode;
  selectedDepartmentId: string;
  departmentText: string;
  departments: Department[];
}) {
  const { departmentMode, selectedDepartmentId, departmentText, departments } =
    args;

  const isDirect = departmentMode === "direct" || !selectedDepartmentId;

  const selected = selectedDepartmentId
    ? departments.find((d) => d.id === selectedDepartmentId) ?? null
    : null;

  const resolvedDepartmentName = isDirect
    ? departmentText.trim()
    : (selected?.name ?? "").trim();

  const resolvedDepartmentId = isDirect ? null : selected?.id ?? null;

  return { resolvedDepartmentId, resolvedDepartmentName };
}
