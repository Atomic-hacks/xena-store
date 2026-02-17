import Link from "next/link";
import { Metadata } from "next";
import { HeroTypeahead } from "@/components/store/HeroTypeahead";
import { PageShell } from "@/components/store/PageShell";
import { ProductTile } from "@/components/store/ProductTile";
import {
  getCategoriesWithCounts,
  getCheapDealProducts,
  getFeaturedProducts,
  getHotSaleProducts,
  getProducts,
} from "@/lib/store";
import { STOREFRONT_CATEGORY_LABELS, toKebab } from "@/lib/storefront";

export const metadata: Metadata = {
  title: "Home",
  description: "Premium gadgets and gaming gear from Xena Store.",
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

function resolveStorefrontCategories(rows: CategoryRow[]) {
  const normalizedMap = new Map(rows.map((row) => [row.name.toLowerCase(), row]));

  return STOREFRONT_CATEGORY_LABELS.map((label) => {
    const direct = normalizedMap.get(label.toLowerCase());
    if (direct) {
      return {
        label,
        href: `/categories/${direct.slug}`,
        count: direct.count,
      };
    }

    return {
      label,
      href: `/products?category=${toKebab(label)}`,
      count: 0,
    };
  });
}

export default async function HomePage() {
  const [featured, hotSales, cheapDeals, categories, allProducts] = await Promise.all([
    getFeaturedProducts(10),
    getHotSaleProducts(8),
    getCheapDealProducts(8),
    getCategoriesWithCounts(),
    getProducts({ sort: "latest" }),
  ]);

  const categoryTiles = resolveStorefrontCategories(categories);
  const bestSellers = [...allProducts]
    .sort((a, b) => b.stock - a.stock || b.finalPrice - a.finalPrice)
    .slice(0, 6);
  const newArrivals = allProducts.slice(0, 6);
  const deals = [...hotSales, ...cheapDeals]
    .filter((item, index, array) => array.findIndex((row) => row.id === item.id) === index)
    .slice(0, 6);

  return (
    <PageShell className="space-y-11 pb-14">
      <HeroTypeahead products={allProducts} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-[var(--font-azonix)] text-xl uppercase tracking-[0.08em] text-white sm:text-2xl">Featured</h2>
          <Link href="/products" className="text-sm text-white/70 hover:text-white">
            View all
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-white/60">No featured products yet.</p>
        ) : (
          <>
            <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:hidden">
              {featured.map((product) => (
                <div key={product.id} className="w-[78vw] max-w-[320px] shrink-0 snap-start">
                  <ProductTile product={product} />
                </div>
              ))}
            </div>

            <div className="hidden grid-cols-2 gap-6 lg:grid lg:grid-cols-3">
              {featured.slice(0, 6).map((product) => (
                <ProductTile key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-[var(--font-azonix)] text-xl uppercase tracking-[0.08em] text-white sm:text-2xl">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {categoryTiles.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className="rounded-2xl border border-white/12 bg-[linear-gradient(145deg,rgba(48,40,74,0.26)_0%,rgba(10,10,14,0.72)_75%)] p-4 transition hover:border-white/25"
            >
              <p className="text-sm font-semibold text-white">{category.label}</p>
              <p className="mt-1 text-xs text-white/60">{category.count} products</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-[var(--font-azonix)] text-xl uppercase tracking-[0.08em] text-white sm:text-2xl">Best Sellers</h2>
        {bestSellers.length === 0 ? (
          <p className="text-white/60">No best sellers yet.</p>
        ) : (
          <div className="grid max-[380px]:grid-cols-1 grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {bestSellers.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-[var(--font-azonix)] text-xl uppercase tracking-[0.08em] text-white sm:text-2xl">New Arrivals</h2>
        {newArrivals.length === 0 ? (
          <p className="text-white/60">No arrivals available.</p>
        ) : (
          <div className="grid max-[380px]:grid-cols-1 grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {newArrivals.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="rounded-3xl border border-violet-300/20 bg-[linear-gradient(145deg,rgba(42,32,64,0.85)_0%,rgba(13,13,18,0.92)_70%)] p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-violet-200/85">Deals</p>
          <h2 className="mt-2 font-[var(--font-azonix)] text-2xl uppercase tracking-[0.06em] text-white">
            Premium Deals This Week
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Handpicked markdowns on flagship phones, gaming accessories, and performance devices.
          </p>
          <Link
            href="/products?query=deal"
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-white/25 bg-white/[0.06] px-4 text-sm text-white transition hover:border-white/45"
          >
            Explore all deals
          </Link>
        </div>

        {deals.length > 0 ? (
          <div className="grid max-[380px]:grid-cols-1 grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {deals.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-white/60">No deals available right now.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-[var(--font-azonix)] text-xl uppercase tracking-[0.08em] text-white sm:text-2xl">Why Shop With Us?</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Fast Delivery", "Reliable dispatch and tracked shipping nationwide."],
            ["Warranty Support", "Coverage on selected products and verified condition notes."],
            ["Secure Payment", "Protected checkout process with order confirmation flow."],
            ["Real Support", "Quick assistance for product choice and after-sales help."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-2 text-xs leading-5 text-white/65">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
