import Link from "next/link";
import { Metadata } from "next";
import { PageShell, GlassPanel } from "@/components/store/PageShell";
import { ProductTile } from "@/components/store/ProductTile";
import { glassStyles } from "@/components/ui/glass";
import {
  getCategoriesWithCounts,
  getCheapDealProducts,
  getFeaturedProducts,
  getHotSaleProducts,
} from "@/lib/store";
import { HeroBanner } from "@/components/store/HeroBanner";

export const metadata: Metadata = {
  title: "Home",
  description: "Featured gadgets and latest deals from Xena Store.",
};

export default async function HomePage() {
  const [featured, hotSales, cheapDeals, categories] = await Promise.all([
    getFeaturedProducts(8),
    getHotSaleProducts(6),
    getCheapDealProducts(6),
    getCategoriesWithCounts(),
  ]);
  const spotlight = hotSales[0] ?? featured[0];

  return (
    <PageShell className="space-y-8 md:space-y-10">
      <HeroBanner
        spotlight={
          spotlight
            ? {
                name: spotlight.name,
                slug: spotlight.slug,
                description: spotlight.description,
                image: spotlight.image,
              }
            : undefined
        }
      />

      <GlassPanel>
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Featured products</h2>
          <Link href="/products" className="text-sm text-white/70 hover:text-white">
            View all
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-white/70">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 min-[430px]:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
      </GlassPanel>

      <GlassPanel>
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Hot Sales</h2>
          <Link href="/products?sort=latest" className="text-sm text-white/70 hover:text-white">
            View all
          </Link>
        </div>
        {hotSales.length === 0 ? (
          <p className="text-white/70">No hot sales right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 min-[430px]:grid-cols-2 lg:grid-cols-3">
            {hotSales.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
      </GlassPanel>

      <GlassPanel>
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Cheap Deals</h2>
          <Link href="/products" className="text-sm text-white/70 hover:text-white">
            View all
          </Link>
        </div>
        {cheapDeals.length === 0 ? (
          <p className="text-white/70">No cheap deals available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 min-[430px]:grid-cols-2 lg:grid-cols-3">
            {cheapDeals.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
      </GlassPanel>

      <GlassPanel>
        <h2 className="text-2xl font-semibold text-white md:text-3xl">Categories</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className={`${glassStyles.cardSoft} p-4 text-white transition hover:border-white/25`}
            >
              <p className="font-medium">{category.name}</p>
              <p className="text-sm text-white/60">{category.count} items</p>
            </Link>
          ))}
        </div>
        {categories.length > 6 ? (
          <Link href="/categories" className="mt-4 inline-block text-sm text-white/70 hover:text-white">
            View all categories
          </Link>
        ) : null}
      </GlassPanel>
    </PageShell>
  );
}
