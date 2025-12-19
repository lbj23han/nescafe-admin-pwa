"use client";

import { useEffect, useRef, useState } from "react";
import { DepartmentCard } from "@/components/ui/departments/card/DepartmentCard";
import type { DepartmentPageProps } from "./DepartmentPage.types";
import * as UI from "./DepartmentPageUI";
import { DepartmentAddInlineForm } from "./DepartmentAddInlineForm";
import { DEPARTMENT_PAGE_COPY } from "@/constants/departments/page";

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
  onDelete,
}: DepartmentPageProps) {
  const isEmpty = departments.length === 0;

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showAddForm) inputRef.current?.focus();
  }, [showAddForm]);

  const toggleAddForm = () => {
    setShowAddForm((prev) => {
      const next = !prev;
      if (!next) setName("");
      return next;
    });
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setName("");
  };

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    closeAddForm();
  };

  return (
    <UI.Layout>
      <UI.BackButton label={DEPARTMENT_PAGE_COPY.back} onClick={onBack} />

      <UI.Header title={title} description={description} />

      <UI.Main>
        <UI.AddToggleButton
          onClick={toggleAddForm}
          label={
            showAddForm
              ? DEPARTMENT_PAGE_COPY.addCancel ?? "취소"
              : addButtonText
          }
        />

        {showAddForm && (
          <DepartmentAddInlineForm
            inputRef={inputRef}
            value={name}
            placeholder={DEPARTMENT_PAGE_COPY.addPlaceholder}
            submitText={DEPARTMENT_PAGE_COPY.addSubmit}
            canSubmit={!!name.trim()}
            onChange={setName}
            onSubmit={submit}
            onEscape={closeAddForm}
          />
        )}

        {isEmpty ? (
          <div className="mt-8 flex flex-col items-center space-y-2">
            <p className="text-xs text-zinc-500">{emptyText}</p>
          </div>
        ) : (
          <div>
            {departments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                department={dept}
                expanded={activeDepartmentId === dept.id}
                onToggle={() => onToggle(dept.id)}
                onChange={onChange}
                onDelete={onDelete}
              />
            ))}
          </div>
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
