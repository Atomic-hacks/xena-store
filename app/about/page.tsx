import { Metadata } from "next";
import { GlassPanel, PageShell } from "@/components/store/PageShell";

export const metadata: Metadata = {
  title: "About",
  description: "About Xena Store.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <GlassPanel>
        <h1 className="text-3xl font-bold text-white">About Xena Store</h1>
        <p className="mt-3 max-w-3xl text-white/75">
          Xena Store is a curated gadget shop focused on quality gear, transparent pricing, and a direct WhatsApp checkout experience.
        </p>
      </GlassPanel>
    </PageShell>
  );
}
