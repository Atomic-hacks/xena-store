import { DiscountType, Prisma } from "@prisma/client";
import { applyDiscount } from "@/lib/pricing";

export const CART_COOKIE_NAME = "cartId";
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            category: true;
          };
        };
      };
    };
  };
}>;

export function asDiscountSnapshot(value: unknown): { type: DiscountType; value: number } {
  if (!value || typeof value !== "object") {
    return { type: DiscountType.NONE, value: 0 };
  }

  const v = value as { type?: DiscountType; value?: number };

  if (!v.type || !Object.values(DiscountType).includes(v.type)) {
    return { type: DiscountType.NONE, value: 0 };
  }

  return {
    type: v.type,
    value: typeof v.value === "number" && Number.isFinite(v.value) ? v.value : 0,
  };
}

export function calculateCartTotals(cart: CartWithItems) {
  let subtotal = 0;
  let discountTotal = 0;

  const items = cart.items.map((item) => {
    const discount = asDiscountSnapshot(item.discountSnapshot);
    const discountedUnit = applyDiscount(item.unitPriceSnapshot, discount);
    const lineSubtotal = item.unitPriceSnapshot * item.quantity;
    const lineTotal = discountedUnit * item.quantity;

    subtotal += lineSubtotal;
    discountTotal += lineSubtotal - lineTotal;

    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      quantity: item.quantity,
      unitPrice: item.unitPriceSnapshot,
      discountType: discount.type,
      discountValue: discount.value,
      lineSubtotal,
      lineTotal,
      image: Array.isArray(item.product.images)
        ? String(item.product.images[0] ?? "/next.svg")
        : "/next.svg",
      stock: item.product.stock,
    };
  });

  return {
    cartId: cart.id,
    items,
    totals: {
      subtotal,
      discountTotal,
      finalTotal: subtotal - discountTotal,
      itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
    },
  };
}
