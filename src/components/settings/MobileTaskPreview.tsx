"use client";

import { Input } from "@/components/ui/input";
import type { TaskCreationField } from "@/types/task-settings";
import { cn } from "@/lib/utils";

interface MobileTaskPreviewProps {
  fields: TaskCreationField[];
}

export function MobileTaskPreview({ fields }: MobileTaskPreviewProps) {
  const visibleFields = [...fields]
    .filter((field) => field.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="sticky top-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Real-time Mobile Preview</h3>
        <p className="text-sm text-muted-foreground">
          See how the create task form appears to employees
        </p>
      </div>

      <div className="mx-auto w-full max-w-[320px] rounded-[2rem] border-[10px] border-foreground/90 bg-foreground/90 p-2 shadow-xl">
        <div className="overflow-hidden rounded-[1.5rem] bg-background">
          <div className="border-b border-border px-4 py-3">
            <p className="text-center text-sm font-semibold">Create Task</p>
          </div>

          <div className="space-y-4 p-4">
            {visibleFields.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No visible fields configured
              </p>
            ) : (
              visibleFields.map((field) => (
                <PreviewField key={field.id} field={field} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewField({ field }: { field: TaskCreationField }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </label>

      {field.type === "textarea" && (
        <div className="min-h-[72px] rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          Add details...
        </div>
      )}

      {field.type === "text" && (
        <Input
          readOnly
          placeholder="Enter task title..."
          className="h-9 text-xs"
        />
      )}

      {field.type === "dropdown" && (
        <div className="flex h-9 items-center rounded-lg border border-border bg-muted/20 px-3 text-xs text-muted-foreground">
          Select Project
        </div>
      )}

      {field.type === "pills" && (
        <div className="flex flex-wrap gap-2">
          {(field.options ?? []).map((option) => (
            <span
              key={option}
              className={cn(
                "rounded-full border border-border px-3 py-1 text-xs",
                option === field.options?.[0]
                  ? "border-brand-600 bg-brand-600/10 text-brand-700"
                  : "text-muted-foreground"
              )}
            >
              {option}
            </span>
          ))}
        </div>
      )}

      {field.type === "number" && (
        <Input readOnly defaultValue="0.00" className="h-9 text-xs" />
      )}

      {(field.type === "date" || field.type === "choice") && (
        <div className="flex h-9 items-center rounded-lg border border-border bg-muted/20 px-3 text-xs text-muted-foreground">
          Select {field.label.toLowerCase()}
        </div>
      )}
    </div>
  );
}
