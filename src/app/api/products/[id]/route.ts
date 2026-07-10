import { NextResponse } from "next/server";
import { deleteProduct } from "@/lib/store";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id." }, { status: 400 });
  }
  try {
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("products: delete failed", err);
    return NextResponse.json({ ok: false, error: "Could not delete product." }, { status: 500 });
  }
}
