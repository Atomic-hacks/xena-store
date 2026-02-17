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
      <section className="rounded-3xl bg-white p-5 shadow-[0_16px_38px_rgba(15,23,42,0.08)] md:p-7">
        <h1 className="font-[var(--font-azonix)] text-2xl uppercase tracking-[0.08em] text-neutral-900 md:text-3xl">{category.name}</h1>
        <p className="mt-2 text-sm text-neutral-600">{products.length} products found.</p>
      </section>

      <section>
        {products.length === 0 ? (
          <p className="rounded-2xl bg-white p-4 text-neutral-600">
            No products in this category yet.
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
