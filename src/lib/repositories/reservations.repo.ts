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
    departmentId: r.department_id ?? null,
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

      department_id: reservation.departmentId ?? null,
      department: reservation.department ?? "",

      menu: reservation.menu ?? null,
      amount: reservation.amount ?? null,
      time: reservation.time ?? "",
      location: reservation.location ?? "",

      memo: reservation.memo ?? null,
      status: reservation.status ?? "pending",

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

      department_id: reservation.departmentId ?? null,
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
  date: string,
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

export async function completeReservation(
  date: string,
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
