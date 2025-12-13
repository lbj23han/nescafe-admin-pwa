// components/pages/departments/DepartmentPageContainer.tsx
"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { DepartmentPageUI as UI } from "@/components/ui/departments/DepartmentPage.view";
import { DEPARTMENT_PAGE_COPY } from "@/constants/departmentPage";

export function DepartmentPageContainer() {
  const isReady = useAuthGuard();
  if (!isReady) return null;

  return (
    <UI.Layout>
      <UI.Header
        title={DEPARTMENT_PAGE_COPY.title}
        description={DEPARTMENT_PAGE_COPY.description}
      />
      <UI.Main>
        <div className="text-zinc-500 text-sm">준비중...</div>
      </UI.Main>
    </UI.Layout>
  );
}
