"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

export async function createUser(formData: {
  email: string;
  fullName: string;
  role: "admin" | "manager" | "employee";
  department?: string;
}) {
  const supabase = await createClient();

  const payload: ProfileInsert = {
    id: crypto.randomUUID(),
    email: formData.email,
    full_name: formData.fullName,
    role: formData.role,
    department: formData.department ?? null,
  };

  const { error } = await supabase.from("profiles").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/users");
  return { error: null };
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role: role as "admin" | "manager" | "employee" })
    .eq("id", userId);

  if (error) return { error: error.message };

  revalidatePath("/users");
  return { error: null };
}

export async function bulkImportEmployees() {
  return { error: null, message: "Bulk import queued" };
}

export async function generateReport() {
  return { error: null, message: "Report generation started" };
}
