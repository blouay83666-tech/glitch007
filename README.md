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

## Data

The store (products, categories, orders, slider) is a JSON file at
`data/store.json`. On serverless / read-only hosts, writes fall back to an
in-memory copy for the running instance. For a permanent multi-instance setup,
swap `src/lib/store.ts` for a database.
