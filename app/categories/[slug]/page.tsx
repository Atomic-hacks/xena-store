import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductTile } from "@/components/store/ProductTile";
import { PageShell } from "@/components/store/PageShell";
import { getCategoryBySlug, getProducts } from "@/lib/store";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  return {
    title: category ? category.name : "Category",
    description: category ? `Products in ${category.name}` : "Category products",
  };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProducts({ category: slug, sort: "latest" });

  return (
    <PageShell className="space-y-6 pb-12">
      <section className="rounded-3xl border border-white/12 bg-[linear-gradient(160deg,rgba(38,30,59,0.24)_0%,rgba(9,9,13,0.84)_72%)] p-5 md:p-7">
        <h1 className="font-[var(--font-azonix)] text-2xl uppercase tracking-[0.08em] text-white md:text-3xl">{category.name}</h1>
        <p className="mt-2 text-sm text-white/68">{products.length} products found.</p>
      </section>

      <section>
        {products.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-white/70">
            No products in this category yet.
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
