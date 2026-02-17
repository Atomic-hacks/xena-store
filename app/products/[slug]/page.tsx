import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { Currency } from "@/components/store/Currency";
import { ProductTile } from "@/components/store/ProductTile";
import { PageShell } from "@/components/store/PageShell";
import { getProductBySlug, getProducts } from "@/lib/store";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const hasDiscount = product.finalPrice < product.price;
  const related = (await getProducts({ category: product.categorySlug, sort: "latest" }))
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  const productImages = product.images.length > 0 ? product.images : [product.image];

  return (
    <PageShell className="space-y-8 pb-14">
      <section className="grid gap-6 rounded-3xl bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.1)] md:p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <img
            src={productImages[0]}
            alt={product.name}
            className="h-[300px] w-full rounded-2xl bg-neutral-100 object-cover md:h-[420px]"
          />
          <div className="grid grid-cols-4 gap-2">
            {productImages.slice(0, 4).map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="h-20 w-full rounded-xl bg-neutral-100 object-cover"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">{product.category}</p>
            <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">{product.name}</h1>
            <p className="text-sm leading-6 text-neutral-600">{product.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-700">
              {product.stock > 0 ? "In Stock" : "Out of stock"}
            </span>
            {product.condition ? (
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-700">
                {product.condition.replace(/_/g, " ")}
              </span>
            ) : null}
            {product.warranty ? (
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-700">
                Warranty: {product.warranty}
              </span>
            ) : null}
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-bold text-neutral-900 md:text-4xl">
              <Currency cents={product.finalPrice} />
            </p>
            {hasDiscount ? (
              <p className="text-sm text-neutral-400 line-through">
                <Currency cents={product.price} />
              </p>
            ) : null}
          </div>

          <AddToCartButton productId={product.id} className="w-full md:w-auto md:min-w-[210px]" />

          {product.specs.length > 0 ? (
            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-sm font-semibold text-neutral-900">Quick Specs</p>
              <dl className="mt-3 space-y-2 text-sm text-neutral-600">
                {product.specs.slice(0, 6).map((spec) => (
                  <div key={spec.key} className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-1.5">
                    <dt>{spec.key}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-[var(--font-azonix)] text-xl uppercase tracking-[0.08em] text-neutral-900 sm:text-2xl">Related Products</h2>
        {related.length === 0 ? (
          <p className="text-neutral-500">No related products yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {related.map((item) => (
              <ProductTile key={item.id} product={item} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
