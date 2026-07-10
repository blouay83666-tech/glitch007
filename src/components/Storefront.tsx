"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Product, Category } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import BroderieSection from "./BroderieSection";

export default function Storefront({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [active, setActive] = useState<string>("all");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(
    () => (active === "all" ? products : products.filter((p) => p.category === active)),
    [active, products]
  );

  const broderie = useMemo(
    () => products.filter((p) => p.category === "broderie"),
    [products]
  );

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name || "Exclusive";

  return (
    <>
      <BroderieSection products={broderie} onOpen={setSelected} />

      <section id="collections" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-4 text-center">
          <span className="text-[11px] uppercase tracking-[0.4em] text-gold">The Collection</span>
          <h2 className="serif-title mt-2 text-4xl text-white md:text-5xl">Shop the drop</h2>
        </div>

        <div className="no-scrollbar mb-12 flex justify-start gap-3 overflow-x-auto border-b border-neutral-900 pb-4 md:justify-center md:gap-8">
          <Tab label="All" active={active === "all"} onClick={() => setActive("all")} />
          {categories.map((c) => (
            <Tab
              key={c.id}
              label={c.name}
              active={active === c.id}
              onClick={() => setActive(c.id)}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-xs uppercase tracking-widest text-neutral-600">
            No pieces found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={setSelected} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <ProductModal
        product={selected}
        categoryName={selected ? categoryName(selected.category) : ""}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap border-b-2 pb-3 text-xs uppercase tracking-widest transition-all ${
        active
          ? "border-gold font-semibold text-gold"
          : "border-transparent text-neutral-500 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
