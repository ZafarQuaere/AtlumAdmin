# Atlum Admin - Atlum Work OS

Enterprise admin console for managing employees, roles, permissions, and organizational settings.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL (project: `AtlumWorkOS`)
- **Charts**: Recharts
- **Deployment**: Vercel

## Bootstrap Admin Login

Default Atlum Admin credentials (stored in Supabase Auth):

| Field | Value |
|-------|-------|
| Email | `zafima20@gmail.com` |
| Password | `Atlum@1234` |

The login page pre-fills the email via `NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL`. The password is never stored in source code — only in Supabase Auth.

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase account (free tier)

### Installation

```bash
cd AtlumAdmin
npm install
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL=zafima20@gmail.com

# Local-only for npm run seed:admin
SEED_ADMIN_EMAIL=zafima20@gmail.com
SEED_ADMIN_PASSWORD=<bootstrap-password>
```

Get keys from Supabase Dashboard → Project Settings → API.

### Database Setup

Schema is applied via Supabase migrations. To re-apply manually, run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor.

### Seed Admin User (optional, local)

If you need to recreate the bootstrap admin:

```bash
npm run seed:admin
```

Requires `SUPABASE_SERVICE_ROLE_KEY` and `SEED_ADMIN_PASSWORD` in `.env.local`.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated users are redirected to `/login`.

### Build

```bash
npm run build
npm start
```

## Deploy to Vercel (GitHub)

1. Push this repo to GitHub: `ZafarQuaere/AtlumAdmin`
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import `ZafarQuaere/AtlumAdmin`
4. Framework: **Next.js** (auto-detected)
5. Add environment variables (Production + Preview):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://sbfgtghdekbrcentdweo.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key (server-only) |
| `NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL` | `zafima20@gmail.com` |

6. Deploy

**Do not** add `SEED_ADMIN_PASSWORD` to Vercel — seeding is a one-time local operation.

### Supabase Auth Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

- **Site URL**: `https://<your-vercel-domain>`
- **Redirect URLs**: `https://<your-vercel-domain>/**`

Also add `http://localhost:3000/**` for local development.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, forgot password
│   ├── (dashboard)/     # Protected admin pages
│   └── layout.tsx       # Root layout
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── layout/          # Sidebar, TopBar, NavLink
│   ├── dashboard/       # Dashboard widgets
│   └── providers/       # Auth, Theme, Toast
├── lib/
│   ├── supabase/        # Supabase clients
│   ├── hooks/           # Data fetching hooks
│   └── actions/         # Server actions
├── scripts/
│   └── seed-admin.mjs   # Bootstrap admin user
└── types/               # TypeScript types
```

## Theme

Uses the Atlum brand palette from AtlumApp:

- Primary: `#10B981`
- Atlum Admin brand: `#006638`
- Font: Hanken Grotesk

## License

Private - Atlum Work OS
