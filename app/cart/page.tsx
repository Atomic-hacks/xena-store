import { Metadata } from "next";
import { CartView } from "@/components/store/CartView";
import { PageShell, GlassPanel } from "@/components/store/PageShell";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your cart before checkout.",
};

export default function CartPage() {
  return (
    <PageShell className="space-y-4">
      <GlassPanel>
        <h1 className="text-3xl font-bold text-neutral-900">Cart</h1>
        <p className="mt-1 text-neutral-600">Edit quantities and continue to checkout.</p>
      </GlassPanel>
      <CartView />
    </PageShell>
  );
}
