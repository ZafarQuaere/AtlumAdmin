"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  mockDashboardStats,
  type DashboardStats,
} from "@/types/dashboard";

export function useStats() {
  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!supabaseUrl) {
          setStats(mockDashboardStats);
          setLoading(false);
          return;
        }

        const supabase = createClient();

        const [employeesResult, managersResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "employee"),
          supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("role", "manager"),
        ]);

        if (employeesResult.error || managersResult.error) {
          setStats(mockDashboardStats);
        } else {
          setStats({
            totalEmployees: {
              value: employeesResult.count ?? mockDashboardStats.totalEmployees.value,
              change: mockDashboardStats.totalEmployees.change,
            },
            activeManagers: {
              value: managersResult.count ?? mockDashboardStats.activeManagers.value,
              status: mockDashboardStats.activeManagers.status,
            },
            systemHealth: mockDashboardStats.systemHealth,
          });
        }
      } catch {
        setError("Failed to load stats");
        setStats(mockDashboardStats);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}
