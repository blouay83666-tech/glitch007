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

## Part 3 — Stop orders/products from disappearing (10 minutes)

This connects a real database (Supabase) so nothing gets wiped. It's free.

1. Go to **supabase.com** → sign up / log in → **New project**. Give it any name,
   set a database password (save it somewhere), pick the closest region →
   **Create**. Wait ~2 minutes for it to finish.
2. In your new Supabase project, click **SQL Editor** (left menu) → **New query**.
3. Open the file `supabase/migrations/0001_init.sql` from this repo and copy
   **all** of it. Paste it into the SQL box → click **Run**. This builds your
   tables and loads your products. You should see "Success".
4. Get your keys: click **Settings** (gear icon) → **API**. You'll see:
   - **Project URL** — looks like `https://xxxx.supabase.co`
   - **service_role** key — under "Project API keys" (click reveal/copy; long string)
5. Back in **Vercel** → Settings → Environment Variables, add:

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
