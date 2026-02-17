import { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/store/PageShell";
import { getCategoriesWithCounts } from "@/lib/store";
import { STOREFRONT_CATEGORY_LABELS, toKebab } from "@/lib/storefront";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse product categories.",
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();
  const map = new Map(categories.map((category) => [category.name.toLowerCase(), category]));

  return (
    <PageShell className="space-y-6 pb-12">
      <section className="rounded-3xl border border-white/12 bg-[linear-gradient(165deg,rgba(36,29,56,0.2)_0%,rgba(10,10,13,0.84)_74%)] p-5 md:p-7">
        <h1 className="font-[var(--font-azonix)] text-2xl uppercase tracking-[0.08em] text-white md:text-3xl">Categories</h1>
        <p className="mt-2 text-sm text-white/70">Explore gadgets by category and find the right fit faster.</p>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {STOREFRONT_CATEGORY_LABELS.map((label) => {
          const fromDb = map.get(label.toLowerCase());
          const href = fromDb ? `/categories/${fromDb.slug}` : `/products?category=${toKebab(label)}`;
          const count = fromDb?.count ?? 0;

          return (
            <Link
              key={label}
              href={href}
              className="rounded-2xl border border-white/12 bg-[rgba(18,18,24,0.72)] p-4 transition hover:border-white/25"
            >
              <p className="text-sm font-semibold text-white sm:text-base">{label}</p>
              <p className="mt-1 text-xs text-white/60">{count} products</p>
            </Link>
          );
        })}
      </section>
    </PageShell>
  );
}
