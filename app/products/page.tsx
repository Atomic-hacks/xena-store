import { Metadata } from "next";
import { Suspense } from "react";
import { ProductCondition } from "@prisma/client";
import { ProductTile } from "@/components/store/ProductTile";
import { ProductsToolbar } from "@/components/store/ProductsToolbar";
import { PageShell } from "@/components/store/PageShell";
import { getCategoriesWithCounts, getProducts } from "@/lib/store";
import { logger } from "@/lib/logger";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse premium gadgets, gaming devices, and accessories.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    condition?: ProductCondition;
    sort?: "latest" | "price_asc" | "price_desc";
  }>;
}) {
  const params = await searchParams;
  logger.info("products.page.request", {
    query: params.query?.trim() || "none",
    category: params.category || "all",
    condition: params.condition || "all",
    sort: params.sort || "latest",
  });

  const [products, categories] = await Promise.all([
    getProducts({
      query: params.query,
      category: params.category,
      condition: params.condition,
      sort: params.sort,
    }),
    getCategoriesWithCounts(),
  ]);

  return (
    <PageShell className="space-y-7 pb-12">
      <section className="space-y-4 rounded-3xl bg-white p-5 shadow-[0_16px_38px_rgba(15,23,42,0.08)] md:p-7">
        <h1 className="font-[var(--font-azonix)] text-2xl uppercase tracking-[0.08em] text-neutral-900 md:text-3xl">Shop Gadgets</h1>
        <p className="text-sm text-neutral-600">Filter products by category, condition, and pricing.</p>
        <Suspense fallback={null}>
          <ProductsToolbar categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
        </Suspense>
      </section>

      <section>
        {products.length === 0 ? (
          <p className="rounded-2xl bg-white p-4 text-neutral-600">
            No products match your current filters.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {products.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
