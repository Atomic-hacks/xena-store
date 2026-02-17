import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlassPanel, PageShell } from "@/components/store/PageShell";
import { ProductTile } from "@/components/store/ProductTile";
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
    <PageShell className="space-y-7">
      <GlassPanel>
        <h1 className="text-3xl font-bold text-white md:text-4xl">{category.name}</h1>
        <p className="mt-2 text-white/72">{products.length} products found.</p>

        {products.length === 0 ? (
          <p className="mt-4 text-white/70">No products in this category yet.</p>
        ) : (
          <div className="mt-6 grid max-[359px]:grid-cols-1 grid-cols-2 gap-6 lg:grid-cols-3 lg:gap-7">
            {products.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        )}
      </GlassPanel>
    </PageShell>
  );
}
