import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "glitch_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

// Ephemeral per-process secret used in production ONLY when SESSION_SECRET is
// not configured. This guarantees we never sign admin cookies with a value that
// is committed to the (public) repository — otherwise anyone could forge a
// session and skip the login entirely.
let runtimeSecret: string | null = null;

function secret(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.NODE_ENV !== "production") return "glitch-dev-secret-change-me";
  if (!runtimeSecret) {
    runtimeSecret = crypto.randomBytes(32).toString("hex");
    console.error(
      "auth: SESSION_SECRET is not set in production — using an ephemeral secret. " +
        "Set SESSION_SECRET in your environment so admin sessions survive restarts."
    );
  }
  return runtimeSecret;
}

// The admin password is read from the environment only. No real password is kept
// in the source tree. In development a well-known value is accepted so
// `npm run dev` works with zero setup; in production ADMIN_PASSWORD is required.
const DEV_PASSWORD = "glitch-dev";

function adminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
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
  if (!expected) {
    if (process.env.NODE_ENV !== "production") return input === DEV_PASSWORD;
    console.error("auth: ADMIN_PASSWORD is not set — refusing all admin logins.");
    return false;
  }
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
