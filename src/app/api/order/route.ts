import { NextRequest, NextResponse } from "next/server";
import { orderSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { addOrder } from "@/lib/store";
import { sendOrderEmail } from "@/lib/email";
import { buildWhatsappUrl } from "@/lib/format";
import type { Order } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`order:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Invalid order data." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot triggered: pretend success, drop silently.
  if (data.company) {
    return NextResponse.json({ ok: true, whatsappUrl: null });
  }

  const order: Order = {
    id: `ord_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    date: new Date().toISOString(),
    customer: data.customer,
    phone: data.phone,
    wilaya: data.wilaya,
    address: data.address,
    product: data.product,
    color: data.color,
    size: data.size,
    price: data.price,
    channel: data.channel,
    status: "new",
  };

  await addOrder(order);

  // Best-effort email notification to the store owner for EVERY order (WhatsApp
  // or Email), so a copy always lands in the inbox. Never blocks the customer.
  void sendOrderEmail(order);

  const whatsappUrl = data.channel === "whatsapp" ? buildWhatsappUrl(order) : null;

  return NextResponse.json({ ok: true, whatsappUrl });
}
