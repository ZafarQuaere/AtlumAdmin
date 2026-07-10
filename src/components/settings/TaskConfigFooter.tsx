"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskConfigFooterProps {
  saving: boolean;
  onReset: () => void;
  onSave: () => void;
}

export function TaskConfigFooter({
  saving,
  onReset,
  onSave,
}: TaskConfigFooterProps) {
  return (
    <div className="flex items-center justify-end gap-4 border-t border-border pt-6">
      <Button
        type="button"
        variant="ghost"
        onClick={onReset}
        disabled={saving}
        className="text-muted-foreground"
      >
        Reset to Default
      </Button>
      <Button type="button" onClick={onSave} disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Configuration
      </Button>
    </div>
  );
}
