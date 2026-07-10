"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
import { formatDA } from "@/lib/format";
import { MessageCircle, Mail } from "lucide-react";

const statuses: Order["status"][] = ["new", "confirmed", "delivered", "cancelled"];

const statusColor: Record<Order["status"], string> = {
  new: "text-gold border-gold/40",
  confirmed: "text-blue-400 border-blue-500/40",
  delivered: "text-emerald-400 border-emerald-500/40",
  cancelled: "text-red-400 border-red-500/40",
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await fetch("/api/orders").then((r) => r.json());
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: Order["status"]) {
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="serif-title text-3xl text-white">Orders</h1>
        <p className="mt-1 text-sm text-neutral-500">Customer orders received via WhatsApp and email.</p>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="rounded-xl border border-neutral-900 bg-panel p-8 text-center text-sm text-neutral-600">
          No orders yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-900 bg-panel">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="border-b border-neutral-800 text-neutral-500">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Product</th>
                <th className="p-3">Color / Size</th>
                <th className="p-3 text-gold">Total</th>
                <th className="p-3">Via</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-neutral-900 last:border-0">
                  <td className="whitespace-nowrap p-3 text-neutral-500">
                    {new Date(o.date).toLocaleString()}
                  </td>
                  <td className="p-3 font-medium text-white">{o.customer}</td>
                  <td className="whitespace-nowrap p-3 text-neutral-300">{o.phone}</td>
                  <td className="p-3 text-neutral-300">{o.product}</td>
                  <td className="p-3 text-neutral-400">
                    {o.color} / {o.size}
                  </td>
                  <td className="whitespace-nowrap p-3 font-semibold text-gold">{formatDA(o.price)}</td>
                  <td className="p-3">
                    {o.channel === "whatsapp" ? (
                      <MessageCircle size={14} className="text-[#25D366]" />
                    ) : (
                      <Mail size={14} className="text-gold" />
                    )}
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value as Order["status"])}
                      className={`rounded-full border bg-transparent px-2 py-1 text-[11px] uppercase ${statusColor[o.status]}`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s} className="bg-neutral-900 text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
