"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_TASK_CREATION_SETTINGS,
  type TaskCreationSettings,
} from "@/types/task-settings";

function cloneDefaults(): TaskCreationSettings {
  return structuredClone(DEFAULT_TASK_CREATION_SETTINGS);
}

function isTaskCreationSettings(value: unknown): value is TaskCreationSettings {
  if (!value || typeof value !== "object") return false;
  const candidate = value as TaskCreationSettings;
  return Array.isArray(candidate.fields) && Array.isArray(candidate.tabs);
}

function readTaskCreationFromSettings(
  settings: unknown
): TaskCreationSettings {
  if (!settings || typeof settings !== "object") {
    return cloneDefaults();
  }

  const taskCreation = (settings as Record<string, unknown>)["taskCreation"];
  return isTaskCreationSettings(taskCreation)
    ? structuredClone(taskCreation)
    : cloneDefaults();
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Not authenticated. Please sign in again.");
  }

  return { supabase, user };
}

async function resolveOrganizationId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", userId)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (profile.organization_id) {
    return profile.organization_id;
  }

  const { data: existingOrg, error: orgLookupError } = await supabase
    .from("organizations")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (orgLookupError) {
    throw new Error(orgLookupError.message);
  }

  let organizationId = existingOrg?.id ?? null;

  if (!organizationId) {
    const { data: createdOrg, error: createError } = await supabase
      .from("organizations")
      .insert({
        name: "Default Organization",
        settings: { timezone: "UTC" },
      })
      .select("id")
      .single();

    if (createError || !createdOrg) {
      throw new Error(
        createError?.message ?? "Failed to create organization for settings"
      );
    }

    organizationId = createdOrg.id;
  }

  const { error: linkError } = await supabase
    .from("profiles")
    .update({ organization_id: organizationId })
    .eq("id", userId);

  if (linkError) {
    throw new Error(linkError.message);
  }

  return organizationId;
}

export async function getTaskCreationSettingsAction() {
  try {
    const { supabase, user } = await requireUser();
    const organizationId = await resolveOrganizationId(supabase, user.id);

    const { data: organization, error } = await supabase
      .from("organizations")
      .select("settings")
      .eq("id", organizationId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: readTaskCreationFromSettings(organization.settings),
      error: null,
    };
  } catch (error) {
    return {
      data: cloneDefaults(),
      error: error instanceof Error ? error.message : "Failed to load settings",
    };
  }
}

export async function saveTaskCreationSettingsAction(
  settings: TaskCreationSettings
) {
  try {
    const { supabase, user } = await requireUser();
    const organizationId = await resolveOrganizationId(supabase, user.id);

    const { data: organization, error: readError } = await supabase
      .from("organizations")
      .select("settings")
      .eq("id", organizationId)
      .single();

    if (readError) {
      throw new Error(readError.message);
    }

    const currentSettings =
      organization.settings && typeof organization.settings === "object"
        ? (organization.settings as Record<string, unknown>)
        : {};

    const { error: updateError } = await supabase
      .from("organizations")
      .update({
        settings: {
          ...currentSettings,
          taskCreation: settings,
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", organizationId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action_type: "settings.task_creation.update",
      description: "Updated create task form configuration",
      category: "Settings",
      metadata: {
        fieldCount: settings.fields.length,
        visibleCount: settings.fields.filter((field) => field.visible).length,
        organizationId,
      },
    });

    revalidatePath("/settings");

    return { data: settings, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to save settings",
    };
  }
}
