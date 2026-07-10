import { NextRequest, NextResponse } from "next/server";
import {
  getCategories,
  addCategory,
  deleteCategory,
  categoryExists,
  categoryHasProducts,
} from "@/lib/store";
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

  if (await categoryExists(parsed.data.id)) {
    return NextResponse.json({ ok: false, error: "Category already exists." }, { status: 409 });
  }

  try {
    const categories = await addCategory(parsed.data);
    return NextResponse.json({ ok: true, categories });
  } catch (err) {
    console.error("categories: add failed", err);
    return NextResponse.json({ ok: false, error: "Could not add category." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });

  if (await categoryHasProducts(id)) {
    return NextResponse.json(
      { ok: false, error: "Category still has products. Move or delete them first." },
      { status: 409 }
    );
  }

  try {
    const categories = await deleteCategory(id);
    return NextResponse.json({ ok: true, categories });
  } catch (err) {
    console.error("categories: delete failed", err);
    return NextResponse.json({ ok: false, error: "Could not delete category." }, { status: 500 });
  }
}
