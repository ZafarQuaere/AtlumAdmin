"use client";

import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { TaskCreationField } from "@/types/task-settings";
import { cn } from "@/lib/utils";

interface FieldManagementTableProps {
  fields: TaskCreationField[];
  onFieldChange: (
    fieldId: string,
    updates: Partial<Pick<TaskCreationField, "visible" | "required">>
  ) => void;
  onEditField: (fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
}

export function FieldManagementTable({
  fields,
  onFieldChange,
  onEditField,
  onDeleteField,
}: FieldManagementTableProps) {
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
        <h3 className="text-lg font-semibold">Field Management</h3>
        <button
          type="button"
          className="text-xs font-semibold uppercase tracking-wide text-brand-600"
          onClick={() => onEditField("section")}
        >
          Add New Section
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border bg-card text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-6 py-3">Field Name</th>
              <th className="px-6 py-3 text-center">Visible</th>
              <th className="px-6 py-3 text-center">Required</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedFields.map((field) => (
              <tr
                key={field.id}
                className={cn(
                  "border-b border-border last:border-b-0",
                  field.isCustom && "bg-brand-50/30"
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {field.label}
                        </span>
                        {field.isCustom && (
                          <Badge
                            variant="secondary"
                            className="bg-[#dce2f3] text-[10px] uppercase tracking-wide text-[#151c27]"
                          >
                            Custom
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {field.typeLabel}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={field.visible}
                      onCheckedChange={(checked) =>
                        onFieldChange(field.id, { visible: checked === true })
                      }
                      aria-label={`Toggle visibility for ${field.label}`}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={field.required}
                      disabled={!field.visible}
                      onCheckedChange={(checked) =>
                        onFieldChange(field.id, { required: checked === true })
                      }
                      aria-label={`Toggle required for ${field.label}`}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEditField(field.id)}
                      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`Edit ${field.label}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {field.isCustom && (
                      <button
                        type="button"
                        onClick={() => onDeleteField(field.id)}
                        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete ${field.label}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
