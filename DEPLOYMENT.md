# Atlum Admin — Local Preview & Vercel Deployment Guide

Step-by-step instructions to run Atlum Admin on your machine and publish changes to Vercel.

---

## Prerequisites

Before you start, make sure you have:

| Requirement | How to check |
|-------------|--------------|
| **Node.js 20+** | `node -v` |
| **npm** | `npm -v` |
| **Git** | `git --version` |
| **Supabase account** | [supabase.com](https://supabase.com) |
| **Vercel account** (for publishing) | [vercel.com](https://vercel.com) |
| **GitHub access** to the repo | `ZafarQuaere/AtlumAdmin` |

---

## Part 1 — View Changes Locally

### Step 1: Open the project

```bash
cd AtlumAdmin
```

If you are in the monorepo workspace root:

```bash
cd /Users/zafarimam/Projects/dfoode/AtlumWorkspace/AtlumAdmin
```

### Step 2: Install dependencies

Run this once after cloning, or whenever `package.json` changes:

```bash
npm install
```

### Step 3: Configure environment variables

Copy the example env file:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL=zafima20@gmail.com

# Local-only — used by seed script, not needed for dev server
SEED_ADMIN_EMAIL=zafima20@gmail.com
SEED_ADMIN_PASSWORD=<your-bootstrap-password>
```

**Where to find Supabase keys:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project (`AtlumWorkOS`)
3. Navigate to **Project Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

> Never commit `.env.local` to Git. It is already listed in `.gitignore`.

### Step 4: Set up Supabase for local auth

In Supabase Dashboard → **Authentication → URL Configuration**, add:

| Setting | Value |
|---------|-------|
| **Site URL** | `http://localhost:3000` |
| **Redirect URLs** | `http://localhost:3000/**` |

Without this, login redirects may fail locally.

### Step 5: (Optional) Seed the admin user

If you need a fresh bootstrap admin account:

```bash
npm run seed:admin
```

This requires `SUPABASE_SERVICE_ROLE_KEY` and `SEED_ADMIN_PASSWORD` in `.env.local`.

### Step 6: Start the development server

```bash
npm run dev
```

You should see output similar to:

```
▲ Next.js 16.x
- Local:   http://localhost:3000
```

### Step 7: Open the app in your browser

1. Go to [http://localhost:3000](http://localhost:3000)
2. You will be redirected to `/login`
3. Sign in with your admin credentials
4. After login, you land on the dashboard at `/`

**Hot reload:** While `npm run dev` is running, saving any file under `src/` automatically refreshes the browser with your changes.

### Step 8: (Optional) Test a production build locally

Before publishing, verify the production build works:

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) again. This simulates what Vercel runs in production.

Press `Ctrl + C` in the terminal to stop the server when done.

---

## Part 2 — Publish Changes to Vercel

Vercel deploys automatically when you push to GitHub. Follow these steps each time you want to publish.

### Step 1: Save your changes in Git

Check what changed:

```bash
git status
```

Stage the files you want to publish:

```bash
git add .
```

Or stage specific files:

```bash
git add src/components/layout/Sidebar.tsx OVERVIEW.md
```

Commit with a clear message:

```bash
git commit -m "Rename branding to Atlum Admin and update overview docs"
```

### Step 2: Push to GitHub

```bash
git push origin main
```

Replace `main` with your branch name if you are working on a feature branch.

> **First-time setup:** If the remote is not configured yet:
> ```bash
> git remote add origin git@github.com:ZafarQuaere/AtlumAdmin.git
> git push -u origin main
> ```

### Step 3: Vercel picks up the push automatically

If the project is already connected to Vercel:

1. Vercel detects the new commit on GitHub
2. It runs `npm install` → `npm run build` → deploys
3. A deployment URL is generated (usually within 1–3 minutes)

**Check deployment status:**

- Vercel Dashboard → your project → **Deployments** tab
- Or GitHub → your repo → commit status checks

### Step 4: Open the live site

Once the deployment shows **Ready**:

1. Click the deployment in Vercel Dashboard
2. Open the **Visit** link (e.g. `https://atlum-admin.vercel.app`)
3. Log in and verify your changes

---

## Part 3 — First-Time Vercel Setup

Skip this section if the project is already deployed. Use it when setting up Vercel for the first time.

### Step 1: Push the repo to GitHub

Ensure your code is on GitHub at `ZafarQuaere/AtlumAdmin`.

### Step 2: Import the project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to `ZafarQuaere/AtlumAdmin`
3. Framework should auto-detect as **Next.js**
4. Root directory: leave as `.` (project root)

### Step 3: Add environment variables

In the Vercel import screen (or later under **Settings → Environment Variables**), add these for **Production** and **Preview**:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://sbfgtghdekbrcentdweo.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL` | `zafima20@gmail.com` |

**Do not add** `SEED_ADMIN_PASSWORD` or `SEED_ADMIN_EMAIL` to Vercel — seeding is local-only.

### Step 4: Deploy

Click **Deploy**. Vercel will build and publish the app.

### Step 5: Configure Supabase for production

In Supabase Dashboard → **Authentication → URL Configuration**:

| Setting | Value |
|---------|-------|
| **Site URL** | `https://<your-vercel-domain>` |
| **Redirect URLs** | `https://<your-vercel-domain>/**` |

Keep `http://localhost:3000/**` in Redirect URLs so local dev still works.

Example if your Vercel domain is `atlum-admin.vercel.app`:

```
Site URL:        https://atlum-admin.vercel.app
Redirect URLs:   https://atlum-admin.vercel.app/**
                 http://localhost:3000/**
```

### Step 6: Verify production login

1. Open your Vercel URL
2. Sign in with admin credentials
3. Confirm the dashboard loads correctly

---

## Quick Reference

### Common commands

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Run locally (dev) | `npm run dev` |
| Test production build | `npm run build && npm start` |
| Seed admin user | `npm run seed:admin` |
| Check for lint issues | `npm run lint` |
| Stage & commit changes | `git add . && git commit -m "your message"` |
| Publish to Vercel | `git push origin main` |

### Workflow summary

```
Edit code locally
       ↓
npm run dev          ← preview at localhost:3000
       ↓
npm run build        ← verify build passes
       ↓
git add / commit / push
       ↓
Vercel auto-deploys  ← live at your-vercel-domain
```

---

## Troubleshooting

### Login fails locally

- Confirm `.env.local` has correct Supabase URL and anon key
- Confirm `http://localhost:3000/**` is in Supabase Redirect URLs
- Restart the dev server after changing env vars: `Ctrl + C`, then `npm run dev`

### Login fails on Vercel

- Confirm all four env vars are set in Vercel (Production + Preview)
- Confirm your Vercel domain is in Supabase Redirect URLs
- Redeploy after adding env vars: Vercel Dashboard → Deployments → **Redeploy**

### Build fails on Vercel

- Run `npm run build` locally first to see the error
- Fix TypeScript or lint errors, commit, and push again

### Changes not showing locally

- Hard refresh the browser: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
- Restart the dev server
- Clear `.next` cache: `rm -rf .next && npm run dev`

### Changes not showing on Vercel

- Confirm the commit was pushed: `git log origin/main -1`
- Check Vercel Deployments tab — latest deployment must be **Ready**
- Confirm you are viewing the correct URL (production vs preview)

### Environment variables not loading

- `.env.local` is only for local dev — Vercel uses its own env vars
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- After changing Vercel env vars, trigger a **Redeploy**

---

## Related Docs

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Project setup, tech stack, env reference |
| [OVERVIEW.md](./OVERVIEW.md) | Architecture and feature overview |
| [supabase/schema.sql](./supabase/schema.sql) | Database schema |

---

*Last updated: July 2026*
