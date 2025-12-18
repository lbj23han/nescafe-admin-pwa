"use client";

import type { ReactNode } from "react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { DepartmentCard } from "@/components/ui/departments/DepartmentCard";
import type { Department } from "@/lib/departmentStorage";

type LayoutProps = { children: ReactNode };
type HeaderProps = { title: string; description?: string };
type MainProps = { children: ReactNode };

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen px-4 pt-5 pb-4">{children}</div>
  );
}

function Header({ title, description }: HeaderProps) {
  return (
    <header className="mb-4">
      <h1 className="text-lg font-semibold tracking-tight text-black">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-xs text-zinc-600">{description}</p>
      )}
    </header>
  );
}

function Main({ children }: MainProps) {
  return <main className="flex-1">{children}</main>;
}

type PageProps = {
  title: string;
  description?: string;

  emptyText: string;
  addButtonText: string;

  departments: Department[];
  activeDepartmentId: string | null;

  onBack: () => void;
  onAdd: () => void;
  onToggle: (id: string) => void;
  onChange: (updated: Department) => void;
};

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
}: PageProps) {
  const isEmpty = departments.length === 0;

  return (
    <Layout>
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

      <Header title={title} description={description} />

      <Main>
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
      </Main>
    </Layout>
  );
}

export const DepartmentPageUI = {
  Layout,
  Header,
  Main,
  Page,
};
