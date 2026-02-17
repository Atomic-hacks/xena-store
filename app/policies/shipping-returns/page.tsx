import { Metadata } from "next";
import { GlassPanel, PageShell } from "@/components/store/PageShell";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Shipping and return policy.",
};

export default function ShippingReturnsPage() {
  return (
    <PageShell>
      <GlassPanel>
        <h1 className="text-3xl font-bold text-white">Shipping & Returns</h1>
        <p className="mt-3 text-white/75">Orders are confirmed via WhatsApp and fulfilled after manual verification.</p>
      </GlassPanel>
    </PageShell>
  );
}
