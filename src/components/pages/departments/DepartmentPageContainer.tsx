// components/pages/departments/DepartmentPageContainer.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { DepartmentPageUI as UI } from "@/components/ui/departments/DepartmentPage.view";
import { DEPARTMENT_PAGE_COPY } from "@/constants/departmentPage";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  type Department,
  createDepartment,
  getDepartments,
  saveDepartments,
} from "@/lib/departmentStorage";
import { DepartmentCard } from "@/components/ui/departments/DepartmentCard";

export function DepartmentPageContainer() {
  const isReady = useAuthGuard();
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[]>(() => {
    if (typeof window === "undefined") return [];
    return getDepartments();
  });

  const [activeDepartmentId, setActiveDepartmentId] = useState<string | null>(
    null
  );

  if (!isReady) return null;

  const handleAddDepartment = () => {
    const name = window.prompt("부서 이름을 입력하세요 (예: A반, 3학년 등)");
    if (!name) return;

    const newDept = createDepartment(name.trim());
    setDepartments((prev) => {
      const next = [...prev, newDept];
      saveDepartments(next);
      return next;
    });
  };

  const handleUpdateDepartment = (updated: Department) => {
    setDepartments((prev) => {
      const next = prev.map((d) => (d.id === updated.id ? updated : d));
      saveDepartments(next);
      return next;
    });
  };

  const isEmpty = departments.length === 0;

  return (
    <UI.Layout>
      {/* 🔙 메인으로 돌아가기 버튼 (최상단) */}
      <div className="mb-2">
        <button
          type="button"
          onClick={() => router.push("/main")}
          className="inline-flex items-center text-[11px] text-zinc-600"
        >
          <span className="mr-1">←</span>
          메인으로
        </button>
      </div>

      <UI.Header
        title={DEPARTMENT_PAGE_COPY.title}
        description={DEPARTMENT_PAGE_COPY.description}
      />

      <UI.Main>
        {isEmpty ? (
          <div className="mt-8 flex flex-col items-center space-y-4">
            <p className="text-xs text-zinc-500">
              {DEPARTMENT_PAGE_COPY.empty}
            </p>
            <PrimaryButton onClick={handleAddDepartment}>
              {DEPARTMENT_PAGE_COPY.addButton}
            </PrimaryButton>
          </div>
        ) : (
          <>
            {/* 부서 카드들 */}
            <div>
              {departments.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  department={dept}
                  expanded={activeDepartmentId === dept.id}
                  onToggle={() =>
                    setActiveDepartmentId((prev) =>
                      prev === dept.id ? null : dept.id
                    )
                  }
                  onChange={handleUpdateDepartment}
                />
              ))}
            </div>

            {/* 부서 추가 버튼 – 카드 아래, 가운데 정렬, 확대 */}
            {activeDepartmentId === null && (
              <div className="mt-6 flex justify-center">
                <PrimaryButton onClick={handleAddDepartment}>
                  {DEPARTMENT_PAGE_COPY.addButton}
                </PrimaryButton>
              </div>
            )}
          </>
        )}
      </UI.Main>
    </UI.Layout>
  );
}
