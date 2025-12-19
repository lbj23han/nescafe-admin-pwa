"use client";

import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { DepartmentPageUI as UI } from "@/components/ui/departments/DepartmentPage.view";
import { DEPARTMENT_PAGE_COPY } from "@/constants/departments/page";
import { useDepartments } from "@/hooks/useDepartment";

export function DepartmentPageContainer() {
  const isReady = useAuthGuard();
  const router = useRouter();

  const {
    departments,
    activeDepartmentId,
    addDepartment,
    updateDepartment,
    toggleDepartment,
    deleteDepartment,
  } = useDepartments();

  if (!isReady) return null;

  return (
    <UI.Page
      onBack={() => router.push("/main")}
      title={DEPARTMENT_PAGE_COPY.title}
      description={DEPARTMENT_PAGE_COPY.description}
      emptyText={DEPARTMENT_PAGE_COPY.empty}
      addButtonText={DEPARTMENT_PAGE_COPY.addButton}
      departments={departments}
      activeDepartmentId={activeDepartmentId}
      onAdd={addDepartment}
      onToggle={toggleDepartment}
      onChange={updateDepartment}
      onDelete={deleteDepartment}
    />
  );
}
