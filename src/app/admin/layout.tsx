import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { isSupabaseEnabled } from "@/lib/supabase";
import Sidebar from "@/components/admin/Sidebar";
import AdminLogin from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "GLITCH 2026 · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-ink md:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 p-4 md:p-8">
        {!isSupabaseEnabled && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
            <div>
              <p className="font-semibold text-red-300">Database not connected — changes will be lost.</p>
              <p className="mt-1 text-xs leading-relaxed text-red-200/80">
                Supabase is not configured, so products, categories and orders are stored on a
                temporary filesystem that is wiped on every deploy and does not sync between
                servers. Add <code className="rounded bg-black/40 px-1">SUPABASE_URL</code> and{" "}
                <code className="rounded bg-black/40 px-1">SUPABASE_SERVICE_ROLE_KEY</code> in your
                hosting environment to make orders and product edits durable.
              </p>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
