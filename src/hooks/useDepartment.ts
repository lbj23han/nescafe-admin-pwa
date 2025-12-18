"use client";

import { useMemo, useState } from "react";
import {
  type Department,
  createDepartment,
  getDepartments,
  saveDepartments,
} from "@/lib/departmentStorage";

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>(() => {
    if (typeof window === "undefined") return [];
    return getDepartments();
  });

  const [activeDepartmentId, setActiveDepartmentId] = useState<string | null>(
    null
  );

  const isEmpty = useMemo(() => departments.length === 0, [departments]);

  const addDepartment = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const newDept = createDepartment(trimmed);

    setDepartments((prev) => {
      const next = [...prev, newDept];
      saveDepartments(next);
      return next;
    });
  };

  const updateDepartment = (updated: Department) => {
    setDepartments((prev) => {
      const next = prev.map((d) => (d.id === updated.id ? updated : d));
      saveDepartments(next);
      return next;
    });
  };

  const toggleDepartment = (id: string) => {
    setActiveDepartmentId((prev) => (prev === id ? null : id));
  };

  return {
    departments,
    activeDepartmentId,
    isEmpty,
    addDepartment,
    updateDepartment,
    toggleDepartment,
    setActiveDepartmentId,
  };
}
