"use client";

export type HistoryType = "deposit" | "order" | "debtPayment" | "payment";

export type DepartmentHistory = {
  id: string;
  type: HistoryType;
  amount: number;
  memo?: string;
  date: string;
};

export type Department = {
  id: string;
  name: string;
  deposit: number; // 예치금
  debt: number; // 미수금
  history: DepartmentHistory[];
};

const STORAGE_KEY = "nescafe-ledger-departments-v1";

function safeParseDepartments(raw: string | null): Department[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function getDepartments(): Department[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return safeParseDepartments(raw);
}

export function saveDepartments(departments: Department[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createDepartment(name: string): Department {
  return {
    id: generateId("dept"),
    name,
    deposit: 0,
    debt: 0,
    history: [],
  };
}

function toSafeAmount(amount: number) {
  return Math.max(0, Math.floor(amount));
}

/**
 * history 배열을 기준으로 deposit/debt를 "처음부터" 다시 계산한다.
 * - deposit: 예치금 입금
 * - order: 예치금 우선 차감 + 부족분은 debt로 전환
 * - debtPayment: 미수금 상환 (0 미만 방지)
 * - payment: 예치금만 차감 (debt 전환 없음)
 */
export function recomputeDepartment(department: Department): Department {
  let deposit = 0;
  let debt = 0;

  for (const h of department.history) {
    const amt = toSafeAmount(h.amount);

    if (h.type === "deposit") {
      deposit += amt;
      continue;
    }

    if (h.type === "order") {
      if (deposit >= amt) {
        deposit -= amt;
      } else {
        const shortage = amt - deposit;
        deposit = 0;
        debt += shortage;
      }
      continue;
    }

    if (h.type === "payment") {
      // 예치금만 차감 (미수금 전환 없음)
      deposit = Math.max(0, deposit - amt);
      continue;
    }

    if (h.type === "debtPayment") {
      debt = Math.max(0, debt - amt);
      continue;
    }
  }

  return { ...department, deposit, debt };
}

/**
 * 기록 추가하면서 deposit/debt 갱신(기존 로직 유지)
 */
export function addHistory(
  department: Department,
  type: HistoryType,
  amount: number,
  memo?: string,
  date?: string
): Department {
  let deposit = department.deposit;
  let debt = department.debt;

  const safeAmount = toSafeAmount(amount);

  if (type === "deposit") {
    deposit += safeAmount;
  }

  if (type === "order") {
    if (deposit >= safeAmount) {
      deposit -= safeAmount;
    } else {
      const shortage = safeAmount - deposit;
      deposit = 0;
      debt += shortage;
    }
  }

  if (type === "payment") {
    deposit = Math.max(0, deposit - safeAmount);
  }

  if (type === "debtPayment") {
    debt = Math.max(0, debt - safeAmount);
  }

  const history: DepartmentHistory = {
    id: generateId("hist"),
    type,
    amount: safeAmount,
    memo,
    date: date ?? new Date().toISOString(),
  };

  return {
    ...department,
    deposit,
    debt,
    history: [...department.history, history],
  };
}

/**
 * 내역 1건 수정 (종류/금액/메모)
 * - history 항목을 업데이트한 후
 * - history 전체 기준으로 deposit/debt를 재계산한다.
 */
export function updateHistory(
  department: Department,
  historyId: string,
  patch: Partial<Pick<DepartmentHistory, "type" | "amount" | "memo">>
): Department {
  const nextHistory = department.history.map((h) => {
    if (h.id !== historyId) return h;

    const nextAmount =
      patch.amount === undefined ? h.amount : toSafeAmount(patch.amount);

    const nextMemo =
      patch.memo === undefined ? h.memo : patch.memo.trim() || undefined;

    const nextType = patch.type ?? h.type;

    return {
      ...h,
      type: nextType,
      amount: nextAmount,
      memo: nextMemo,
    };
  });

  return recomputeDepartment({ ...department, history: nextHistory });
}

/**
 * 부서명 수정
 */
export function renameDepartment(
  department: Department,
  name: string
): Department {
  const trimmed = name.trim();
  if (!trimmed) return department;
  return { ...department, name: trimmed };
}
