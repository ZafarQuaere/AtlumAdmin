"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquare, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  getWhatsAppSettingsAction,
  saveWhatsAppSettingsAction,
} from "@/lib/actions/settings";

interface WhatsAppLogRow {
  id: string;
  action_type: string;
  description: string;
  created_at: string | null;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function actionLabel(actionType: string): string {
  const map: Record<string, string> = {
    "whatsapp.menu.view": "Opened menu",
    "whatsapp.tickets.view": "Browsed tickets",
    "whatsapp.ticket.view": "Viewed ticket",
    "whatsapp.ticket.status_update": "Updated status",
    "whatsapp.ticket.comment": "Added comment",
  };
  return map[actionType] ?? actionType;
}

export function WhatsAppSettingsCard() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<WhatsAppLogRow[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  // Load toggle state
  const loadSettings = useCallback(async () => {
    setLoading(true);
    const result = await getWhatsAppSettingsAction();
    if (result.data) {
      setEnabled(result.data.enabled);
    } else if (result.error) {
      toast.error(result.error);
    }
    setLoading(false);
  }, []);

  // Load recent WhatsApp activity
  const loadLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("activity_logs")
        .select("id, action_type, description, created_at")
        .eq("category", "WhatsApp")
        .order("created_at", { ascending: false })
        .limit(10);
      if (!error && data) {
        setLogs(data);
      }
    } catch {
      // Silently ignore — activity list is read-only and best-effort
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
    void loadLogs();
  }, [loadSettings, loadLogs]);

  const handleToggle = async () => {
    const next = !enabled;
    setSaving(true);
    const result = await saveWhatsAppSettingsAction(next);
    if (result.error) {
      toast.error(result.error);
    } else {
      setEnabled(next);
      toast.success(
        `WhatsApp bot ${next ? "enabled" : "disabled"} for this organisation.`
      );
    }
    setSaving(false);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            WhatsApp Bot
          </h2>
          <p className="text-sm text-muted-foreground">
            Employees can view and update their assigned tickets via WhatsApp.
          </p>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between rounded-md border border-border p-4">
        <div>
          <p className="text-sm font-medium text-foreground">
            {loading ? "Loading…" : enabled ? "Enabled" : "Disabled"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            When disabled, the bot will not respond to any employee messages for
            this organisation.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={loading || saving}
          onClick={handleToggle}
          className={[
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            enabled ? "bg-emerald-600" : "bg-input",
          ].join(" ")}
        >
          <span
            className={[
              "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
              enabled ? "translate-x-5" : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Business number info */}
      <div className="rounded-md bg-muted/50 p-4 text-sm space-y-1">
        <p className="font-medium text-foreground">Shared Atlum number</p>
        <p className="text-muted-foreground">
          <span className="font-mono">+91 95137 41280</span> — employees save
          this and send{" "}
          <span className="font-mono font-medium">Hi</span> to open the menu.
          Their phone number in Atlum must match the WhatsApp sender exactly.
        </p>
      </div>

      {/* Recent activity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            Recent WhatsApp activity
          </h3>
          <button
            type="button"
            onClick={() => void loadLogs()}
            disabled={logsLoading}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={["h-3 w-3", logsLoading ? "animate-spin" : ""].join(
                " "
              )}
            />
            Refresh
          </button>
        </div>

        {logsLoading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : logs.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No WhatsApp activity found. Activity is recorded when employees
            interact with the bot.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border text-sm">
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">
                    {actionLabel(log.action_type)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.description}
                  </p>
                </div>
                {log.created_at && (
                  <span className="ml-4 shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(log.created_at)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
