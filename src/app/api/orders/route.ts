import { NextRequest, NextResponse } from "next/server";
import { getOrders, updateOrderStatus } from "@/lib/store";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ orders: await getOrders() });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body: { id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const allowed = ["new", "confirmed", "delivered", "cancelled"];
  if (!body.id || !body.status || !allowed.includes(body.status)) {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }
  await updateOrderStatus(body.id, body.status as never);
  return NextResponse.json({ ok: true });
}
