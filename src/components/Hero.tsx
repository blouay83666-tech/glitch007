"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

// 3D scene only runs on the client (WebGL / no SSR).
const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

export default function Hero() {
  return (
    <header className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden">
      {/* 3D backdrop */}
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>

      {/* gradient framing */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-ink" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.7)_100%)]" />

      <div className="relative z-20 flex flex-col items-center px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-4 text-[11px] uppercase tracking-[0.5em] text-gold"
        >
          Haute Couture · Neo Street · 2026
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="serif-title text-5xl font-light uppercase leading-none tracking-wide text-white sm:text-7xl md:text-8xl"
        >
          The <span className="gold-text animate-shimmer">Glitched</span>
          <br /> Collection
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-6 max-w-md text-sm font-light leading-relaxed text-neutral-400"
        >
          Oversized silhouettes, heavyweight cotton and hand-finished gold broderie.
          Order in seconds via WhatsApp or email.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#collections"
            className="rounded-full bg-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-black transition-all hover:bg-white"
          >
            Explore the drop
          </a>
          <a
            href="#broderie"
            className="rounded-full border border-white/25 px-8 py-3.5 text-xs uppercase tracking-widest text-white transition-all hover:border-gold hover:text-gold"
          >
            Broderie line
          </a>
        </motion.div>
      </div>

      <a
        href="#collections"
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-neutral-500 transition-colors hover:text-gold"
        aria-label="Scroll"
      >
        <ArrowDown size={20} className="animate-bounce" />
      </a>
    </header>
  );
}
