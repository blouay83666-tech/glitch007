import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/auth";
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
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
