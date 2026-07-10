# Atlum Admin — Portal Overview

Enterprise web console for **Atlum Work OS**, the multi-tenant task, ticket, and timecard management platform. Atlum Admin gives organization administrators full control over users, roles, org settings, and basic reporting — complementing the mobile app used by Employees and Managers.

---

## Role in the Platform

Atlum Work OS consists of three components:

| Component | Users | Purpose |
|-----------|-------|---------|
| **Atlum Admin** (this portal) | Organization Admins | User management, org configuration, reporting |
| **AtlumApp** (mobile) | Employees & Managers | Tickets, timecards, approvals |
| **AtlumBackend** (planned) | — | Shared API services |

Atlum Admin is the **control plane** for each tenant organization. Admins onboard employees via bulk import, configure org-wide settings (timezone, language), review fixed role permissions, and monitor operational health from a single dashboard.

---

## Target Users

| Role | Admin Portal Access |
|------|---------------------|
| **Admin** | Full access — all pages and mutations |
| **Manager** | No access (mobile only) |
| **Employee** | No access (mobile only) |

Authentication is restricted to admin accounts via Supabase Auth (email + password). Unauthenticated requests are redirected to `/login` by middleware.

---

## Product Capabilities

Mapped from the [Atlum Work OS PRD](../Atlum_WorkOS_PRD.md) §4.3:

| Capability | PRD Scope | Current Status |
|------------|-----------|----------------|
| **Dashboard** | Employee/manager counts, system health, productivity chart, recent actions log | **Partial** — layout and widgets built; employee/manager counts live from Supabase; chart and health metrics use mock data |
| **User Management** | Searchable directory, bulk Excel/CSV import, role assignment | **Placeholder** — page shell only |
| **Roles & Permissions** | Read-only view of fixed 3-role permission set | **Placeholder** — page shell only |
| **Create Task Settings** | Custom ticket form fields with mobile preview | **Core** — field toggles, preview, save via Supabase |
| **Reports** | Basic ticket counts (total, completed, overdue) | **Placeholder** — page shell only |
| **Bulk Excel Import** | Sole v1 method for adding users to an org | **UI only** — sidebar and dashboard CTAs present; server action stubbed |
| **Activity Audit Trail** | Recent admin actions on dashboard | **Partial** — reads from `activity_logs` table with mock fallback |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Authentication | Supabase Auth (SSR cookie sessions) |
| Database | Supabase PostgreSQL (`AtlumWorkOS` project) |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| State | React Context + Zustand (available) |
| Toasts | Sonner |
| Deployment | Vercel |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│  AuthProvider · ThemeProvider · ToastProvider           │
│  Dashboard pages · shadcn/ui components                 │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │   Next.js Middleware   │  Session refresh + route guard
         └───────────┬───────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
 Server Actions   Supabase Client   Supabase Server
 (admin.ts)       (browser)         (SSR / RLS)
                     │
                     ▼
            Supabase PostgreSQL
     profiles · organizations · roles · activity_logs
