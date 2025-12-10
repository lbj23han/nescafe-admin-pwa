// lib/storage.ts
import { STORAGE_KEYS } from "@/constants/config";
const STORAGE_KEY = STORAGE_KEYS.reservations;

export type ReservationStatus = "pending" | "completed";

export type Reservation = {
  id: string;
  department: string;
  menu: string;
  amount?: number;
  time?: string;
  location?: string;
  status: ReservationStatus; // ✅ v1 이전 데이터 호환 위해 optional
};

type ReservationStore = Record<string, Reservation[]>;

function loadAll(): ReservationStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as ReservationStore;
  } catch {
    return {};
  }
}

function saveAll(store: ReservationStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function loadReservationsByDate(date: string): Reservation[] {
  const all = loadAll();
  const list = all[date] ?? [];
  // ✅ 예전 데이터(status 없는 것)를 pending으로 취급
  return list.map((r) => ({
    ...r,
    status: r.status ?? "pending",
  }));
}

export function saveReservation(date: string, reservation: Reservation) {
  const all = loadAll();
  const list = all[date] ?? [];

  const withStatus: Reservation = {
    ...reservation,
    status: reservation.status ?? "pending",
  };

  all[date] = [...list, withStatus];
  saveAll(all);
}

// ✅ 완료/미완료 상태 변경
export function setReservationStatus(
  date: string,
  id: string,
  status: ReservationStatus
) {
  const all = loadAll();
  const list = all[date] ?? [];
  const next = list.map((r) => (r.id === id ? { ...r, status } : r));
  all[date] = next;
  saveAll(all);
}

// ✅ 예약 삭제 (취소)
export function deleteReservation(date: string, id: string) {
  const all = loadAll();
  const list = all[date] ?? [];
  const next = list.filter((r) => r.id !== id);

  if (next.length > 0) {
    all[date] = next;
  } else {
    delete all[date];
  }
  saveAll(all);
}
