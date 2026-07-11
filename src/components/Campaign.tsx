"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { SliderSlide } from "@/lib/types";

export default function Campaign({ slides }: { slides: SliderSlide[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) return null;
  const slide = slides[idx];

  return (
    <section className="relative h-[92svh] min-h-[560px] w-full overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover"
            unoptimized={slide.image.startsWith("data:")}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-ink" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <span className="mb-2 text-[11px] uppercase tracking-[0.4em] text-gold">{slide.subtitle}</span>
        <h2 className="serif-title text-3xl font-light uppercase tracking-wide text-white md:text-6xl">
          {slide.title}
        </h2>
        <a
          href="#collections"
          className="mt-6 rounded-full border border-white/30 bg-black/30 px-6 py-2.5 text-xs uppercase tracking-widest backdrop-blur transition-all hover:border-gold hover:text-gold"
        >
          Explore
        </a>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-6 bg-gold" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
