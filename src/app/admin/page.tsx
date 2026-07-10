import Link from "next/link";
import { getProducts, getCategories, getOrders } from "@/lib/store";
import { formatDA } from "@/lib/format";
import { Shirt, ShoppingBag, Tags, PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, categories, orders] = await Promise.all([
    getProducts(),
    getCategories(),
    getOrders(),
  ]);

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.price, 0);
  const newOrders = orders.filter((o) => o.status === "new").length;

  const cards = [
    { label: "Products", value: products.length, icon: Shirt, href: "/admin/products" },
    { label: "Orders", value: orders.length, icon: ShoppingBag, href: "/admin/orders" },
    { label: "Categories", value: categories.length, icon: Tags, href: "/admin/categories" },
    { label: "New orders", value: newOrders, icon: ShoppingBag, href: "/admin/orders" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="serif-title text-3xl text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">Overview of your GLITCH store.</p>
        </div>
        <Link
          href="/admin/products"
          className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white"
        >
          <PlusCircle size={15} /> Add product
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-neutral-900 bg-panel p-5 transition-colors hover:border-gold/40"
          >
            <Icon className="mb-3 text-gold" size={20} />
            <div className="text-3xl font-semibold text-white">{value}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">{label}</div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-900 bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-neutral-500">Total order value</div>
        <div className="serif-title mt-2 text-4xl text-gold">{formatDA(revenue)}</div>
        <p className="mt-2 text-xs text-neutral-600">
          Across {orders.length} order{orders.length === 1 ? "" : "s"} (excluding cancelled).
        </p>
      </div>
    </div>
  );
}
