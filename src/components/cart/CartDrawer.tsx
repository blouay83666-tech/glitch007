"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, MessageCircle, Mail, Loader2, CheckCircle2, ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatDA } from "@/lib/format";

type Channel = "whatsapp" | "email";

// One combined order line per cart item, e.g. "Baggy Jogger ×2 — L / Black".
function buildSummary(items: { name: string; qty: number; size: string; color: string }[]): string {
  return items.map((i) => `${i.name} ×${i.qty} — ${i.size} / ${i.color}`).join("\n");
}

export default function CartDrawer() {
  const { items, count, subtotal, isOpen, close, setQty, removeItem, clear } = useCart();

  const [checkout, setCheckout] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [address, setAddress] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(channel: Channel) {
    if (!items.length) return;
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: name,
          phone,
          wilaya,
          address,
          product: buildSummary(items),
          color: "—",
          size: "—",
          price: subtotal,
          channel,
          company,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("done");
      if (channel === "whatsapp" && data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank");
      }
      clear();
      setTimeout(() => {
        setStatus("idle");
        setCheckout(false);
        setName("");
        setPhone("");
        setWilaya("");
        setAddress("");
        close();
      }, 2600);
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && close()}
          className="fixed inset-0 z-[60] flex justify-end bg-black/80"
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="flex h-full w-full max-w-md flex-col border-l border-neutral-900 bg-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-900 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gold">
                <ShoppingBag size={16} /> Your cart {count > 0 && `(${count})`}
              </h3>
              <button onClick={close} className="text-neutral-400 hover:text-white" aria-label="Close cart">
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            {status === "done" ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <CheckCircle2 className="mb-3 text-emerald-400" size={40} />
                <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">Order received</p>
                <p className="mt-1 text-xs font-light text-neutral-400">
                  We&apos;ll confirm with you shortly. Thank you for choosing GLITCH.
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-neutral-500">
                <ShoppingBag size={40} className="mb-3 text-neutral-700" />
                <p className="text-sm">Your cart is empty.</p>
                <button
                  onClick={close}
                  className="mt-4 rounded-full border border-gold/40 px-5 py-2 text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-black"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4">
                  {items.map((i) => (
                    <div key={i.key} className="mb-3 flex gap-3 rounded-xl border border-neutral-900 bg-black p-3">
                      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
                        {i.image && (
                          <Image src={i.image} alt="" fill className="object-cover" unoptimized={i.image.startsWith("data:")} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="serif-title truncate text-sm text-white">{i.name}</h4>
                          <button
                            onClick={() => removeItem(i.key)}
                            className="flex-shrink-0 text-neutral-600 hover:text-red-500"
                            aria-label="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="mt-0.5 text-[11px] text-neutral-500">
                          {i.size} / {i.color}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setQty(i.key, i.qty - 1)}
                              className="flex h-6 w-6 items-center justify-center rounded border border-neutral-700 text-neutral-300 hover:border-gold hover:text-gold"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm text-white">{i.qty}</span>
                            <button
                              onClick={() => setQty(i.key, i.qty + 1)}
                              className="flex h-6 w-6 items-center justify-center rounded border border-neutral-700 text-neutral-300 hover:border-gold hover:text-gold"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-gold">{formatDA(i.price * i.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer / checkout */}
                <div className="border-t border-neutral-900 p-4">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="uppercase tracking-widest text-neutral-400">Total</span>
                    <span className="text-lg font-semibold text-gold">{formatDA(subtotal)}</span>
                  </div>

                  {!checkout ? (
                    <button
                      onClick={() => setCheckout(true)}
                      className="w-full rounded-full bg-white py-3 text-xs font-semibold uppercase tracking-widest text-black transition-all hover:bg-gold"
                    >
                      Checkout
                    </button>
                  ) : (
                    <div className="rounded-xl border border-neutral-900 bg-black p-3">
                      <Field placeholder="Full name" value={name} onChange={setName} />
                      <Field placeholder="Phone number" value={phone} onChange={setPhone} type="tel" />
                      <Field placeholder="Wilaya (optional)" value={wilaya} onChange={setWilaya} />
                      <Field placeholder="Address (optional)" value={address} onChange={setAddress} />

                      {/* Honeypot */}
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="hidden"
                        aria-hidden="true"
                      />

                      {error && <p className="mb-2 text-[11px] text-red-500">{error}</p>}

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          disabled={status === "loading"}
                          onClick={() => submit("whatsapp")}
                          className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:brightness-110 disabled:opacity-60"
                        >
                          {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
                          WhatsApp
                        </button>
                        <button
                          disabled={status === "loading"}
                          onClick={() => submit("email")}
                          className="flex items-center justify-center gap-2 rounded-full bg-gold py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white disabled:opacity-60"
                        >
                          {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                          Email
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mb-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white outline-none transition-colors focus:border-gold"
    />
  );
}
