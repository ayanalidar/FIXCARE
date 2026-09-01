import { cookies } from "next/headers";
import crypto from "node:crypto";

const SESSION_COOKIE = "fixcare_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET env var required");
  return secret;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export async function createSession(): Promise<void> {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `admin:${expiresAt}`;
  const signature = sign(payload);
  const token = `${payload}.${signature}`;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return false;
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return false;
    const expectedSig = sign(payload);
    if (signature !== expectedSig) return false;
    const [, expiresAtStr] = payload.split(":");
    const expiresAt = parseInt(expiresAtStr, 10);
    if (Number.isNaN(expiresAt)) return false;
    if (Date.now() > expiresAt) return false;
    return true;
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
