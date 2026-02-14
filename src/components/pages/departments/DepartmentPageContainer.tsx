"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { DepartmentPageUI as UI } from "@/components/ui/departments/DepartmentPage.view";
import { DEPARTMENT_PAGE_COPY } from "@/constants/departments/page";
import { useDepartments } from "@/hooks/useDepartment";
import { supabase } from "@/lib/supabaseClient";
import type { LedgerPrefill } from "@/components/ui/departments/DepartmentPage.types";

function normalizeRole(role: unknown) {
  return String(role ?? "")
    .trim()
    .toLowerCase();
}

async function fetchMyRole(): Promise<string> {
  const { data: sessionRes, error: sessionErr } =
    await supabase.auth.getSession();
  if (sessionErr) throw sessionErr;

  const userId = sessionRes.session?.user.id;
  if (!userId) return "unknown";

  const byUserId = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle<{ role: string | null }>();

  if (byUserId.error) throw byUserId.error;
  if (byUserId.data?.role) return byUserId.data.role;

  const byId = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle<{ role: string | null }>();

  if (byId.error) throw byId.error;
  return byId.data?.role ?? "unknown";
}

function parseLedgerPrefill(sp: URLSearchParams): LedgerPrefill | null {
  // 로그 기준: /departments?ai=1&deptId=...&type=deposit&amount=50000
  if (sp.get("ai") !== "1") return null;

  const deptId = sp.get("deptId")?.trim() ?? "";
  const type = sp.get("type")?.trim() ?? "";
  const amountRaw = sp.get("amount")?.trim() ?? "";

  if (!deptId) return null;

  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  if (
    type !== "deposit" &&
    type !== "order" &&
    type !== "debtPayment" &&
    type !== "payment"
  ) {
    return null;
  }

  return {
    departmentId: deptId,
    type,
    amount: Math.floor(amount),
  };
}

export function DepartmentPageContainer() {
  const isReady = useAuthGuard();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [roleKey, setRoleKey] = useState("unknown");

  useEffect(() => {
    if (!isReady) return;
    let mounted = true;

    (async () => {
      try {
        const role = await fetchMyRole();
        if (mounted) setRoleKey(normalizeRole(role));
      } catch {
        if (mounted) setRoleKey("unknown");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isReady]);

  const canEditLedger = useMemo(() => {
    return roleKey === "owner" || roleKey === "admin";
  }, [roleKey]);

  const {
    departments,
    activeDepartmentId,
    addDepartment,
    updateDepartment,
    toggleDepartment,
    deleteDepartment,
    setActiveDepartmentId,
  } = useDepartments();

  // 쿼리에서 AI 프리필 파싱
  const ledgerPrefill = useMemo(() => {
    return parseLedgerPrefill(searchParams);
  }, [searchParams]);

  // 프리필이 있으면 해당 부서 카드 자동 펼침
  // - React 경고(Effect에서 setState 동기 호출) 회피: microtask로 밀기
  useEffect(() => {
    if (!ledgerPrefill?.departmentId) return;

    queueMicrotask(() => {
      setActiveDepartmentId(ledgerPrefill.departmentId);
    });
  }, [ledgerPrefill?.departmentId, setActiveDepartmentId]);

  // 소비했으면 URL에서 쿼리 제거(재적용 방지)
  useEffect(() => {
    if (!ledgerPrefill) return;

    // departments 페이지에서만 실행되는 container라, 그냥 /departments 로 정리
    // (혹시 다른 query를 유지하고 싶으면 여기 로직을 바꿔야 함)
    router.replace("/departments");
  }, [ledgerPrefill, router]);

  if (!isReady) return null;

  return (
    <UI.Page
      onBack={() => router.push("/main")}
      title={DEPARTMENT_PAGE_COPY.title}
      description={DEPARTMENT_PAGE_COPY.description}
      emptyText={DEPARTMENT_PAGE_COPY.empty}
      addButtonText={DEPARTMENT_PAGE_COPY.addButton}
      departments={departments}
      activeDepartmentId={activeDepartmentId}
      onAdd={addDepartment}
      onToggle={toggleDepartment}
      onChange={updateDepartment}
      onDelete={deleteDepartment}
      canEditLedger={canEditLedger}
      ledgerPrefill={ledgerPrefill}
    />
  );
}
