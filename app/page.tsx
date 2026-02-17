import Link from "next/link";
import { Metadata } from "next";
import { HeroTypeahead } from "@/components/store/HeroTypeahead";
import { PageShell } from "@/components/store/PageShell";
import { ProductTile } from "@/components/store/ProductTile";
import {
  getCategoriesWithCounts,
  getCheapDealProducts,
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
  const [hotSales, cheapDeals, categories, allProducts] = await Promise.all([
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
    <PageShell className="space-y-12 pb-14">
      <HeroTypeahead products={allProducts} />

      <section className="rounded-[2rem] bg-[#ff3b3b] px-6 py-8 text-white shadow-[0_20px_50px_rgba(248,113,113,0.35)] md:px-10 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm font-semibold tracking-[0.15em]">20% OFF</p>
            <h2 className="font-[var(--font-azonix)] text-3xl uppercase leading-[1.05] sm:text-4xl md:text-5xl">
              Fine Sound
            </h2>
            <p className="max-w-xl text-sm text-white/90 sm:text-base">
              Seasonal discount across premium audio and gaming accessories. Limited time picks, verified quality.
            </p>
            <Link
              href="/products?query=deal"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black"
            >
              Shop Sale
            </Link>
          </div>
          <div className="flex justify-center lg:justify-end ">
            <img src="/Headset3.jpg" alt="Summer sale" className="h-56 w-full max-w-[420px] object-contain md:h-72 rounded-4xl" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { title: "Enjoy Earphone", image: "/Headset4.jpg", color: "bg-[#4b4b4f]" },
          { title: "New Wears Watch", image: "/iphone2.jpg", color: "bg-[#fb923c]" },
          { title: "Trend Laptop", image: "/macbookm3.jpg", color: "bg-[#ff3b3b]" },
        ].map((promo) => (
          <article
            key={promo.title}
            className={`${promo.color} relative min-h-[220px] overflow-hidden rounded-[1.6rem] p-6 text-white`}
          >
            <p className="text-sm">Trends</p>
            <p className="mt-1 max-w-[12ch] text-3xl font-semibold leading-[1.02]">{promo.title}</p>
            <Link href="/products" className="mt-6 inline-flex rounded-full bg-white px-5 py-2 text-xs text-black">
              Browse
            </Link>
            <img src={promo.image} alt={promo.title} className="absolute bottom-0 right-0 h-40 w-40 object-cover rounded-l-[1.6rem]" />
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-[var(--font-azonix)] text-3xl uppercase text-neutral-900 sm:text-4xl">Best Seller Products</h2>
            <p className="mt-2 text-sm text-neutral-500">We have products that you will love</p>
          </div>
          <Link href="/products" className="rounded-full bg-black px-5 py-2 text-sm text-white">
            View all
          </Link>
        </div>
        {bestSellers.length === 0 ? (
          <p className="text-neutral-500">No best sellers yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {bestSellers.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-[var(--font-azonix)] text-2xl uppercase text-neutral-900 sm:text-3xl">New Arrivals</h2>
        {newArrivals.length === 0 ? (
          <p className="text-neutral-500">No arrivals available.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {newArrivals.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="font-[var(--font-azonix)] text-2xl uppercase text-neutral-900 sm:text-3xl">Deals & Promotions</h2>
          <Link href="/products?query=deal" className="text-sm text-neutral-600 hover:text-neutral-900">
            Explore all deals
          </Link>
        </div>

        {deals.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {deals.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500">No deals available right now.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-[var(--font-azonix)] text-2xl uppercase text-neutral-900 sm:text-3xl">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {categoryTiles.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className="rounded-3xl bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.08)] transition hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)]"
            >
              <p className="text-sm font-semibold text-neutral-900">{category.label}</p>
              <p className="mt-1 text-xs text-neutral-500">{category.count} products</p>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
