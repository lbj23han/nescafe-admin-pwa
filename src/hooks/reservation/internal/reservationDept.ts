import type { Department } from "@/lib/storage/departments.local";

export type DepartmentPick = {
  departmentId: string; // "" => direct
  department: string; // direct text
};

export function findDeptName(departments: Department[], id: string) {
  return departments.find((d) => d.id === id)?.name ?? "";
}

export function resolveDepartment(
  departments: Department[],
  form: DepartmentPick
) {
  const isDirect = !form.departmentId;

  const resolvedDepartmentId = isDirect ? null : form.departmentId;

  const resolvedDepartmentName = isDirect
    ? form.department.trim()
    : findDeptName(departments, form.departmentId).trim();

  return { resolvedDepartmentId, resolvedDepartmentName };
}
