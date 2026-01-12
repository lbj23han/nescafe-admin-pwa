import { STORAGE_KEYS } from "@/constants/config";
import type {
  Reservation,
  ReservationStatus,
  SettlementType,
} from "@/lib/domain/reservation";

const STORAGE_KEY = STORAGE_KEYS.reservations;

type ReservationStore = Record<string, Reservation[]>;

export type ReservationForCalendar = Reservation & { date: string };

function isStatus(v: unknown): v is ReservationStatus {
  return v === "pending" || v === "completed";
}

function isSettlementType(v: unknown): v is SettlementType {
  return v === "deposit" || v === "debt";
}

function normalizeReservation(raw: unknown): Reservation | null {
  if (!raw || typeof raw !== "object") return null;

  const r = raw as Record<string, unknown>;

  const id = typeof r.id === "string" ? r.id : null;
  if (!id) return null;

  const department = typeof r.department === "string" ? r.department : "";
  const menu = typeof r.menu === "string" ? r.menu : "";

  const amount =
    typeof r.amount === "number"
      ? r.amount
      : typeof r.amount === "string" && r.amount.trim() !== ""
      ? Number(r.amount)
      : undefined;

  const time = typeof r.time === "string" ? r.time : undefined;
  const location = typeof r.location === "string" ? r.location : undefined;
  const memo = typeof r.memo === "string" ? r.memo : undefined;

  const status: ReservationStatus = isStatus(r.status) ? r.status : "pending";

  const settleType: SettlementType | null = isSettlementType(r.settleType)
    ? r.settleType
    : null;

  return {
    id,
    department,
    menu,
    amount: Number.isFinite(amount as number) ? (amount as number) : undefined,
    time,
    location,
    memo,
    status,
    settleType,
  };
}

function loadAllUnknown(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
}

function saveAll(store: ReservationStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function readList(all: Record<string, unknown>, date: string): Reservation[] {
  const rawList = all[date];
  if (!Array.isArray(rawList)) return [];
  return rawList
    .map(normalizeReservation)
    .filter((v): v is Reservation => v !== null);
}

export function loadReservationsByDate(date: string): Reservation[] {
  const all = loadAllUnknown();
  return readList(all, date);
}

/**
 * 캘린더 전용: date range를 한 번에 로드 (localStorage에서 합쳐서 반환)
 * - from/to: YYYY-MM-DD (inclusive)
 * - 반환: Reservation + { date }
 */
export async function loadReservationsByDateRange(
  from: string,
  to: string
): Promise<ReservationForCalendar[]> {
  console.log("[LocalRepo] loadReservationsByDateRange", from, to);

  const allUnknown = loadAllUnknown();

  const dates = Object.keys(allUnknown)
    .filter((k) => typeof k === "string" && k.length === 10)
    .filter((date) => date >= from && date <= to)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  const out: ReservationForCalendar[] = [];

  for (const date of dates) {
    const list = readList(allUnknown, date);
    for (const r of list) {
      out.push({ ...r, date });
    }
  }

  return out;
}

export function saveReservation(
  date: string,
  reservation: Reservation
): Reservation {
  const allUnknown = loadAllUnknown();
  const currentList = readList(allUnknown, date);

  const withStatus: Reservation = {
    ...reservation,
    status: reservation.status ?? "pending",
    settleType: reservation.settleType ?? null,
  };

  const nextStore: ReservationStore = {
    ...(allUnknown as unknown as ReservationStore),
    [date]: [...currentList, withStatus],
  };

  saveAll(nextStore);
  return withStatus;
}

export function updateReservation(
  date: string,
  reservation: Reservation
): Reservation {
  const allUnknown = loadAllUnknown();
  const currentList = readList(allUnknown, date);

  const next = currentList.map((r) =>
    r.id === reservation.id ? reservation : r
  );

  const nextStore: ReservationStore = {
    ...(allUnknown as unknown as ReservationStore),
    [date]: next,
  };

  saveAll(nextStore);
  return reservation;
}

export function setReservationStatus(
  date: string,
  id: string,
  status: ReservationStatus
): Reservation | null {
  const allUnknown = loadAllUnknown();
  const currentList = readList(allUnknown, date);

  let updated: Reservation | null = null;

  const next = currentList.map((r) => {
    if (r.id !== id) return r;
    updated = { ...r, status };
    return updated;
  });

  const nextStore: ReservationStore = {
    ...(allUnknown as unknown as ReservationStore),
    [date]: next,
  };

  saveAll(nextStore);
  return updated;
}

export function deleteReservation(date: string, id: string): void {
  const allUnknown = loadAllUnknown();
  const currentList = readList(allUnknown, date);

  const next = currentList.filter((r) => r.id !== id);

  const nextStore: ReservationStore = {
    ...(allUnknown as unknown as ReservationStore),
  };

  if (next.length > 0) {
    nextStore[date] = next;
  } else {
    delete nextStore[date];
  }

  saveAll(nextStore);
}
