import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { Currency } from "@/components/store/Currency";
import { GlassPanel, PageShell } from "@/components/store/PageShell";
import { ConditionPill, DealPill, DiscountPill } from "@/components/store/Pills";
import { glassStyles } from "@/components/ui/glass";
import { getProductBySlug } from "@/lib/store";

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
  const discountPercent = hasDiscount
    ? product.discountType === "PERCENT"
      ? product.discountValue
      : Math.round(((product.price - product.finalPrice) / Math.max(1, product.price)) * 100)
    : 0;

  return (
    <PageShell>
      <GlassPanel className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <img src={product.image} alt={product.name} className="h-[360px] w-full rounded-3xl object-cover" />
          <div className="grid grid-cols-3 gap-3">
            {product.images.slice(0, 3).map((image, idx) => (
              <img key={`${image}-${idx}`} src={image} alt={`${product.name} ${idx + 1}`} className="h-24 w-full rounded-xl object-cover" />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-white/65">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{product.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <ConditionPill condition={product.condition} />
            <DealPill dealType={product.dealType} />
            {hasDiscount ? <DiscountPill percent={discountPercent} /> : null}
          </div>
          <p className="mt-3 text-white/75">{product.description}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-3xl font-bold text-white">
              <Currency cents={product.finalPrice} />
            </p>
            {hasDiscount ? (
              <p className="text-sm text-white/50 line-through">
                <Currency cents={product.price} />
              </p>
            ) : null}
          </div>

          <div className="mt-6">
            <AddToCartButton productId={product.id} />
          </div>

          <div className={`mt-8 space-y-3 p-4 ${glassStyles.cardSoft}`}>
            <h2 className="text-lg font-semibold text-white">Condition</h2>
            <p className="text-sm text-white/80">{product.condition.replace(/_/g, " ")}</p>
            {product.conditionNotes ? <p className="text-sm text-white/70">{product.conditionNotes}</p> : null}
            {product.warranty ? <p className="text-sm text-white/70">Warranty: {product.warranty}</p> : null}
            {product.batteryHealth ? <p className="text-sm text-white/70">Battery Health: {product.batteryHealth}</p> : null}
          </div>

          <div className={`mt-4 space-y-2 p-4 ${glassStyles.cardSoft}`}>
            <h2 className="text-lg font-semibold text-white">Defects / Notes</h2>
            {product.defects.length === 0 ? (
              <p className="text-sm text-white/60">No known defects listed.</p>
            ) : (
              <ul className="space-y-2 text-sm text-white/80">
                {product.defects.map((defect) => (
                  <li key={`${defect.title}-${defect.description}`} className={`rounded-lg p-2 ${glassStyles.cardSoft}`}>
                    <p className="font-medium text-white">{defect.title}</p>
                    <p className="text-white/70">{defect.description}</p>
                    {defect.severity ? <p className="text-xs text-white/70">Severity: {defect.severity}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`mt-4 space-y-2 p-4 ${glassStyles.cardSoft}`}>
            <h2 className="text-lg font-semibold text-white">Included Accessories</h2>
            {product.accessoriesIncluded.length === 0 ? (
              <p className="text-sm text-white/60">No accessories listed.</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-sm text-white/80">
                {product.accessoriesIncluded.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {product.details.length > 0 ? (
            <div className={`mt-4 space-y-2 p-4 ${glassStyles.cardSoft}`}>
              <h2 className="text-lg font-semibold text-white">Details</h2>
              <dl className="space-y-2 text-sm">
                {product.details.map((row) => (
                  <div key={row.key} className="flex justify-between border-b border-white/5 pb-1 text-white/80">
                    <dt>{row.key}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <div className={`mt-8 space-y-2 p-4 ${glassStyles.cardSoft}`}>
            <h2 className="text-lg font-semibold text-white">Specs</h2>
            {product.specs.length === 0 ? (
              <p className="text-sm text-white/60">No specs available.</p>
            ) : (
              <dl className="space-y-2 text-sm">
                {product.specs.map((spec) => (
                  <div key={spec.key} className="flex justify-between border-b border-white/5 pb-1 text-white/80">
                    <dt>{spec.key}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </GlassPanel>
    </PageShell>
  );
}
