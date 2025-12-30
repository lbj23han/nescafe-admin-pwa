import { FLAGS } from "@/constants/flags";

// supabase repos
import * as DeptRemote from "@/lib/repositories/departments.repo";
import * as DeptHistoryRemote from "@/lib/repositories/departmentHistory.repo";
import * as ResRemote from "@/lib/repositories/reservations.repo";

// local repos
import * as DeptLocal from "@/lib/storage/departments.local";
import * as DeptHistoryLocal from "@/lib/storage/departmentHistory.local";
import * as ResLocal from "@/lib/storage/reservations.local";

import type {
  Department,
  DepartmentHistory,
  HistoryType,
} from "@/lib/storage/departments.local";

/* =========================================================
 * Departments repo contract (훅에서 쓰는 것만 고정)
 * ======================================================= */

export type DepartmentsRepoContract = {
  getDepartments: () => Promise<Department[]>;
  createDepartment: (name: string) => Promise<Department>;
  deleteDepartment: (id: string) => Promise<void>;

  // ✅ useNameEditor가 필요
  renameDepartment: (
    department: Department,
    name: string
  ) => Promise<Department>;
};

/** local adapter */
const DeptLocalAdapter: DepartmentsRepoContract = {
  async getDepartments() {
    return DeptLocal.getDepartments();
  },

  async createDepartment(name: string) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Department name required");

    const created = DeptLocal.createDepartment(trimmed);
    const next = [...DeptLocal.getDepartments(), created];
    DeptLocal.saveDepartments(next);
    return created;
  },

  async deleteDepartment(id: string) {
    const next = DeptLocal.getDepartments().filter((d) => d.id !== id);
    DeptLocal.saveDepartments(next);
  },

  async renameDepartment(department: Department, name: string) {
    const nextDept = DeptLocal.renameDepartment(department, name);

    // storage 반영까지 여기서 해줘야 "새로고침 유지"
    const all = DeptLocal.getDepartments();
    const next = all.map((d) => (d.id === nextDept.id ? nextDept : d));
    DeptLocal.saveDepartments(next);

    return nextDept;
  },
};

/** remote adapter (캐스팅) */
const DeptRemoteAdapter = DeptRemote as unknown as DepartmentsRepoContract;

export const DepartmentsRepo: DepartmentsRepoContract = FLAGS.useSupabase
  ? DeptRemoteAdapter
  : DeptLocalAdapter;

/* =========================================================
 * DepartmentHistory repo contract (훅에서 쓰는 것만 고정)
 * ======================================================= */

export type DepartmentHistoryRepoContract = {
  getDepartmentHistory: (departmentId: string) => Promise<DepartmentHistory[]>;

  addDepartmentHistory: (params: {
    departmentId: string;
    type: HistoryType;
    amount: number;
    memo?: string;
  }) => Promise<{
    history: DepartmentHistory;
    next: Pick<Department, "deposit" | "debt" | "history">;
  }>;

  updateDepartmentHistory: (params: {
    departmentId: string;
    historyId: string;
    patch: Partial<Pick<DepartmentHistory, "type" | "amount" | "memo">>;
  }) => Promise<{
    history: DepartmentHistory;
    next: Pick<Department, "deposit" | "debt" | "history">;
  }>;

  deleteDepartmentHistory: (params: {
    departmentId: string;
    historyId: string;
  }) => Promise<{
    next: Pick<Department, "deposit" | "debt" | "history">;
  }>;
};

/** local adapter는 이미 departmentId 기반으로 구현돼 있어서 그대로 캐스팅 가능 */
const DeptHistoryLocalAdapter =
  DeptHistoryLocal as unknown as DepartmentHistoryRepoContract;

/** remote adapter도 그대로 캐스팅 가능 */
const DeptHistoryRemoteAdapter: DepartmentHistoryRepoContract = {
  getDepartmentHistory: DeptHistoryRemote.getDepartmentHistory,
  addDepartmentHistory: DeptHistoryRemote.addDepartmentHistory,
  updateDepartmentHistory: DeptHistoryRemote.updateDepartmentHistory,
  deleteDepartmentHistory: DeptHistoryRemote.deleteDepartmentHistory,
};
export const DepartmentHistoryRepo: DepartmentHistoryRepoContract =
  FLAGS.useSupabase ? DeptHistoryRemoteAdapter : DeptHistoryLocalAdapter;

/* =========================================================
 * Reservations (기존 방식 유지)
 * ======================================================= */
export const ReservationsRepo = FLAGS.useSupabase ? ResRemote : ResLocal;
