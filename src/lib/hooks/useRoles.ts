"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Role = Database["public"]["Tables"]["roles"]["Row"];

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!supabaseUrl) {
          setLoading(false);
          return;
        }

        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("roles")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setRoles(data ?? []);
        }
      } catch {
        setError("Failed to load roles");
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, []);

  return { roles, loading, error };
}
