import { NextRequest, NextResponse } from "next/server";
import { getCategories, saveCategories, getProducts } from "@/lib/store";
import { categorySchema } from "@/lib/validation";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ categories: await getCategories() });
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

  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid category." }, { status: 400 });
  }

  const categories = await getCategories();
  if (categories.some((c) => c.id === parsed.data.id)) {
    return NextResponse.json({ ok: false, error: "Category already exists." }, { status: 409 });
  }

  const next = [...categories, parsed.data];
  await saveCategories(next);
  return NextResponse.json({ ok: true, categories: next });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });

  const products = await getProducts();
  if (products.some((p) => p.category === id)) {
    return NextResponse.json(
      { ok: false, error: "Category still has products. Move or delete them first." },
      { status: 409 }
    );
  }

  const categories = (await getCategories()).filter((c) => c.id !== id);
  await saveCategories(categories);
  return NextResponse.json({ ok: true, categories });
}
