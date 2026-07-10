import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createSessionCookie, clearSessionCookie, isAuthenticated } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ authenticated: isAuthenticated() });
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`login:${ip}`, 6, 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts." }, { status: 429 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!body.password || !checkPassword(body.password)) {
    return NextResponse.json({ ok: false, error: "Invalid access key." }, { status: 401 });
  }

  createSessionCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
