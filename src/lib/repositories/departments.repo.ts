import { supabase } from "@/lib/supabaseClient";
import { getMyProfile } from "./profile.repo";

export type Department = {
  id: string;
  shop_id: string;
  name: string;
  memo: string | null;
  deposit: number;
  debt: number;
  created_at: string;
  updated_at: string;
};

export type DepartmentInput = {
  name: string;
  memo?: string;
  deposit?: number;
  debt?: number;
};

export async function listDepartments(): Promise<Department[]> {
  const profile = await getMyProfile();
  if (!profile.shop_id) return [];

  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("shop_id", profile.shop_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Department[];
}

export async function createDepartment(
  input: DepartmentInput
): Promise<Department> {
  const profile = await getMyProfile();
  if (!profile.shop_id) throw new Error("No shop");

  const { data, error } = await supabase
    .from("departments")
    .insert({
      shop_id: profile.shop_id,
      name: input.name,
      memo: input.memo ?? null,
      deposit: input.deposit ?? 0,
      debt: input.debt ?? 0,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Department;
}

export async function updateDepartment(
  id: string,
  patch: Partial<DepartmentInput>
): Promise<Department> {
  const profile = await getMyProfile();
  if (!profile.shop_id) throw new Error("No shop");

  const { data, error } = await supabase
    .from("departments")
    .update({
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.memo !== undefined ? { memo: patch.memo ?? null } : {}),
      ...(patch.deposit !== undefined ? { deposit: patch.deposit ?? 0 } : {}),
      ...(patch.debt !== undefined ? { debt: patch.debt ?? 0 } : {}),
    })
    .eq("id", id)
    .eq("shop_id", profile.shop_id)
    .select("*")
    .single();

  if (error) throw error;
  return data as Department;
}

export async function deleteDepartment(id: string): Promise<void> {
  const profile = await getMyProfile();
  if (!profile.shop_id) throw new Error("No shop");

  const { error } = await supabase
    .from("departments")
    .delete()
    .eq("id", id)
    .eq("shop_id", profile.shop_id);

  if (error) throw error;
}
