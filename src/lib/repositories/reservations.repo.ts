import { supabase } from "@/lib/supabaseClient";
import { getMyProfile } from "./profile.repo";

export type Reservation = {
  id: string;
  shop_id: string;
  date: string; // YYYY-MM-DD
  department_id: string | null;
  menu: string | null;
  amount: number;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

export type ReservationInput = {
  date: string;
  department_id?: string | null;
  menu?: string | null;
  amount?: number;
  memo?: string | null;
};

export async function listReservationsByDate(
  date: string
): Promise<Reservation[]> {
  const profile = await getMyProfile();
  if (!profile.shop_id) return [];

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("shop_id", profile.shop_id)
    .eq("date", date)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Reservation[];
}

export async function createReservation(
  input: ReservationInput
): Promise<Reservation> {
  const profile = await getMyProfile();
  if (!profile.shop_id) throw new Error("No shop");

  const { data, error } = await supabase
    .from("reservations")
    .insert({
      shop_id: profile.shop_id,
      date: input.date,
      department_id: input.department_id ?? null,
      menu: input.menu ?? null,
      amount: input.amount ?? 0,
      memo: input.memo ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Reservation;
}

export async function updateReservation(
  id: string,
  patch: Partial<Omit<ReservationInput, "date">> & { date?: string }
): Promise<Reservation> {
  const profile = await getMyProfile();
  if (!profile.shop_id) throw new Error("No shop");

  const { data, error } = await supabase
    .from("reservations")
    .update({
      ...(patch.date !== undefined ? { date: patch.date } : {}),
      ...(patch.department_id !== undefined
        ? { department_id: patch.department_id }
        : {}),
      ...(patch.menu !== undefined ? { menu: patch.menu } : {}),
      ...(patch.amount !== undefined ? { amount: patch.amount ?? 0 } : {}),
      ...(patch.memo !== undefined ? { memo: patch.memo ?? null } : {}),
    })
    .eq("id", id)
    .eq("shop_id", profile.shop_id)
    .select("*")
    .single();

  if (error) throw error;
  return data as Reservation;
}

export async function deleteReservation(id: string): Promise<void> {
  const profile = await getMyProfile();
  if (!profile.shop_id) throw new Error("No shop");

  const { error } = await supabase
    .from("reservations")
    .delete()
    .eq("id", id)
    .eq("shop_id", profile.shop_id);

  if (error) throw error;
}
