import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { calculateCartTotals } from "@/lib/cart";

type UpdateBody = {
  quantity?: number;
};

async function fetchCartFromItem(itemId: string) {
  logger.info("db.cartItem.findUnique", { itemId });
  const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!cartItem) {
    return null;
  }

  logger.info("db.cart.findUnique.withItems", { cartId: cartItem.cartId });
  const cart = await prisma.cart.findUnique({
    where: { id: cartItem.cartId },
    include: {
      items: {
        include: {
          product: {
            include: { category: true },
          },
        },
      },
    },
  });

  return { cartItem, cart };
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateBody;
    const quantity = Number(body.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Quantity must be greater than zero" }, { status: 400 });
    }

    logger.info("db.cartItem.update", { itemId: id });
    await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    const result = await fetchCartFromItem(id);
    if (!result?.cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(calculateCartTotals(result.cart));
  } catch (error) {
    logger.error("api.cart.items.patch.error");
    if (error instanceof Error) {
      logger.error("api.cart.items.patch.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    logger.info("db.cartItem.findUnique", { itemId: id });
    const item = await prisma.cartItem.findUnique({ where: { id } });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    logger.info("db.cartItem.delete", { itemId: id });
    await prisma.cartItem.delete({ where: { id } });

    logger.info("db.cart.findUnique.withItems", { cartId: item.cartId });
    const cart = await prisma.cart.findUnique({
      where: { id: item.cartId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(calculateCartTotals(cart));
  } catch (error) {
    logger.error("api.cart.items.delete.error");
    if (error instanceof Error) {
      logger.error("api.cart.items.delete.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
