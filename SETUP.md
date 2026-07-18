# GLITCH 2026 — Setup Guide (do this once)

This guide fixes three things:

1. **Orders now reach your Gmail inbox.**
2. **Orders and product edits stop disappearing** (durable database).
3. **Your admin password is no longer exposed** in the code.

Everything below is done in your **Vercel dashboard** (the website that hosts your
store). No coding required. You can do one part, save, and come back later.

---

## Where everything happens

1. Go to **vercel.com** and log in.
2. Click your **glitch007** project.
3. Click **Settings** (top menu) → **Environment Variables** (left menu).
4. For every item below: type the **Name**, paste the **Value**, tick all three
   boxes (Production / Preview / Development), then click **Save**.

---

## Part 1 — Your admin password (2 minutes)

Add these two variables:

| Name | Value |
| --- | --- |
| `ADMIN_PASSWORD` | Pick a brand-new password you'll remember. **Do not reuse `louayben2026` — it was public.** |
| `SESSION_SECRET` | A long random string. Generate one by running `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`, or use any 40+ random characters. |

---

## Part 2 — Get orders into your Gmail (5 minutes)

Gmail won't let apps use your normal password, so you create a special
"App Password" just for the store.

**Step A — turn on 2-Step Verification** (needed before app passwords exist):

1. Go to **myaccount.google.com/security**
2. Find **2-Step Verification** → turn it **On** (follow the phone prompts).

**Step B — create the App Password:**

1. Go to **myaccount.google.com/apppasswords**
2. Type a name like `glitch store` → click **Create**.
3. Google shows a **16-character code** (like `abcd efgh ijkl mnop`).
   Copy it and **remove the spaces** → `abcdefghijklmnop`.

**Step C — add these in Vercel** (Settings → Environment Variables):

| Name | Value |
| --- | --- |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `blouay83666@gmail.com` |
| `SMTP_PASS` | Your 16-char app password, **no spaces** |
| `ORDER_EMAIL_FROM` | `blouay83666@gmail.com` |
| `ORDER_EMAIL_TO` | `blouay83666@gmail.com` |

Now every order (WhatsApp **and** Email) lands in your inbox.

---

## Part 3 — Stop orders/products from disappearing (THE important one)

**Why products don't appear on the site:** without a database, when you add a
product the hosting server saves it only in its own temporary memory. The public
website runs on a *different* server that never sees it — so the product never
shows up, and orders vanish the same way. The fix is to connect one shared
database (Supabase). It's free. Once connected, everything you add in the admin
panel shows on the site and stays forever.

### Easiest way — Vercel's one-click Supabase integration (recommended)

1. In **Vercel**, open your **glitch007** project → **Storage** tab (top menu).
2. Click **Create Database** → choose **Supabase** → **Continue**.
3. Follow the prompts (sign in / create a free Supabase account when asked, pick a
   region close to you) → **Connect**.
4. Vercel automatically adds the Supabase keys to your project for you — you don't
   have to copy anything by hand. ✅
5. **Load your products into the new database:** open the Supabase project
   (there's a link from the Vercel Storage tab), click **SQL Editor** →
   **New query**, then copy **all** of the file
   `supabase/migrations/0001_init.sql` from this repo, paste it in, and click
   **Run**. You should see "Success".

### Manual way (if you prefer, or the integration isn't available)

1. Go to **supabase.com** → sign up / log in → **New project**. Give it any name,
   set a database password (save it), pick the closest region → **Create**. Wait
   ~2 minutes.
2. **SQL Editor** → **New query** → paste all of
   `supabase/migrations/0001_init.sql` → **Run**.
3. **Settings** (gear icon) → **API**, copy:
   - **Project URL** — looks like `https://xxxx.supabase.co`
   - **service_role** key — under "Project API keys" (reveal/copy; long string)
4. In **Vercel** → Settings → Environment Variables, add:

   | Name | Value |
   | --- | --- |
   | `SUPABASE_URL` | The Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | The **service_role** key |

   > ⚠️ Use the **service_role** key, not the "anon" one.

---

## Final step — turn it all on (1 minute)

Vercel only picks up new variables on a fresh deploy:

1. In Vercel, click **Deployments** (top menu).
2. On the most recent one, click the **⋯** menu → **Redeploy** → confirm.

Do the parts in any order, but **do this redeploy step last.**

---

## How to check it worked

- Log into `/admin` with your **new** password — the **red warning banner should
  be gone** (that means the database is connected).
- Add or edit a product → refresh the main site → the change shows and **stays**.
- Place a test order on your own site → it should appear in the admin **and** hit
  your Gmail inbox within a minute or two (check spam the first time).

If anything looks off — banner still red, no email, an error — note exactly what
you see and it can be fixed from there.
