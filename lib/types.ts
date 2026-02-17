export type CartLine = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  unitPrice: number;
  discountType: "NONE" | "PERCENT" | "FIXED";
  discountValue: number;
  lineSubtotal: number;
  lineTotal: number;
  image: string;
  stock: number;
};

export type CartPayload = {
  cartId: string;
  items: CartLine[];
  totals: {
    subtotal: number;
    discountTotal: number;
    finalTotal: number;
    itemCount: number;
  };
};
