"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, MessageCircle, Mail, Loader2, CheckCircle2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatDA } from "@/lib/format";

type Channel = "whatsapp" | "email";

export default function ProductModal({
  product,
  categoryName,
  onClose,
}: {
  product: Product | null;
  categoryName: string;
  onClose: () => void;
}) {
  const [mainImg, setMainImg] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [address, setAddress] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setMainImg(product.images?.[0] || "");
      setColor(product.colors?.[0] || "Standard");
      setSize(product.sizes?.[0] || "M");
      setShowForm(false);
      setName("");
      setPhone("");
      setWilaya("");
      setAddress("");
      setCompany("");
      setStatus("idle");
      setError("");
    }
  }, [product]);

  async function submit(channel: Channel) {
    if (!product) return;
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
          product: product.name,
          color,
          size,
          price: product.price,
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
      setTimeout(onClose, 2600);
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/95 p-4 md:items-center"
        >
          <motion.div
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            className="relative my-auto grid w-full max-w-5xl grid-cols-1 gap-6 rounded-2xl border border-neutral-900 bg-panel p-4 md:grid-cols-2 md:gap-8 md:p-10"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-3 z-10 text-neutral-400 transition-colors hover:text-white"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Images */}
            <div className="flex flex-col gap-3">
              <div className="relative h-[320px] overflow-hidden rounded-xl border border-neutral-900 bg-black sm:h-[420px] md:h-[500px]">
                {mainImg && (
                  <Image
                    src={mainImg}
                    alt={product.name}
                    fill
                    sizes="(max-width:768px) 100vw, 40vw"
                    className="object-contain"
                    unoptimized={mainImg.startsWith("data:")}
                  />
                )}
              </div>
              {product.images.length > 1 && (
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((url) => (
                    <button
                      key={url}
                      onClick={() => setMainImg(url)}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        mainImg === url ? "border-gold" : "border-neutral-800 opacity-60"
                      }`}
                    >
                      <Image src={url} alt="" fill className="object-cover" unoptimized={url.startsWith("data:")} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <span className="mb-1 block text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                {categoryName}
              </span>
              <h2 className="serif-title mb-3 text-3xl text-white md:text-4xl">{product.name}</h2>
              <p className="mb-4 text-sm font-light leading-relaxed text-neutral-400">
                {product.description}
              </p>

              <div className="mb-5 flex items-baseline gap-3 border-b border-neutral-900 pb-4">
                <span className="text-3xl font-medium tracking-wide text-gold md:text-4xl">
                  {formatDA(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-base font-light text-neutral-600 line-through">
                    {formatDA(product.oldPrice)}
                  </span>
                )}
              </div>

              <Selector label="Color" options={product.colors} value={color} onChange={setColor} />
              <Selector label="Size" options={product.sizes} value={size} onChange={setSize} />

              {!showForm && status !== "done" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 w-full rounded-full bg-white py-3.5 text-xs font-semibold uppercase tracking-widest text-black transition-all hover:bg-gold"
                >
                  Order now
                </button>
              )}

              {showForm && status !== "done" && (
                <div className="mt-4 rounded-xl border border-neutral-900 bg-black p-4">
                  <h4 className="mb-3 border-b border-neutral-900 pb-2 text-xs uppercase tracking-widest text-gold">
                    Your details
                  </h4>
                  <Field placeholder="Full name" value={name} onChange={setName} />
                  <Field placeholder="Phone number" value={phone} onChange={setPhone} type="tel" />
                  <Field placeholder="Wilaya (optional)" value={wilaya} onChange={setWilaya} />
                  <Field placeholder="Address (optional)" value={address} onChange={setAddress} />

                  {/* Honeypot — hidden from humans, catches bots */}
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
                  <p className="mt-3 text-[10px] leading-relaxed text-neutral-600">
                    Protected order form. Your details are validated and rate-limited before being sent.
                  </p>
                </div>
              )}

              {status === "done" && (
                <div className="mt-4 flex flex-col items-center rounded-xl border border-emerald-600/50 bg-emerald-950/30 p-6 text-center">
                  <CheckCircle2 className="mb-2 text-emerald-400" size={32} />
                  <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                    Order received
                  </p>
                  <p className="mt-1 text-xs font-light text-neutral-400">
                    We&apos;ll confirm with you shortly. Thank you for choosing GLITCH.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Selector({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const opts = options.length ? options : ["Standard"];
  return (
    <div className="mb-5">
      <h4 className="mb-2 text-[11px] uppercase tracking-widest text-neutral-400">Select {label}</h4>
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full border px-4 py-1.5 text-xs uppercase transition-colors ${
              value === o
                ? "border-gold font-semibold text-gold"
                : "border-neutral-800 text-white hover:border-neutral-600"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
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
      className="mb-3 w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white outline-none transition-colors focus:border-gold"
    />
  );
}
