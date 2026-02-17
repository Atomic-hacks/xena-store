import { PageShell } from "@/components/store/PageShell";

export default function ProductDetailLoading() {
  return (
    <PageShell>
      <section
        aria-busy="true"
        className="grid animate-pulse gap-6 rounded-3xl bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.09)] md:p-6 lg:grid-cols-[1.2fr_1fr]"
      >
        <div className="space-y-3">
          <div className="h-[360px] w-full rounded-3xl bg-neutral-200" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-24 rounded-xl bg-neutral-200" />
            <div className="h-24 rounded-xl bg-neutral-200" />
            <div className="h-24 rounded-xl bg-neutral-200" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-neutral-200" />
          <div className="h-10 w-3/4 rounded bg-neutral-200" />
          <div className="h-4 w-full rounded bg-neutral-200" />
          <div className="h-4 w-5/6 rounded bg-neutral-200" />
          <div className="h-10 w-1/3 rounded bg-neutral-200" />
          <div className="h-11 w-full rounded-full bg-neutral-200" />
        </div>
      </section>
    </PageShell>
  );
}
