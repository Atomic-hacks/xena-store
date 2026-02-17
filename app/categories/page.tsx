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
      <section className="rounded-3xl bg-white p-5 shadow-[0_16px_38px_rgba(15,23,42,0.08)] md:p-7">
        <h1 className="font-[var(--font-azonix)] text-2xl uppercase tracking-[0.08em] text-neutral-900 md:text-3xl">Categories</h1>
        <p className="mt-2 text-sm text-neutral-600">Explore gadgets by category and find the right fit faster.</p>
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
              className="rounded-3xl bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.08)] transition hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)]"
            >
              <p className="text-sm font-semibold text-neutral-900 sm:text-base">{label}</p>
              <p className="mt-1 text-xs text-neutral-500">{count} products</p>
            </Link>
          );
        })}
      </section>
    </PageShell>
  );
}
