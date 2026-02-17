"use client";

import Link from "next/link";
import { useCart } from "@/components/ui/CartContextProvider";
import { Currency } from "@/components/store/Currency";

export function CartView() {
  const { cart, isLoading, updateItemQuantity, removeItem } = useCart();

  if (isLoading) {
    return <p className="text-white/70">Loading cart...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/40 p-8 text-center backdrop-blur-xl">
        <p className="text-lg font-semibold text-white">Your cart is empty</p>
        <p className="mt-2 text-white/70">Add products to continue checkout.</p>
        <Link
          href="/products"
          className="mt-5 inline-flex rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-white transition hover:bg-white hover:text-black"
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
          <article key={item.id} className="rounded-2xl border border-white/12 bg-black/35 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1">
                <Link href={`/products/${item.slug}`} className="text-base font-semibold text-white hover:text-white/80">
                  {item.name}
                </Link>
                <p className="text-sm text-white/60">
                  Unit: <Currency cents={item.unitPrice} />
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="rounded-lg border border-white/20 px-2 py-1 text-white"
                >
                  -
                </button>
                <span className="w-8 text-center text-white">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  className="rounded-lg border border-white/20 px-2 py-1 text-white"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-lg border border-red-500/40 px-3 py-1 text-red-200"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </section>

      <aside className="h-fit rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl">
        <h2 className="text-lg font-semibold text-white">Summary</h2>
        <div className="mt-4 space-y-2 text-sm text-white/80">
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
          <div className="flex justify-between border-t border-white/10 pt-2 font-semibold text-white">
            <span>Total</span>
            <span>
              <Currency cents={cart.totals.finalTotal} />
            </span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="mt-4 inline-flex w-full justify-center rounded-xl border border-white/25 bg-white px-4 py-2 text-black transition hover:bg-white/85"
        >
          Continue to checkout
        </Link>
      </aside>
    </div>
  );
}
