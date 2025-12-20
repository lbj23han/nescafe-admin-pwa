"use client";

import dynamic from "next/dynamic";

const DepartmentPageContainer = dynamic(
  () =>
    import("@/components/pages/departments/DepartmentPageContainer").then(
      (m) => m.DepartmentPageContainer
    ),
  { ssr: false }
);

export default function DepartmentsPage() {
  return <DepartmentPageContainer />;
}
