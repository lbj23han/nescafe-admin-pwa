import { supabase } from "@/lib/supabaseClient";
import { getMyProfileFromClient } from "@/lib/repositories/profile.client";
import type {
  DepartmentHistory,
  HistoryType,
  Department,
} from "@/lib/storage/departments.local";
import type { SettlementType } from "@/lib/domain/reservation";

type DepartmentHistoryRow = {
  id: string;
  shop_id: string;
  department_id: string;
  type: string | null;
  amount: number | null;
  memo: string | null;
  created_by: string | null;
  created_at: string;

  source_type?: string | null;
  source_id?: string | null;
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
  const profile = await getMyProfileFromClient();
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

/**
 * 예약 완료 정산 반영 (자동)
 *
 * settleType -> history.type 매핑:
 * - deposit => 'deposit' (예치금 입금)
 * - debt    => 'order'   (예치금 우선 차감 + 부족분은 debt로 전환)
 *
 * 중복 방지:
 * - source_type='reservation', source_id=reservationId
 * - DB unique index (shop_id, source_id) where source_type='reservation' 로 1회만 허용
 */
export async function addReservationSettlementHistory(params: {
  reservationId: string;
  departmentId: string;
  settleType: SettlementType; // deposit | debt
  amount: number;
  memo?: string;
}): Promise<{
  history: DepartmentHistory;
  next: Pick<Department, "deposit" | "debt" | "history">;
}> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) throw userErr;
  if (!user) throw new Error("Not authenticated");

  const memo = params.memo?.trim();

  const mappedType: HistoryType =
    params.settleType === "deposit" ? "deposit" : "order";

  const { data, error } = await supabase
    .from("department_history")
    .insert({
      shop_id: profile.shop_id,
      department_id: params.departmentId,
      type: mappedType,
      amount: toSafeAmount(params.amount),
      memo: memo ? memo : null,
      created_by: user.id,

      source_type: "reservation",
      source_id: params.reservationId,
    })
    .select("*")
    .single();

  if (error) throw error;

  const inserted = rowToHistory(data as DepartmentHistoryRow);

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

  return { history: inserted, next: { ...nextAmounts, history } };
}

// ---- 기존 수동 입력 API 유지 ----

export async function addDepartmentHistory(params: {
  departmentId: string;
  type: HistoryType;
  amount: number;
  memo?: string;
}): Promise<{
  history: DepartmentHistory;
  next: Pick<Department, "deposit" | "debt" | "history">;
}> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) throw userErr;
  if (!user) throw new Error("Not authenticated");

  const memo = params.memo?.trim();

  const { data, error } = await supabase
    .from("department_history")
    .insert({
      shop_id: profile.shop_id,
      department_id: params.departmentId,
      type: params.type,
      amount: toSafeAmount(params.amount),
      memo: memo ? memo : null,
      created_by: user.id,
    })
    .select("*")
    .single();

  if (error) throw error;

  const inserted = rowToHistory(data as DepartmentHistoryRow);

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

  return { history: inserted, next: { ...nextAmounts, history } };
}

export async function updateDepartmentHistory(params: {
  departmentId: string;
  historyId: string;
  patch: Partial<Pick<DepartmentHistory, "type" | "amount" | "memo">>;
}): Promise<{
  history: DepartmentHistory;
  next: Pick<Department, "deposit" | "debt" | "history">;
}> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  const payload: Record<string, unknown> = {};
  if (params.patch.type !== undefined) payload.type = params.patch.type;
  if (params.patch.amount !== undefined)
    payload.amount = toSafeAmount(params.patch.amount);
  if (params.patch.memo !== undefined)
    payload.memo = params.patch.memo.trim() ? params.patch.memo.trim() : null;

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

export async function deleteDepartmentHistory(params: {
  departmentId: string;
  historyId: string;
}): Promise<{
  next: Pick<Department, "deposit" | "debt" | "history">;
}> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  const { error } = await supabase
    .from("department_history")
    .delete()
    .eq("shop_id", profile.shop_id)
    .eq("id", params.historyId);

  if (error) throw error;

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

  return { next: { ...nextAmounts, history } };
}
