# Emerald Admin - Atlum Work OS

Enterprise admin console for managing employees, roles, permissions, and organizational settings.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Charts**: Recharts
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase account (free tier)

### Installation

```bash
cd AtlumAdmin
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# File: supabase/schema.sql
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

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
└── types/               # TypeScript types
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy

## Theme

Uses the Emerald palette from AtlumApp:

- Primary: `#10B981`
- Emerald Admin: `#006638`
- Font: Hanken Grotesk

## License

Private - Atlum Work OS
