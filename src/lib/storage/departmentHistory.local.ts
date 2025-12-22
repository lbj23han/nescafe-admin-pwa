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
