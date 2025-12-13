"use client";

export type HistoryType = "deposit" | "order" | "debtPayment" | "payment";

export type DepartmentHistory = {
  id: string;
  type: HistoryType;
  amount: number;
  memo?: string;
  date: string; // ISO string
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

/**
 * 입출금/주문/미수금 상환 기록을 추가하면서
 * 예치금(deposit) / 미수금(debt)을 자동으로 갱신한다.
 *
 * type:
 * - "deposit": 예치금 입금 → deposit += amount
 * - "order": 주문으로 차감 → deposit에서 우선 차감, 부족분은 debt(미수금)로 전환
 * - "debtPayment": 미수금 상환 → debt -= amount (0 미만은 0으로)
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

  const safeAmount = Math.max(0, Math.floor(amount));

  if (type === "deposit") {
    deposit += safeAmount;
  }

  if (type === "order") {
    if (deposit >= safeAmount) {
      // 예치금으로 전액 처리
      deposit -= safeAmount;
    } else {
      // 예치금 다 쓰고, 모자란 금액은 미수금으로
      const shortage = safeAmount - deposit;
      deposit = 0;
      debt += shortage;
    }
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
