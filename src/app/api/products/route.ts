import { NextRequest, NextResponse } from "next/server";
import { getProducts, upsertProduct } from "@/lib/store";
import { productSchema } from "@/lib/validation";
import { isAuthenticated } from "@/lib/auth";
import type { Product } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ products: await getProducts() });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Invalid product." },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const product: Product = {
    id: input.id ?? Date.now(),
    name: input.name,
    category: input.category,
    price: input.price,
    oldPrice: input.oldPrice,
    sizes: input.sizes,
    colors: input.colors,
    description: input.description,
    images: input.images,
    featured: input.featured,
  };

  try {
    const saved = await upsertProduct(product);
    return NextResponse.json({ ok: true, product: saved });
  } catch (err) {
    console.error("products: save failed", err);
    return NextResponse.json({ ok: false, error: "Could not save product." }, { status: 500 });
  }
}
