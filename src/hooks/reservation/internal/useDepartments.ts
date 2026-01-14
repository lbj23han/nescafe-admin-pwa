"use client";

import { useEffect, useState } from "react";
import type { Department } from "@/lib/storage/departments.local";
import { DepartmentsRepo } from "@/lib/data";

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setDepartmentsLoading(true);

    (async () => {
      try {
        const items = await DepartmentsRepo.getDepartments();
        if (!alive) return;
        setDepartments(items);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setDepartments([]);
      } finally {
        if (alive) setDepartmentsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { departments, departmentsLoading };
}
