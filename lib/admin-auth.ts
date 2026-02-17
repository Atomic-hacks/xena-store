import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { signSessionToken, verifySessionToken } from "@/lib/session-token";

export const ADMIN_COOKIE_NAME = "xena_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function ensureBootstrapAdmin(): Promise<void> {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    logger.warn("admin.bootstrap.skipped");
    return;
  }

  logger.info("admin.bootstrap.lookup");
  const existing = await prisma.adminUser.findUnique({ where: { username } });

  if (existing) {
    logger.info("admin.bootstrap.exists");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  logger.info("admin.bootstrap.create");

  await prisma.adminUser.create({
    data: {
      username,
      passwordHash,
    },
  });
}

export async function loginAdmin(username: string, password: string): Promise<string | null> {
  logger.info("admin.login.lookup");
  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) {
    return null;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return null;
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    logger.error("admin.session.secret.missing");
    throw new Error("SESSION_SECRET is not configured");
  }

  const token = await signSessionToken(
    { uid: user.id, exp: Date.now() + SESSION_MAX_AGE * 1000 },
    secret
  );

  return token;
}

export async function getAdminFromCookie(): Promise<string | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    logger.error("admin.session.secret.missing");
    return null;
  }

  const cookieStore = await cookies();
  logger.info("admin.session.cookie.read");
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = await verifySessionToken(token, secret);
  if (!payload) {
    return null;
  }

  return payload.uid;
}
