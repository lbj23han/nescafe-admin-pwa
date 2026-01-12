import {
  getDepartments,
  saveDepartments,
  addHistory,
  updateHistory,
  recomputeDepartment,
  type Department,
  type DepartmentHistory,
  type HistoryType,
} from "./departments.local";

function findDept(id: string): Department {
  const dept = getDepartments().find((d) => d.id === id);
  if (!dept) throw new Error("Department not found");
  return dept;
}

function writeDept(nextDept: Department) {
  const all = getDepartments();
  const next = all.map((d) => (d.id === nextDept.id ? nextDept : d));
  saveDepartments(next);
  return nextDept;
}

export async function addDepartmentHistory(params: {
  departmentId: string;
  type: HistoryType;
  amount: number;
  memo?: string;
}) {
  const dept = findDept(params.departmentId);
  const nextDept = addHistory(dept, params.type, params.amount, params.memo);
  writeDept(nextDept);

  return {
    history: nextDept.history[nextDept.history.length - 1],
    next: {
      deposit: nextDept.deposit,
      debt: nextDept.debt,
      history: nextDept.history,
    },
  };
}

/**
 * 예약 완료 정산 반영 (local wrapper)
 *
 * settleType -> history.type 매핑:
 * - deposit => 'deposit'
 * - debt    => 'order'  (예치금 차감 + 부족분 debt 전환)
 *
 * NOTE:
 * - localStorage는 source_type/source_id 컬럼이 없으므로
 *   "중복 반영 방지"는 개발 중 편의상 보장하지 않음(실서비스는 Supabase unique index로 보장).
 */
export async function addReservationSettlementHistory(params: {
  reservationId: string; // local에서는 사용하지 않음(시그니처 맞춤용)
  departmentId: string;
  settleType: "deposit" | "debt";
  amount: number;
  memo?: string;
}) {
  const mappedType: HistoryType =
    params.settleType === "deposit" ? "deposit" : "order";

  return addDepartmentHistory({
    departmentId: params.departmentId,
    type: mappedType,
    amount: params.amount,
    memo: params.memo,
  });
}

export async function updateDepartmentHistory(params: {
  departmentId: string;
  historyId: string;
  patch: Partial<Pick<DepartmentHistory, "type" | "amount" | "memo">>;
}) {
  const dept = findDept(params.departmentId);
  const nextDept = updateHistory(dept, params.historyId, params.patch);
  writeDept(nextDept);

  const updated = nextDept.history.find((h) => h.id === params.historyId);
  if (!updated) throw new Error("History not found");

  return {
    history: updated,
    next: {
      deposit: nextDept.deposit,
      debt: nextDept.debt,
      history: nextDept.history,
    },
  };
}

export async function deleteDepartmentHistory(params: {
  departmentId: string;
  historyId: string;
}) {
  const dept = findDept(params.departmentId);

  const nextDept = recomputeDepartment({
    ...dept,
    history: dept.history.filter((h) => h.id !== params.historyId),
  });

  writeDept(nextDept);

  return {
    next: {
      deposit: nextDept.deposit,
      debt: nextDept.debt,
      history: nextDept.history,
    },
  };
}
