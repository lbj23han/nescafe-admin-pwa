import { supabase } from "@/lib/supabaseClient";
import { getMyProfile } from "@/lib/repositories/profile.repo";
import type {
  DepartmentHistory,
  HistoryType,
  Department,
} from "@/lib/storage/departments.local";

type DepartmentHistoryRow = {
  id: string;
  shop_id: string;
  department_id: string;
  type: string | null;
  amount: number | null;
  memo: string | null;
  created_by: string | null;
  created_at: string;
};

function isHistoryType(v: unknown): v is HistoryType {
  return (
    v === "deposit" || v === "order" || v === "debtPayment" || v === "payment"
  );
}

function toSafeAmount(amount: number) {
  return Math.max(0, Math.floor(amount));
}

function rowToHistory(r: DepartmentHistoryRow): DepartmentHistory {
  return {
    id: r.id,
    type: isHistoryType(r.type) ? r.type : "deposit",
    amount: Math.max(0, Math.floor(r.amount ?? 0)),
    memo: r.memo ?? undefined,
    date: r.created_at,
  };
}

function recomputeFromHistory(history: DepartmentHistory[]) {
  let deposit = 0;
  let debt = 0;

  for (const h of history) {
    const amt = toSafeAmount(h.amount);

    if (h.type === "deposit") {
      deposit += amt;
      continue;
    }
    if (h.type === "order") {
      if (deposit >= amt) deposit -= amt;
      else {
        const shortage = amt - deposit;
        deposit = 0;
        debt += shortage;
      }
      continue;
    }
    if (h.type === "payment") {
      deposit = Math.max(0, deposit - amt);
      continue;
    }
    if (h.type === "debtPayment") {
      debt = Math.max(0, debt - amt);
      continue;
    }
  }

  return { deposit, debt };
}

export async function getDepartmentHistory(
  departmentId: string
): Promise<DepartmentHistory[]> {
  const profile = await getMyProfile();
  if (!profile.shop_id) return [];

  const { data, error } = await supabase
    .from("department_history")
    .select("*")
    .eq("shop_id", profile.shop_id)
    .eq("department_id", departmentId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as DepartmentHistoryRow[];
  return rows.map(rowToHistory);
}

export async function updateDepartmentHistory(params: {
  departmentId: string;
  historyId: string;
  patch: Partial<Pick<DepartmentHistory, "type" | "amount" | "memo">>;
}): Promise<{
  history: DepartmentHistory;
  next: Pick<Department, "deposit" | "debt" | "history">;
}> {
  const profile = await getMyProfile();
  if (!profile.shop_id) throw new Error("No shop");

  const payload: Record<string, unknown> = {};
  if (params.patch.type !== undefined) payload.type = params.patch.type;
  if (params.patch.amount !== undefined)
    payload.amount = toSafeAmount(params.patch.amount);
  if (params.patch.memo !== undefined)
    payload.memo = params.patch.memo.trim() ? params.patch.memo.trim() : null;

  // 조건을 id + shop_id만 사용 (department_id 조건 제거)
  const { data, error } = await supabase
    .from("department_history")
    .update(payload)
    .eq("shop_id", profile.shop_id)
    .eq("id", params.historyId)
    .select("*");

  if (error) throw error;

  const rows = (data ?? []) as DepartmentHistoryRow[];
  if (rows.length !== 1) {
    throw new Error(
      `updateDepartmentHistory: expected 1 row, got ${rows.length}`
    );
  }

  const updatedDomain = rowToHistory(rows[0]);

  // 보정: history 재조회 → 재계산 → departments update
  const history = await getDepartmentHistory(params.departmentId);
  const nextAmounts = recomputeFromHistory(history);

  const { error: upErr } = await supabase
    .from("departments")
    .update({
      deposit: nextAmounts.deposit,
      debt: nextAmounts.debt,
    })
    .eq("shop_id", profile.shop_id)
    .eq("id", params.departmentId);

  if (upErr) throw upErr;

  return { history: updatedDomain, next: { ...nextAmounts, history } };
}
