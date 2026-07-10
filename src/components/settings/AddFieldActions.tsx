"use client";

import { LayoutGrid, Plus } from "lucide-react";
import { toast } from "sonner";

export function AddFieldActions() {
  const showComingSoon = (feature: string) => {
    toast.info(`${feature} coming soon`);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => showComingSoon("Add New Field")}
        className="flex flex-col items-center rounded-xl border-2 border-dashed border-border px-6 py-10 transition-colors hover:border-brand-600/40 hover:bg-muted/30"
      >
        <Plus className="mb-2 h-6 w-6 text-muted-foreground" />
        <span className="text-lg font-semibold text-foreground">
          Add New Field
        </span>
        <span className="mt-1 text-sm text-muted-foreground">
          Insert text, date, or choice field
        </span>
      </button>

      <button
        type="button"
        onClick={() => showComingSoon("Add Custom Tab")}
        className="flex flex-col items-center rounded-xl border-2 border-dashed border-border px-6 py-10 transition-colors hover:border-brand-600/40 hover:bg-muted/30"
      >
        <LayoutGrid className="mb-2 h-6 w-6 text-muted-foreground" />
        <span className="text-lg font-semibold text-foreground">
          Add Custom Tab
        </span>
        <span className="mt-1 text-sm text-muted-foreground">
          Group fields into specialized tabs
        </span>
      </button>
    </div>
  );
}
