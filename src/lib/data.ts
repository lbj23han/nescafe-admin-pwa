import { FLAGS } from "@/constants/flags";

// supabase repos
import * as DeptRemote from "@/lib/repositories/departments.repo";
import * as ResRemote from "@/lib/repositories/reservations.repo";

// local storage (네 기존 코드 옮겨서 export만 맞추면 됨)
import * as DeptLocal from "@/lib/storage/departments.local";
import * as ResLocal from "@/lib/storage/reservations.local";

export const DepartmentsRepo = FLAGS.useSupabase ? DeptRemote : DeptLocal;
export const ReservationsRepo = FLAGS.useSupabase ? ResRemote : ResLocal;
