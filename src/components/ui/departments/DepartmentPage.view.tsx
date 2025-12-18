"use client";

import { PrimaryButton } from "@/components/PrimaryButton";
import { DepartmentCard } from "@/components/ui/departments/card/DepartmentCard";
import type { DepartmentPageProps } from "./DepartmentPage.types";
import * as UI from "./DepartmentPageUI";

function Page({
  title,
  description,
  emptyText,
  addButtonText,
  departments,
  activeDepartmentId,
  onBack,
  onAdd,
  onToggle,
  onChange,
}: DepartmentPageProps) {
  const isEmpty = departments.length === 0;

  return (
    <UI.Layout>
      <div className="mb-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center text-[11px] text-zinc-600"
        >
          <span className="mr-1">←</span>
          메인으로
        </button>
      </div>

      <UI.Header title={title} description={description} />

      <UI.Main>
        {isEmpty ? (
          <div className="mt-8 flex flex-col items-center space-y-4">
            <p className="text-xs text-zinc-500">{emptyText}</p>
            <PrimaryButton onClick={onAdd}>{addButtonText}</PrimaryButton>
          </div>
        ) : (
          <>
            <div>
              {departments.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  department={dept}
                  expanded={activeDepartmentId === dept.id}
                  onToggle={() => onToggle(dept.id)}
                  onChange={onChange}
                />
              ))}
            </div>

            {activeDepartmentId === null && (
              <div className="mt-6 flex justify-center">
                <PrimaryButton onClick={onAdd}>{addButtonText}</PrimaryButton>
              </div>
            )}
          </>
        )}
      </UI.Main>
    </UI.Layout>
  );
}

export const DepartmentPageUI = {
  Layout: UI.Layout,
  Header: UI.Header,
  Main: UI.Main,
  Page,
};
