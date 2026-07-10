import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/store";
import { productSchema } from "@/lib/validation";
import { isAuthenticated } from "@/lib/auth";

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

  const products = await getProducts();
  const input = parsed.data;
  let saved;

  if (input.id && products.some((p) => p.id === input.id)) {
    // update existing
    saved = { ...products.find((p) => p.id === input.id)!, ...input, id: input.id };
    await saveProducts(products.map((p) => (p.id === input.id ? saved! : p)));
  } else {
    // create new
    saved = { ...input, id: input.id ?? Date.now() };
    await saveProducts([saved, ...products]);
  }

  return NextResponse.json({ ok: true, product: saved });
}
