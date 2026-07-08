"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  mockRecentActions,
  type RecentAction,
} from "@/types/dashboard";

export function useRecentActions() {
  const [actions, setActions] = useState<RecentAction[]>(mockRecentActions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActions() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!supabaseUrl) {
          setActions(mockRecentActions);
          setLoading(false);
          return;
        }

        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("activity_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (fetchError || !data?.length) {
          setActions(mockRecentActions);
        } else {
          setActions(
            data.map((log) => ({
              id: log.id,
              title: log.description,
              timestamp: formatRelativeTime(log.created_at ?? new Date().toISOString()),
              category: log.category ?? "System",
              icon: mapActionIcon(log.action_type),
            }))
          );
        }
      } catch {
        setError("Failed to load recent actions");
        setActions(mockRecentActions);
      } finally {
        setLoading(false);
      }
    }

    fetchActions();
  }, []);

  return { actions, loading, error };
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function mapActionIcon(
  actionType: string
): RecentAction["icon"] {
  const type = actionType.toLowerCase();
  if (type.includes("user") || type.includes("employee")) return "user";
  if (type.includes("config") || type.includes("setting")) return "settings";
  if (type.includes("security") || type.includes("audit")) return "shield";
  if (type.includes("report")) return "file";
  return "check";
}
