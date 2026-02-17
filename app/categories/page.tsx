import { Metadata } from "next";
import Link from "next/link";
import { getCategoriesWithCounts } from "@/lib/store";
import { GlassPanel, PageShell } from "@/components/store/PageShell";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse product categories.",
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <PageShell>
      <GlassPanel>
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="rounded-2xl border border-white/12 bg-black/35 p-4 transition hover:border-white/30"
            >
              <p className="text-lg font-semibold text-white">{category.name}</p>
              <p className="text-sm text-white/60">{category.count} products</p>
            </Link>
          ))}
        </div>
      </GlassPanel>
    </PageShell>
  );
}
