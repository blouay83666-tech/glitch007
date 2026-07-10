# GLITCH 2026 — Next.js Store

Neo-street luxury storefront rebuilt from a single HTML file into a full
**Next.js 14 (App Router) + TypeScript + Tailwind** application, with a real 3D
hero, a protected ordering flow (WhatsApp / email) and a sidebar admin panel.

## Features

- **Modern UI/UX** — dark luxury theme, Framer Motion animations, responsive.
- **3D hero** — animated gold "glitched" knot rendered with React Three Fiber
  (`src/components/Scene3D.tsx`), plus a campaign image carousel.
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
| `ADMIN_PASSWORD` | Admin panel password (default `louayben2026`). |
| `SESSION_SECRET` | Secret used to sign the admin session cookie. **Change it.** |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number that receives orders (digits only, no `+`). |
| `NEXT_PUBLIC_STORE_EMAIL` | Contact email shown to customers. |
| `SMTP_*`, `ORDER_EMAIL_*` | Optional — enable real email delivery of orders. |

> Without SMTP configured, email orders are still stored server-side and can be
> read from the admin panel; WhatsApp orders always work.

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

> ⚠️ **Persistence on Vercel:** serverless functions have an ephemeral, read-only
> filesystem, so products/orders added through the admin panel will **not**
> persist across requests or deployments. The seed data in `data/store.json`
> always renders, but for durable writes replace `src/lib/store.ts` with a
> database (e.g. **Vercel KV**, **Vercel Postgres**, Supabase, or MongoDB).

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
