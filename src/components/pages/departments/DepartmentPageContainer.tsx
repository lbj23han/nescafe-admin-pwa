"use client";

import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { DepartmentPageUI as UI } from "@/components/ui/departments/DepartmentPage.view";
import { DEPARTMENT_PAGE_COPY } from "@/constants/departmentPage";
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
  } = useDepartments();

  if (!isReady) return null;

  const handleAddDepartment = () => {
    const name = window.prompt("부서 이름을 입력하세요.");
    if (!name) return;
    addDepartment(name);
  };

  return (
    <UI.Page
      onBack={() => router.push("/main")}
      title={DEPARTMENT_PAGE_COPY.title}
      description={DEPARTMENT_PAGE_COPY.description}
      emptyText={DEPARTMENT_PAGE_COPY.empty}
      addButtonText={DEPARTMENT_PAGE_COPY.addButton}
      departments={departments}
      activeDepartmentId={activeDepartmentId}
      onAdd={handleAddDepartment}
      onToggle={toggleDepartment}
      onChange={updateDepartment}
    />
  );
}