```

### Route Groups

| Group | Path | Purpose |
|-------|------|---------|
| `(auth)` | `/login`, `/forgot-password` | Public auth pages |
| `(dashboard)` | `/`, `/users`, `/roles`, `/settings`, `/reports` | Protected admin pages |

### Auth Flow

1. User submits credentials on `/login`.
2. `AuthProvider` calls `supabase.auth.signInWithPassword`.
3. Middleware (`src/middleware.ts`) refreshes the session on every request via `@supabase/ssr`.
4. Unauthenticated users hitting dashboard routes → redirect to `/login`.
5. Authenticated users hitting `/login` → redirect to `/`.

### Data Access Patterns

| Pattern | Location | Use Case |
|---------|----------|----------|
| Client hooks | `src/lib/hooks/` | Dashboard stats, recent actions (client-side fetch) |
| Server Actions | `src/lib/actions/admin.ts` | User CRUD, bulk import, report generation |
| Supabase SSR | `src/lib/supabase/server.ts` | Server-side queries with cookie auth |
| Supabase Client | `src/lib/supabase/client.ts` | Browser-side queries |

Hooks gracefully degrade to mock data when Supabase is not configured (local dev without credentials).

---

## Navigation & Pages

### Sidebar

| Route | Label | Description |
|-------|-------|-------------|
| `/` | Dashboard | Admin overview with stats, chart, and activity feed |
| `/users` | User Management | Employee directory and access control |
| `/roles` | Roles & Permissions | Fixed role permission reference |
| `/settings` | Create Task Settings | Task form field configuration with mobile preview |
| `/reports` | Reports | Basic ticket analytics |

### Sidebar Footer

- **Bulk Excel Import** — primary onboarding CTA (planned)
- **Help Center** — placeholder link
- **System Health** — visual status indicator

### Top Bar

Global search, export/create actions, notifications badge, theme toggle (light/dark), and user menu with sign-out.

---

## Database Schema

Defined in `supabase/schema.sql`. Core tables:

| Table | Purpose |
|-------|---------|
| `organizations` | Tenant orgs with JSONB settings (timezone, etc.) |
| `profiles` | User profiles extending `auth.users` — role, department, org link |
| `roles` | Permission sets per organization |
| `activity_logs` | Audit trail for admin actions |

### User Roles (enum)

`admin` · `manager` · `employee` — fixed across all organizations (not customizable in v1).

### Row Level Security

- **Admins** — full CRUD on profiles, organizations, roles; read all activity logs.
- **Managers** — read profiles in their department.
- **Users** — read/update own profile; insert activity logs.
- Helper function `is_admin()` gates admin-only policies.

### Auto-Provisioning

A trigger on `auth.users` insert auto-creates a `profiles` row with role from `raw_app_meta_data`.

---

## Key Files

| File | Responsibility |
|------|----------------|
| `src/app/(dashboard)/page.tsx` | Dashboard page composition |
| `src/app/(dashboard)/layout.tsx` | Dashboard shell wrapper |
| `src/components/layout/Sidebar.tsx` | Primary navigation |
| `src/components/layout/DashboardShell.tsx` | Sidebar + TopBar layout |
| `src/components/layout/TopBar.tsx` | Header with search, actions, user menu |
| `src/components/providers/AuthProvider.tsx` | Auth context and sign-in/out |
| `src/lib/supabase/middleware.ts` | Session refresh and route protection |
| `src/lib/actions/admin.ts` | Server actions for mutations |
| `src/lib/hooks/useStats.ts` | Dashboard employee/manager counts |
| `src/lib/hooks/useRecentActions.ts` | Activity log feed |
| `src/types/dashboard.ts` | Dashboard types and mock data |
| `src/types/database.ts` | Supabase-generated TypeScript types |
| `supabase/schema.sql` | Full database schema with RLS |

---

## Design System

Atlum Admin shares the AtlumApp visual identity:

| Token | Value |
|-------|-------|
| Primary | `#10B981` (primary green) |
| Brand | `#006638` (Atlum Admin) |
| Font | Hanken Grotesk |
| UI Library | shadcn/ui with custom CSS variables in `globals.css` |

Supports light and dark themes via `ThemeProvider`.

---

## Event Logging

All admin mutations must write to the `activity_logs` table per workspace standards:

```typescript
{
  user_id: string,       // current admin profile id
  action_type: string,   // e.g. "user.create", "role.update"
  description: string,   // human-readable summary
  category: string,      // e.g. "Users", "Security", "Reports"
  metadata?: object      // non-sensitive context only
}
```

The dashboard **Recent Actions** widget reads from this table (latest 10 entries).

---

## Environment & Deployment

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin seed script |
| `NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL` | Client | Pre-fills login email |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Local only | Bootstrap admin via `npm run seed:admin` |

Deployed to **Vercel** with Supabase Auth redirect URLs configured for production and localhost.

See [README.md](./README.md) for installation, database setup, and deployment steps.

---

## Implementation Roadmap

Priority order aligned with PRD v1 scope:

1. **User Management** — searchable table, filters (department/role/status), individual create/edit
2. **Bulk Excel Import** — template download, column mapping, validation, error reporting
3. **Organization Settings** — org name, timezone, language (English/Hindi)
4. **Roles & Permissions** — read-only permission matrix for Admin/Manager/Employee
5. **Reports** — ticket counts (total, completed, overdue)
6. **Task Configuration (extended)** — add/edit/delete custom fields, tabs, drag reorder
7. **Activity Logging** — wire server actions to `activity_logs` on all mutations
8. **Live Dashboard Data** — replace mock productivity chart and system health with real metrics

---

## Related Documentation

| Document | Location |
|----------|----------|
| Product Requirements | [`Atlum_WorkOS_PRD.md`](../Atlum_WorkOS_PRD.md) |
| Setup & Deployment | [`README.md`](./README.md) |
| Database Schema | [`supabase/schema.sql`](./supabase/schema.sql) |
| Mobile App | [`AtlumApp/README.md`](../AtlumApp/README.md) |

---

*Last updated: July 2026*
