# GLITCH 2026 — Next.js Store

Neo-street luxury storefront rebuilt from a single HTML file into a full
**Next.js 14 (App Router) + TypeScript + Tailwind** application, with a real 3D
hero, a protected ordering flow (WhatsApp / email) and a sidebar admin panel.

## Features

- **Modern UI/UX** — dark luxury theme, Framer Motion animations, responsive.
- **Hero slider** — full-screen campaign carousel (`src/components/Campaign.tsx`),
  managed from the admin panel.
- **Background music** — an "enter to play" overlay unlocks a looping soundtrack;
  toggle it from the navbar (`src/components/MusicProvider.tsx`). Put your track at
  `public/music.mp3` (or set `NEXT_PUBLIC_MUSIC_URL`).
- **Ordering** — customers order in seconds via **WhatsApp** (a `wa.me` deep link
  is generated server-side) or **Email** (SMTP, optional). Every order is stored
  server-side and visible in the admin panel.
- **Protection** on the public order API (`/api/order`):
  - Zod schema validation + input sanitisation (strips `<` `>`).
  - Hidden **honeypot** field — bot submissions are silently discarded.
  - In-memory **rate limiting** (5 orders / minute / IP).
- **Admin panel** at `/admin` (sidebar layout):
  - Password login → signed **httpOnly** session cookie (8h), no client-side
    password check.
  - **Products** — add / edit / delete, image upload (compressed to base64),
    including new **Broderie** (embroidery) pieces.
  - **Orders** — table with status workflow (new → confirmed → delivered).
  - **Categories** and **Hero slider** management.

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build && npm run start
```

## Configuration (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Admin panel password. **Required in production** — pick your own strong secret. In development, if unset, the password is `glitch-dev`. |
| `SESSION_SECRET` | Secret used to sign the admin session cookie. **Required in production** — a long random string. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number that receives orders (digits only, no `+`). |
| `NEXT_PUBLIC_STORE_EMAIL` | Contact email shown to customers. |
| `SMTP_*`, `ORDER_EMAIL_*` | Enable email delivery — **every** order is emailed to `ORDER_EMAIL_TO`. |

> **Security:** never commit a real `ADMIN_PASSWORD` or `SESSION_SECRET`. They
> are read from the environment only. If `ADMIN_PASSWORD` is missing in
> production the admin login is disabled until you set it.

> **Receiving orders by email (Gmail):** set `SMTP_HOST=smtp.gmail.com`,
> `SMTP_PORT=465`, `SMTP_USER`/`ORDER_EMAIL_TO` to your Gmail address, and
> `SMTP_PASS` to a Google **App Password** (from
> <https://myaccount.google.com/apppasswords> — 2-Step Verification must be on).
> Your normal Gmail password will **not** work. Without SMTP configured, orders
> are still stored server-side and readable in the admin panel; WhatsApp orders
> always work.

## Deploy to Vercel

This is a standard Next.js app and deploys to Vercel with zero config.

1. Go to <https://vercel.com/new> and **import** `blouay83666-tech/glitch007`.
2. Framework preset is auto-detected as **Next.js** — leave build settings default.
3. Add the environment variables from `.env.example` in **Settings → Environment
   Variables** (at minimum `ADMIN_PASSWORD`, `SESSION_SECRET`,
   `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_STORE_EMAIL`).
4. **Deploy.** Every push to the branch then redeploys automatically.

CLI alternative:

```bash
npm i -g vercel
vercel        # first deploy (links the project)
vercel --prod # production deploy
```

> ⚠️ **Persistence on Vercel requires Supabase.** Serverless functions have an
> ephemeral, per-instance filesystem, so without a database, products/orders
> added through the admin panel are **lost between requests and deploys** — this
> is exactly why orders "disappear" and product edits don't show on the site.
> Connect **Supabase** (see *Data & persistence* below) to store everything
> durably. When it is **not** connected, the admin panel now shows a red warning
> banner so you know writes aren't being saved.

## Data & persistence

The data layer (`src/lib/store.ts`) has two backends, chosen automatically:

- **Supabase Postgres** — used when `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
  (or the `NEXT_PUBLIC_SUPABASE_*` fallbacks) are set. All products, categories,
  orders and slides are stored durably. **This is what runs on Vercel.**
- **Local JSON file** (`data/store.json`) — used when Supabase env vars are
  absent, so `npm run dev` works with zero setup (not durable on serverless).

### Supabase setup

1. The schema + seed lives in [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   With the **Supabase GitHub integration** it is applied automatically on push;
   otherwise paste it into the Supabase **SQL Editor** and run it once.
2. Make sure the Supabase env vars are present in Vercel (the **Vercel +
   Supabase integration** adds them for you). The server uses the
   **service-role key** only — it is never exposed to the browser.
3. Tables have **RLS enabled with no public policies**: only the server
   (service-role) can read/write, so the public anon key can't touch your data.
