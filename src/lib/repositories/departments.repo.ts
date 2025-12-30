import { supabase } from "@/lib/supabaseClient";
import { getMyProfileFromClient } from "@/lib/repositories/profile.client";
import type {
  Department,
  DepartmentHistory,
  HistoryType,
} from "@/lib/storage/departments.local";

/**
 * Supabase rows
 */
type DepartmentRow = {
  id: string;
  shop_id: string;
  name: string | null;
  memo: string | null;
  deposit: number | null;
  debt: number | null;
  created_at: string;
  updated_at: string;
};

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

function rowToHistory(r: DepartmentHistoryRow): DepartmentHistory {
  return {
    id: r.id,
    type: isHistoryType(r.type) ? r.type : "deposit",
    amount: Math.max(0, Math.floor(r.amount ?? 0)),
    memo: r.memo ?? undefined,
    date: r.created_at,
  };
}

function rowToDepartment(
  r: DepartmentRow,
  history: DepartmentHistory[] = []
): Department {
  return {
    id: r.id,
    name: (r.name ?? "").trim(),
    deposit: r.deposit ?? 0,
    debt: r.debt ?? 0,
    history,
  };
}

function toSafeAmount(amount: number) {
  return Math.max(0, Math.floor(amount));
}

/**
 * departments + (latest histories) 2쿼리로 병합해서 반환
 * - UI 최소 수정 위해 Department.history를 채워서 내려줌
 * - 기본은 "최근 50개"까지 (필요하면 조정)
 */
export async function getDepartments(): Promise<Department[]> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) return [];

  const { data: deptData, error: deptError } = await supabase
    .from("departments")
    .select("*")
    .eq("shop_id", profile.shop_id)
    .order("created_at", { ascending: true });

  if (deptError) throw deptError;

  const deptRows = (deptData ?? []) as DepartmentRow[];
  if (deptRows.length === 0) return [];

  const deptIds = deptRows.map((d) => d.id);

  // history를 한 번에 가져와서 department_id로 묶음 (N+1 방지)
  const { data: histData, error: histError } = await supabase
    .from("department_history")
    .select("*")
    .eq("shop_id", profile.shop_id)
    .in("department_id", deptIds)
    .order("created_at", { ascending: true }); // 로컬은 오래된→최신 순으로 쌓임

  if (histError) throw histError;

  const histRows = (histData ?? []) as DepartmentHistoryRow[];
  const map = new Map<string, DepartmentHistory[]>();
  for (const r of histRows) {
    const list = map.get(r.department_id) ?? [];
    list.push(rowToHistory(r));
    map.set(r.department_id, list);
  }

  return deptRows.map((d) => rowToDepartment(d, map.get(d.id) ?? []));
}

/**
 * 로컬 repo에 있던 saveDepartments와 시그니처 맞추기용.
 * Supabase에서는 bulk save가 정책/충돌 위험이 커서 noop 처리.
 * (Facade에서 호출 안 하게끔 useDepartments 훅을 repo 기준으로 바꿀 예정)
 */
export function saveDepartments(_departments: Department[]): void {
  // noop
}

/**
 *부서 생성: insert 후 Department 반환
 * - deposit/debt는 0으로 시작
 */
export async function createDepartment(name: string): Promise<Department> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  const trimmed = name.trim();
  if (!trimmed) throw new Error("Department name required");

  const { data, error } = await supabase
    .from("departments")
    .insert({
      shop_id: profile.shop_id,
      name: trimmed,
      memo: null,
      deposit: 0,
      debt: 0,
    })
    .select("*")
    .single();

  if (error) throw error;

  return rowToDepartment(data as DepartmentRow, []);
}

/**
 *부서명 수정
 * (로컬: renameDepartment는 pure function이지만, remote에서는 update)
 */
export async function renameDepartment(
  department: Department,
  name: string
): Promise<Department> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  const trimmed = name.trim();
  if (!trimmed) return department;

  const { data, error } = await supabase
    .from("departments")
    .update({ name: trimmed })
    .eq("id", department.id)
    .eq("shop_id", profile.shop_id)
    .select("*")
    .single();

  if (error) throw error;

  // history는 기존 것을 유지
  return rowToDepartment(data as DepartmentRow, department.history ?? []);
}

/**
 *부서 삭제 (hard delete)
 * - history는 FK가 있으면 cascade / 없으면 먼저 지워야 함
 * - 정책 불명이라 기본은: history 먼저 삭제 -> department 삭제
 */
export async function deleteDepartment(id: string): Promise<void> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  // history 선삭제 (FK cascade면 이 쿼리는 없어도 됨)
  const { error: hErr } = await supabase
    .from("department_history")
    .delete()
    .eq("shop_id", profile.shop_id)
    .eq("department_id", id);

  if (hErr) throw hErr;

  const { error } = await supabase
    .from("departments")
    .delete()
    .eq("id", id)
    .eq("shop_id", profile.shop_id);

  if (error) throw error;
}

/**
 * deposit/debt를 직접 업데이트해야 하는 경우
 * - UI에서 department 전체를 던져서 갱신할 수도 있으니 유틸로 제공
 */
export async function updateDepartmentAmounts(
  id: string,
  patch: Partial<Pick<Department, "deposit" | "debt">>
): Promise<void> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  const payload: Record<string, unknown> = {};
  if (patch.deposit !== undefined)
    payload.deposit = toSafeAmount(patch.deposit);
  if (patch.debt !== undefined) payload.debt = toSafeAmount(patch.debt);

  const { error } = await supabase
    .from("departments")
    .update(payload)
    .eq("id", id)
    .eq("shop_id", profile.shop_id);

  if (error) throw error;
}
