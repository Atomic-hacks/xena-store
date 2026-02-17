import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { calculateCartTotals, CART_COOKIE_MAX_AGE, CART_COOKIE_NAME } from "@/lib/cart";

async function resolveCartId(cookieCartId?: string) {
  if (cookieCartId) {
    logger.info("cart.cookie.read", { hasCookie: true });
    logger.info("db.cart.findUnique", { cartId: cookieCartId });
    const existing = await prisma.cart.findUnique({ where: { id: cookieCartId } });
    if (existing) {
      return { cartId: existing.id, created: false };
    }
    logger.warn("cart.cookie.invalid", { cartId: cookieCartId });
  } else {
    logger.info("cart.cookie.read", { hasCookie: false });
  }

  logger.info("db.cart.create");
  const created = await prisma.cart.create({ data: {} });
  logger.info("cart.created", { cartId: created.id });
  return { cartId: created.id, created: true };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const cookieCartId = request.cookies.get(CART_COOKIE_NAME)?.value;
    const resolved = await resolveCartId(cookieCartId);

    logger.info("db.cart.findUnique.withItems", { cartId: resolved.cartId });
    const cart = await prisma.cart.findUnique({
      where: { id: resolved.cartId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!cart) {
      logger.error("cart.resolve.failed", { cartId: resolved.cartId });
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const payload = calculateCartTotals(cart);
    const response = NextResponse.json(payload);

    if (resolved.created || cookieCartId !== resolved.cartId) {
      logger.info("cart.cookie.set", { cartId: resolved.cartId });
      response.cookies.set(CART_COOKIE_NAME, resolved.cartId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: CART_COOKIE_MAX_AGE,
      });
    }

    return response;
  } catch (error) {
    logger.error("api.cart.get.error");
    if (error instanceof Error) {
      logger.error("api.cart.get.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
  }
}
