import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session-token";

const ADMIN_COOKIE_NAME = "xena_admin_session";

async function isAuthorized(request: NextRequest): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return false;
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    return false;
  }

  const payload = await verifySessionToken(token, secret);
  return Boolean(payload?.uid);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminLoginApi = pathname === "/api/admin/login";

  if (isAdminLoginPage || isAdminLoginApi) {
    return NextResponse.next();
  }

  const ok = await isAuthorized(request);
  if (ok) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL("/admin/login", request.url);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
