import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { ensureBootstrapAdmin, loginAdmin, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await ensureBootstrapAdmin();

    const body = (await request.json()) as LoginBody;
    if (!body.username || !body.password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const token = await loginAdmin(body.username, body.password);

    if (!token) {
      logger.warn("admin.login.invalid");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    logger.info("admin.session.cookie.set");
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    logger.error("api.admin.login.error");
    if (error instanceof Error) {
      logger.error("api.admin.login.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
