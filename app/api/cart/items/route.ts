import { DiscountType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { CART_COOKIE_MAX_AGE, CART_COOKIE_NAME, calculateCartTotals } from "@/lib/cart";

type AddItemBody = {
  productId?: string;
  quantity?: number;
};

async function resolveCartId(cookieCartId?: string) {
  if (cookieCartId) {
    logger.info("cart.cookie.read", { hasCookie: true });
    logger.info("db.cart.findUnique", { cartId: cookieCartId });
    const existing = await prisma.cart.findUnique({ where: { id: cookieCartId } });
    if (existing) {
      return { cartId: existing.id, created: false };
    }
  }

  logger.info("db.cart.create");
  const created = await prisma.cart.create({ data: {} });
  return { cartId: created.id, created: true };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as AddItemBody;
    const quantity = Number(body.quantity ?? 1);

    if (!body.productId || !Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const cookieCartId = request.cookies.get(CART_COOKIE_NAME)?.value;
    const resolved = await resolveCartId(cookieCartId);

    logger.info("db.product.findUnique", { productId: body.productId });
    const product = await prisma.product.findUnique({ where: { id: body.productId } });

    if (!product || product.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Product not available" }, { status: 404 });
    }

    logger.info("db.cartItem.findUnique", { cartId: resolved.cartId, productId: body.productId });
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: resolved.cartId,
          productId: body.productId,
        },
      },
    });

    if (existingItem) {
      logger.info("db.cartItem.update", { itemId: existingItem.id });
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      logger.info("db.cartItem.create", { cartId: resolved.cartId, productId: body.productId });
      await prisma.cartItem.create({
        data: {
          cartId: resolved.cartId,
          productId: body.productId,
          quantity,
          unitPriceSnapshot: product.price,
          discountSnapshot: {
            type: product.discountType ?? DiscountType.NONE,
            value: product.discountValue ?? 0,
          },
        },
      });
    }

    logger.info("db.cart.findUnique.withItems", { cartId: resolved.cartId });
    const cart = await prisma.cart.findUnique({
      where: { id: resolved.cartId },
      include: {
        items: {
          include: { product: { include: { category: true } } },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const response = NextResponse.json(calculateCartTotals(cart));

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
    logger.error("api.cart.items.post.error");
    if (error instanceof Error) {
      logger.error("api.cart.items.post.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
