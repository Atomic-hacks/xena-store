import { DiscountType } from "@prisma/client";

export type DiscountSnapshot = {
  type: DiscountType;
  value: number;
};

export function applyDiscount(basePrice: number, discount: DiscountSnapshot): number {
  if (discount.type === DiscountType.PERCENT) {
    return Math.max(basePrice - Math.round((basePrice * discount.value) / 100), 0);
  }

  if (discount.type === DiscountType.FIXED) {
    return Math.max(basePrice - discount.value, 0);
  }

  return basePrice;
}

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatCurrencyFromCents(cents: number): string {
  return nairaFormatter.format(cents / 100);
}
