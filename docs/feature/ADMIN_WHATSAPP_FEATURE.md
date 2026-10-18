# WhatsApp Settings — AtlumAdmin

## Related docs
- Backend feature: [`AtlumBackend/docs/feature/BE_WHATSAPP_FEATURE.md`](../../../AtlumBackend/docs/feature/BE_WHATSAPP_FEATURE.md)
- Mobile feature: [`AtlumApp/docs/feature/APP_WHATSAPP_FEATURE.md`](../../../AtlumApp/docs/feature/APP_WHATSAPP_FEATURE.md)

## Overview

The settings page includes a WhatsApp card that lets admins toggle the bot for their organisation and review recent employee-bot interactions.

## Architecture

- **Settings page**: `src/app/(dashboard)/settings/page.tsx` — renders `TaskConfigurationForm` and `WhatsAppSettingsCard` side by side.
- **Component**: `src/components/settings/WhatsAppSettingsCard.tsx` — client component; reads and writes settings via Server Actions; queries `activity_logs` directly via Supabase browser client.
- **Server Actions**: `src/lib/actions/settings.ts` — `getWhatsAppSettingsAction` and `saveWhatsAppSettingsAction`.

## Key Files

| Path | Role |
|---|---|
| `src/app/(dashboard)/settings/page.tsx` | Renders WhatsApp card alongside task settings |
| `src/components/settings/WhatsAppSettingsCard.tsx` | Toggle + activity list |
| `src/lib/actions/settings.ts` | `getWhatsAppSettingsAction`, `saveWhatsAppSettingsAction` |

## API / Data

| Operation | Table | Field |
|---|---|---|
| Read/write toggle | `organizations` | `settings.whatsapp.enabled` (boolean; missing = `true`) |
| Audit toggle change | `activity_logs` | `action_type: "settings.whatsapp.update"`, `category: "WhatsApp"` |
| Read recent WhatsApp activity | `activity_logs` | `category = "WhatsApp"`, last 10 rows |

## Implementation Notes

- Toggle default is **on** (missing key means enabled) so existing orgs work after upgrade.
- The activity list does NOT query `whatsapp_messages` — that table has RLS with no policies so no browser client access. `activity_logs` is used instead (the backend now writes `organizationId` to `metadata`).
- The admin toggle stores the value in the Admin Supabase `organizations.settings`. If AtlumAdmin and AtlumWorkOS (backend) share the same Supabase, the bot can check this setting. If separate, the toggle is a visibility feature until a backend API endpoint is added.

## Changelog

| Date | Change |
|---|---|
| 2026-10-01 | Initial implementation — toggle and activity list |
