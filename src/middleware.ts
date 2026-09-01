import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";

const SESSION_COOKIE = "fixcare_admin_session";

function sign(value: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Skip non-admin routes and the login route itself
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  const expectedSig = sign(payload, secret);
  if (signature !== expectedSig) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  // Check expiry
  const [, expiresAtStr] = payload.split(":");
  const expiresAt = parseInt(expiresAtStr || "0", 10);
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/admin/:path*"],
};
