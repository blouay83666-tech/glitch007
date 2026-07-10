import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "glitch_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): string {
  return process.env.SESSION_SECRET || "glitch-dev-secret-change-me";
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "louayben2026";
}

// Signed token: <expiry>.<hmac(expiry)>
function sign(expiry: number): string {
  const h = crypto.createHmac("sha256", secret()).update(String(expiry)).digest("hex");
  return `${expiry}.${h}`;
}

function verify(token: string | undefined): boolean {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = crypto.createHmac("sha256", secret()).update(expStr).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function checkPassword(input: string): boolean {
  const expected = adminPassword();
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createSessionCookie() {
  const expiry = Date.now() + MAX_AGE * 1000;
  cookies().set(COOKIE_NAME, sign(expiry), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export function isAuthenticated(): boolean {
  return verify(cookies().get(COOKIE_NAME)?.value);
}
