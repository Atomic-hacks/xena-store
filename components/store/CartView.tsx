"use client";

import Link from "next/link";
import { useCart } from "@/components/ui/CartContextProvider";
import { Currency } from "@/components/store/Currency";

export function CartView() {
  const { cart, isLoading, updateItemQuantity, removeItem } = useCart();

  if (isLoading) {
    return <p className="text-neutral-600">Loading cart...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
        <p className="text-lg font-semibold text-neutral-900">Your cart is empty</p>
        <p className="mt-2 text-neutral-600">Add products to continue checkout.</p>
        <Link
          href="/products"
          className="mt-5 inline-flex rounded-full bg-black px-5 py-2 text-white transition hover:bg-neutral-800"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-3">
        {cart.items.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1">
                <Link href={`/products/${item.slug}`} className="text-base font-semibold text-neutral-900 hover:text-neutral-700">
                  {item.name}
                </Link>
                <p className="text-sm text-neutral-500">
                  Unit: <Currency cents={item.unitPrice} />
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-700"
                >
                  -
                </button>
                <span className="w-8 text-center text-neutral-900">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-700"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-full bg-red-50 px-3 py-1 text-red-600"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </section>

      <aside className="h-fit rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.07)]">
        <h2 className="text-lg font-semibold text-neutral-900">Summary</h2>
        <div className="mt-4 space-y-2 text-sm text-neutral-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              <Currency cents={cart.totals.subtotal} />
            </span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>
              -<Currency cents={cart.totals.discountTotal} />
            </span>
          </div>
          <div className="flex justify-between border-t border-neutral-200 pt-2 font-semibold text-neutral-900">
            <span>Total</span>
            <span>
              <Currency cents={cart.totals.finalTotal} />
            </span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="mt-4 inline-flex w-full justify-center rounded-full bg-black px-4 py-2 text-white transition hover:bg-neutral-800"
        >
          Continue to checkout
        </Link>
      </aside>
    </div>
  );
}
