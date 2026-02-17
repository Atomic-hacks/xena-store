import { Metadata } from "next";
import { CheckoutForm } from "@/components/store/CheckoutForm";
import { GlassPanel, PageShell } from "@/components/store/PageShell";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your checkout through WhatsApp with a saved customer profile.",
};

export default function CheckoutPage() {
  return (
    <PageShell className="space-y-4">
      <GlassPanel>
        <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
        <p className="mt-1 text-neutral-600">
          Save a quick profile, then place your order on WhatsApp with persistent history.
        </p>
      </GlassPanel>
      <CheckoutForm />
    </PageShell>
  );
}
