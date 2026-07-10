"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { AddFieldActions } from "@/components/settings/AddFieldActions";
import { FieldManagementTable } from "@/components/settings/FieldManagementTable";
import { MobileTaskPreview } from "@/components/settings/MobileTaskPreview";
import { TaskConfigFooter } from "@/components/settings/TaskConfigFooter";
import {
  getTaskCreationSettingsAction,
  saveTaskCreationSettingsAction,
} from "@/lib/actions/settings";
import {
  DEFAULT_TASK_CREATION_SETTINGS,
  type TaskCreationField,
  type TaskCreationSettings,
} from "@/types/task-settings";

function cloneSettings(settings: TaskCreationSettings): TaskCreationSettings {
  return structuredClone(settings);
}

export function TaskConfigurationForm() {
  const [settings, setSettings] = useState<TaskCreationSettings>(
    cloneSettings(DEFAULT_TASK_CREATION_SETTINGS)
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);

    const result = await getTaskCreationSettingsAction();

    if (result.error) {
      toast.error(result.error);
      setSettings(cloneSettings(DEFAULT_TASK_CREATION_SETTINGS));
    } else if (result.data) {
      setSettings(cloneSettings(result.data));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const handleFieldChange = (
    fieldId: string,
    updates: Partial<Pick<TaskCreationField, "visible" | "required">>
  ) => {
    setSettings((current) => ({
      ...current,
      fields: current.fields.map((field) => {
        if (field.id !== fieldId) return field;

        const nextField = { ...field, ...updates };

        if (updates.visible === false) {
          nextField.required = false;
        }

        return nextField;
      }),
    }));
  };

  const handleReset = () => {
    setSettings(cloneSettings(DEFAULT_TASK_CREATION_SETTINGS));
    toast.message("Defaults restored. Save configuration to persist.");
  };

  const handleSave = async () => {
    setSaving(true);

    const result = await saveTaskCreationSettingsAction(settings);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Task configuration saved");
      if (result.data) {
        setSettings(cloneSettings(result.data));
      }
    }

    setSaving(false);
  };

  const showStubToast = (action: string) => {
    toast.info(`${action} coming soon`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Configuration"
        description="Customize the task entry form, manage required fields, and add custom tabs for your organization."
      />

      <div className="grid gap-8 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-7">
          <FieldManagementTable
            fields={settings.fields}
            onFieldChange={handleFieldChange}
            onEditField={(fieldId) =>
              showStubToast(
                fieldId === "section" ? "Add New Section" : "Edit field"
              )
            }
            onDeleteField={() => showStubToast("Delete field")}
          />
          <AddFieldActions />
        </div>

        <div className="xl:col-span-5">
          <MobileTaskPreview fields={settings.fields} />
        </div>
      </div>

      <TaskConfigFooter
        saving={saving}
        onReset={handleReset}
        onSave={handleSave}
      />
    </div>
  );
}
