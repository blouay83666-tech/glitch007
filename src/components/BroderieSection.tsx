"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatDA } from "@/lib/format";

export default function BroderieSection({
  products,
  onOpen,
}: {
  products: Product[];
  onOpen?: (p: Product) => void;
}) {
  if (!products.length) return null;
  return (
    <section
      id="broderie"
      className="relative overflow-hidden border-y border-neutral-900 bg-gradient-to-b from-black via-panel to-black py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12 max-w-xl">
          <span className="text-[11px] uppercase tracking-[0.4em] text-gold">Hand-finished</span>
          <h2 className="serif-title mt-2 text-4xl text-white md:text-5xl">The Broderie line</h2>
          <p className="mt-4 text-sm font-light leading-relaxed text-neutral-400">
            Gold-thread embroidery on heavyweight cotton — each piece finished by hand.
            Our signature broderie capsule, made in limited runs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => onOpen?.(p)}
              className="group relative h-[460px] overflow-hidden rounded-2xl border border-neutral-900 text-left"
            >
              {p.images?.[0] && (
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized={p.images[0].startsWith("data:")}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold">Broderie</span>
                <h3 className="serif-title mt-1 text-2xl text-white">{p.name}</h3>
                <p className="mt-1 font-medium text-gold">{formatDA(p.price)}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
