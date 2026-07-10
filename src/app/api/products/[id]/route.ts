import { NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/store";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  const products = await getProducts();
  await saveProducts(products.filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}
