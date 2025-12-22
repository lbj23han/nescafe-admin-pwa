"use client";

import { useEffect, useMemo, useState } from "react";
import type { Department } from "@/lib/storage/departments.local";
import { DepartmentsRepo } from "@/lib/data";

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeDepartmentId, setActiveDepartmentId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // 초기 로드
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const list = await DepartmentsRepo.getDepartments();
        if (mounted) setDepartments(list);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const isEmpty = useMemo(
    () => !loading && departments.length === 0,
    [loading, departments]
  );

  // 추가
  const addDepartment = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const created = await DepartmentsRepo.createDepartment(trimmed);

    setDepartments((prev) => [...prev, created]);
  };

  // 변경 (이름/금액/history 반영 결과 그대로 저장)
  const updateDepartment = async (updated: Department) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  };

  // 토글
  const toggleDepartment = (id: string) => {
    setActiveDepartmentId((prev) => (prev === id ? null : id));
  };

  // 삭제
  const deleteDepartment = async (id: string) => {
    await DepartmentsRepo.deleteDepartment(id);

    setDepartments((prev) => prev.filter((d) => d.id !== id));
    setActiveDepartmentId((prev) => (prev === id ? null : prev));
  };

  return {
    departments,
    activeDepartmentId,
    isEmpty,
    loading,

    addDepartment,
    updateDepartment,
    toggleDepartment,
    deleteDepartment,

    setActiveDepartmentId,
  };
}
