import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { signSessionToken, verifySessionToken } from "@/lib/session-token";

export const CUSTOMER_COOKIE_NAME = "xena_customer_session";
export const CUSTOMER_SESSION_MAX_AGE = 60 * 60 * 24 * 180;

export async function getCustomerFromCookie(): Promise<{
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  defaultLocation: string | null;
} | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    logger.error("customer.session.secret.missing");
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  logger.info("customer.session.cookie.read", { hasCookie: Boolean(token) });
  if (!token) {
    return null;
  }

  const payload = await verifySessionToken(token, secret);
  if (!payload?.uid) {
    return null;
  }

  const customer = await prisma.customerProfile.findUnique({
    where: { id: payload.uid },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      defaultLocation: true,
    },
  });

  return customer;
}

export async function signCustomerSession(customerId: string): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    logger.error("customer.session.secret.missing");
    throw new Error("SESSION_SECRET is not configured");
  }

  return signSessionToken(
    { uid: customerId, exp: Date.now() + CUSTOMER_SESSION_MAX_AGE * 1000 },
    secret
  );
}
