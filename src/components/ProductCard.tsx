"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatDA } from "@/lib/format";

export default function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (p: Product) => void;
}) {
  const img = product.images?.[0] || "";
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      onClick={() => onOpen(product)}
      className="group block text-left"
    >
      <div className="relative h-[360px] overflow-hidden rounded-xl border border-neutral-900 bg-neutral-900 md:h-[440px]">
        {product.oldPrice && (
          <span className="absolute left-3 top-3 z-10 rounded-sm bg-gold px-2 py-0.5 text-[9px] font-bold uppercase text-black">
            Sale
          </span>
        )}
        {product.featured && (
          <span className="absolute right-3 top-3 z-10 rounded-sm border border-gold/50 bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase text-gold">
            Signature
          </span>
        )}
        {img ? (
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            unoptimized={img.startsWith("data:")}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-700">No image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="mt-3 text-center">
        <h3 className="serif-title text-base tracking-wide text-white transition-colors group-hover:text-gold">
          {product.name}
        </h3>
        <div className="mt-0.5 text-sm">
          {product.oldPrice ? (
            <>
              <span className="mr-2 font-light text-xs text-neutral-500 line-through">
                {formatDA(product.oldPrice)}
              </span>
              <span className="font-semibold text-gold">{formatDA(product.price)}</span>
            </>
          ) : (
            <span className="font-medium text-neutral-300">{formatDA(product.price)}</span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
