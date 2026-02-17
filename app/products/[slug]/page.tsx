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
      <section className="grid gap-6 rounded-3xl border border-white/12 bg-[linear-gradient(165deg,rgba(19,18,28,0.94)_0%,rgba(10,10,14,0.94)_75%)] p-4 md:p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <img
            src={productImages[0]}
            alt={product.name}
            className="h-[300px] w-full rounded-2xl border border-white/10 object-cover md:h-[420px]"
          />
          <div className="grid grid-cols-4 gap-2">
            {productImages.slice(0, 4).map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="h-20 w-full rounded-xl border border-white/10 object-cover"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-white/55">{product.category}</p>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">{product.name}</h1>
            <p className="text-sm leading-6 text-white/72">{product.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-white/20 bg-white/[0.05] px-2.5 py-1 text-white/80">
              {product.stock > 0 ? "In Stock" : "Out of stock"}
            </span>
            {product.condition ? (
              <span className="rounded-full border border-white/20 bg-white/[0.05] px-2.5 py-1 text-white/80">
                {product.condition.replace(/_/g, " ")}
              </span>
            ) : null}
            {product.warranty ? (
              <span className="rounded-full border border-white/20 bg-white/[0.05] px-2.5 py-1 text-white/80">
                Warranty: {product.warranty}
              </span>
            ) : null}
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-bold text-white md:text-4xl">
              <Currency cents={product.finalPrice} />
            </p>
            {hasDiscount ? (
              <p className="text-sm text-white/45 line-through">
                <Currency cents={product.price} />
              </p>
            ) : null}
          </div>

          <AddToCartButton productId={product.id} className="w-full md:w-auto md:min-w-[210px]" />

          {product.specs.length > 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Quick Specs</p>
              <dl className="mt-3 space-y-2 text-sm text-white/75">
                {product.specs.slice(0, 6).map((spec) => (
                  <div key={spec.key} className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5">
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
        <h2 className="font-[var(--font-azonix)] text-xl uppercase tracking-[0.08em] text-white sm:text-2xl">Related Products</h2>
        {related.length === 0 ? (
          <p className="text-white/60">No related products yet.</p>
        ) : (
          <div className="grid max-[380px]:grid-cols-1 grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {related.map((item) => (
              <ProductTile key={item.id} product={item} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
