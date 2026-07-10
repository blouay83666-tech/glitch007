import { z } from "zod";

// Strip angle brackets to neutralise trivial HTML/script injection while
// preserving normal text, digits and punctuation.
const cleanString = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .transform((s) => s.replace(/[<>]/g, ""));

export const orderSchema = z.object({
  customer: cleanString(80),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(20)
    .regex(/^[0-9+\s().-]+$/, "Invalid phone number"),
  wilaya: z.string().trim().max(60).optional().default(""),
  address: z.string().trim().max(200).optional().default(""),
  product: cleanString(120),
  color: z.string().trim().max(60).default("N/A"),
  size: z.string().trim().max(20).default("N/A"),
  price: z.number().int().nonnegative().max(10_000_000),
  channel: z.enum(["whatsapp", "email"]),
  // honeypot: hidden field humans never see; if a bot fills it the order route
  // accepts the request but silently discards it (so bots can't detect the trap).
  company: z.string().max(200).optional().default(""),
});

export type OrderInput = z.infer<typeof orderSchema>;

export const productSchema = z.object({
  id: z.number().optional(),
  name: cleanString(120),
  category: cleanString(40),
  price: z.number().int().nonnegative().max(10_000_000),
  oldPrice: z.number().int().nonnegative().max(10_000_000).nullable().default(null),
  sizes: z.array(z.string().trim().max(20)).max(20).default([]),
  colors: z.array(z.string().trim().max(40)).max(30).default([]),
  description: z.string().trim().max(600).default(""),
  images: z.array(z.string().max(2_000_000)).max(8).default([]),
  featured: z.boolean().optional().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  id: cleanString(40).transform((s) => s.toLowerCase().replace(/\s+/g, "-")),
  name: cleanString(60),
});

export const sliderSchema = z.object({
  image: z.string().max(2_000_000),
  title: cleanString(60),
  subtitle: z.string().trim().max(60).default(""),
});
