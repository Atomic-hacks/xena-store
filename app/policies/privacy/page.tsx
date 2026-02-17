import { Metadata } from "next";
import { GlassPanel, PageShell } from "@/components/store/PageShell";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <GlassPanel>
        <h1 className="text-3xl font-bold text-white">Privacy</h1>
        <p className="mt-3 text-white/75">Customer data is used only to process and fulfill confirmed orders.</p>
      </GlassPanel>
    </PageShell>
  );
}
