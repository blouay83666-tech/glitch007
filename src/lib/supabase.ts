import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client. Uses the service-role key so our API routes and
// server components can read/write regardless of RLS. NEVER import this into a
// client component — the service-role key must stay on the server.
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseEnabled = Boolean(url && serviceKey);

export const supabaseAdmin: SupabaseClient | null = isSupabaseEnabled
  ? createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;
