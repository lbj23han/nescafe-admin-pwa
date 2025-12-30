"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { DepartmentPageUI as UI } from "@/components/ui/departments/DepartmentPage.view";
import { DEPARTMENT_PAGE_COPY } from "@/constants/departments/page";
import { useDepartments } from "@/hooks/useDepartment";
import { supabase } from "@/lib/supabaseClient";

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

export function DepartmentPageContainer() {
  const isReady = useAuthGuard();
  const router = useRouter();

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
  } = useDepartments();

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
    />
  );
}
