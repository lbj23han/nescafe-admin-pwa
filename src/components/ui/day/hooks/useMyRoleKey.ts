"use client";

import { useEffect, useMemo, useState } from "react";
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

export function useMyRoleKey(isReady: boolean) {
  const [roleKey, setRoleKey] = useState<string>("unknown");

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

  const canManageActions = useMemo(() => {
    return roleKey === "owner" || roleKey === "admin";
  }, [roleKey]);

  return { roleKey, canManageActions };
}
