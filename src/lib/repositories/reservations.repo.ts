import { supabase } from "@/lib/supabaseClient";
import { getMyProfileFromClient } from "@/lib/repositories/profile.client";
import type {
  Reservation,
  ReservationStatus,
  SettlementType,
} from "@/lib/domain/reservation";

type ReservationRow = {
  id: string;

  shop_id: string;
  date: string;

  department_id: string | null;
  department: string | null;

  menu: string | null;
  amount: number | null;

  time: string | null;
  location: string | null;

  memo: string | null;
  status: ReservationStatus | null;

  settle_type: SettlementType | null;

  created_at: string;
  updated_at: string;
};

export type ReservationForCalendar = Reservation & { date: string };

function rowToReservation(r: ReservationRow): Reservation {
  return {
    id: r.id,
    department: r.department ?? "",
    menu: r.menu ?? "",
    amount: r.amount ?? undefined,
    time: r.time ?? undefined,
    location: r.location ?? undefined,
    memo: r.memo ?? undefined,
    status: r.status ?? "pending",
    settleType: r.settle_type ?? null,
  };
}

function rowToReservationForCalendar(
  r: ReservationRow
): ReservationForCalendar {
  return {
    ...rowToReservation(r),
    date: r.date,
  };
}

export async function loadReservationsByDate(
  date: string
): Promise<Reservation[]> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) return [];

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("shop_id", profile.shop_id)
    .eq("date", date)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as ReservationRow[];
  return rows.map(rowToReservation);
}

/**
 * 캘린더 전용: date range를 한 번에 로드 (성능 목적)
 * - from/to: YYYY-MM-DD (inclusive)
 * - 반환: Reservation + { date }
 */
export async function loadReservationsByDateRange(
  from: string,
  to: string
): Promise<ReservationForCalendar[]> {
  console.log("[SupabaseRepo] loadReservationsByDateRange", from, to);

  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) return [];

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("shop_id", profile.shop_id)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as ReservationRow[];
  return rows.map(rowToReservationForCalendar);
}

export async function saveReservation(
  date: string,
  reservation: Reservation
): Promise<Reservation> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  const { data, error } = await supabase
    .from("reservations")
    .insert({
      shop_id: profile.shop_id,
      date,

      // TODO(task5): department(string) -> department_id 매핑 후 연동
      department_id: null,
      department: reservation.department ?? "",

      menu: reservation.menu ?? null,
      amount: reservation.amount ?? null,
      time: reservation.time ?? "",
      location: reservation.location ?? "",

      memo: reservation.memo ?? null,
      status: reservation.status ?? "pending",

      // pending 생성에서는 보통 null
      settle_type: reservation.settleType ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return rowToReservation(data as ReservationRow);
}

export async function updateReservation(
  date: string,
  reservation: Reservation
): Promise<Reservation> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  const { data, error } = await supabase
    .from("reservations")
    .update({
      date,

      // TODO(task5): department_id 연결되면 유지/수정 가능
      department_id: null,
      department: reservation.department ?? "",

      menu: reservation.menu ?? null,
      amount: reservation.amount ?? null,
      time: reservation.time ?? "",
      location: reservation.location ?? "",

      memo: reservation.memo ?? null,

      status: reservation.status ?? "pending",
      settle_type: reservation.settleType ?? null,
    })
    .eq("id", reservation.id)
    .eq("shop_id", profile.shop_id)
    .select("*")
    .single();

  if (error) throw error;
  return rowToReservation(data as ReservationRow);
}

export async function setReservationStatus(
  date: string, // 로컬 시그니처 유지용 (쿼리엔 필요 없음)
  id: string,
  status: ReservationStatus
): Promise<Reservation> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  const { data, error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id)
    .eq("shop_id", profile.shop_id)
    .select("*")
    .single();

  if (error) throw error;
  return rowToReservation(data as ReservationRow);
}

/**
 * 완료 처리 전용 API
 * - status=completed로 변경
 * - (선택) settle_type 저장
 *
 * NOTE:
 * - direct input 예약은 settleType이 없어도 완료 가능
 * - ledger 연동 예약은 task5 이후에 department_id 기반으로 settleType 필수 강제 예정
 */
export async function completeReservation(
  date: string, // 로컬 시그니처 유지용
  id: string,
  params?: { settleType?: SettlementType | null }
): Promise<Reservation> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  const patch: Partial<Pick<ReservationRow, "status" | "settle_type">> = {
    status: "completed",
  };

  if ("settleType" in (params ?? {})) {
    patch.settle_type = params?.settleType ?? null;
  }

  const { data, error } = await supabase
    .from("reservations")
    .update(patch)
    .eq("id", id)
    .eq("shop_id", profile.shop_id)
    .select("*")
    .single();

  if (error) throw error;
  return rowToReservation(data as ReservationRow);
}

export async function deleteReservation(
  date: string,
  id: string
): Promise<void> {
  const profile = await getMyProfileFromClient();
  if (!profile.shop_id) throw new Error("No shop");

  const { error } = await supabase
    .from("reservations")
    .delete()
    .eq("id", id)
    .eq("shop_id", profile.shop_id);

  if (error) throw error;
}
