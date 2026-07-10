"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Tags,
  Images,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Shirt },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/slider", label: "Slider", icon: Images },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-900 bg-panel px-4 py-3 md:hidden">
        <span className="serif-title tracking-widest text-gold">GLITCH Admin</span>
        <button onClick={() => setOpen((o) => !o)} className="text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } fixed inset-x-0 top-[49px] z-20 border-b border-neutral-900 bg-panel md:sticky md:top-0 md:block md:h-screen md:w-64 md:flex-shrink-0 md:border-b-0 md:border-r`}
      >
        <div className="flex h-full flex-col p-5">
          <div className="mb-8 hidden md:block">
            <div className="serif-title text-xl tracking-[0.2em] text-white">GLITCH</div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500">Admin portal</div>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-gold/10 font-semibold text-gold"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <Icon size={17} /> {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 flex flex-col gap-1 border-t border-neutral-900 pt-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white"
            >
              <ExternalLink size={17} /> View store
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-red-400"
            >
              <LogOut size={17} /> Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
