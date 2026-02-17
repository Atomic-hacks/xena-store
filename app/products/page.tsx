import { Metadata } from "next";
import { Suspense } from "react";
import { PageShell, GlassPanel } from "@/components/store/PageShell";
import { ProductTile } from "@/components/store/ProductTile";
import { ProductsToolbar } from "@/components/store/ProductsToolbar";
import { getCategoriesWithCounts, getProducts } from "@/lib/store";
import { logger } from "@/lib/logger";
import { ProductCondition } from "@prisma/client";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all products with search, sort, and category filters.",
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
    <PageShell className="space-y-7 md:space-y-8">
      <GlassPanel>
        <h1 className="text-3xl font-bold text-white md:text-4xl">Products</h1>
        <p className="mt-2 text-white/72">Search and filter your next gadget.</p>
        <div className="mt-5">
          <Suspense fallback={null}>
            <ProductsToolbar categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
          </Suspense>
        </div>
      </GlassPanel>

      <GlassPanel>
        {products.length === 0 ? (
          <p className="text-white/70">No products match this filter.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 min-[430px]:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {products.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
      </GlassPanel>
    </PageShell>
  );
}
