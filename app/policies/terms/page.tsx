import { Metadata } from "next";
import { GlassPanel, PageShell } from "@/components/store/PageShell";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms and conditions.",
};

export default function TermsPage() {
  return (
    <PageShell>
      <GlassPanel>
        <h1 className="text-3xl font-bold text-neutral-900">Terms</h1>
        <p className="mt-3 text-neutral-600">By placing an order, you agree to product availability and pricing confirmation at checkout.</p>
      </GlassPanel>
    </PageShell>
  );
}
