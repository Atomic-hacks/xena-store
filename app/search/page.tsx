import { Metadata } from "next";
import { ProductTile } from "@/components/store/ProductTile";
import { PageShell } from "@/components/store/PageShell";
import { getProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Search",
  description: "Search gadgets and accessories.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const products = await getProducts({ query, sort: "latest" });

  return (
    <PageShell className="space-y-6 pb-12">
      <section className="rounded-3xl border border-white/12 bg-[linear-gradient(160deg,rgba(34,28,51,0.25)_0%,rgba(9,9,12,0.86)_70%)] p-5 md:p-7">
        <h1 className="font-[var(--font-azonix)] text-2xl uppercase tracking-[0.08em] text-white md:text-3xl">Search Results</h1>
        <p className="mt-2 text-sm text-white/70">
          {query ? `Results for "${query}"` : "Type a product or category to search."}
        </p>
      </section>

      <section>
        {products.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white/70">
            No products found. Try another keyword.
          </p>
        ) : (
          <div className="grid max-[380px]:grid-cols-1 grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {products.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
