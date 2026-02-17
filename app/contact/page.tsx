import { Metadata } from "next";
import { GlassPanel, PageShell } from "@/components/store/PageShell";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to contact Xena Store.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <GlassPanel>
        <h1 className="text-3xl font-bold text-neutral-900">Contact</h1>
        <p className="mt-3 text-neutral-600">Need help with a product or order? Reach us through our checkout WhatsApp line.</p>
      </GlassPanel>
    </PageShell>
  );
}
