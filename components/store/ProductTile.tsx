"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductCardDTO } from "@/lib/store";
import { Currency } from "@/components/store/Currency";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { glassStyles } from "@/components/ui/glass";
import { ConditionPill, DealPill, DiscountPill, StatusPill } from "@/components/store/Pills";

export function ProductTile({
  product,
  showStatus = false,
}: {
  product: ProductCardDTO;
  showStatus?: boolean;
}) {
  const [opening, setOpening] = useState(false);
  const hasDiscount = product.finalPrice < product.price;
  const discountPercent = hasDiscount
    ? product.discountType === "PERCENT"
      ? product.discountValue
      : Math.round(((product.price - product.finalPrice) / Math.max(1, product.price)) * 100)
    : 0;

  const quickSpecs = product.tags.filter(Boolean).slice(0, 3);
  const mobilePill = hasDiscount
    ? "Sale"
    : product.stock > 0
    ? "In stock"
    : product.condition === "NEW"
    ? "New"
    : null;

  return (
    <article className={`group relative flex h-full flex-col overflow-hidden ${glassStyles.card} ${glassStyles.interactive}`}>
      <Link
        href={`/products/${product.slug}`}
        className="block"
        onClick={() => setOpening(true)}
      >
        <div className="relative aspect-[16/11] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/15 to-transparent" />
          {opening ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[1.5px]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          ) : null}
          <div className="absolute left-3 top-3 hidden flex-wrap gap-1.5 md:left-4 md:top-4 md:flex">
            <ConditionPill condition={product.condition} />
            <DealPill dealType={product.dealType} />
            {hasDiscount ? <DiscountPill percent={discountPercent} /> : null}
            {showStatus ? <StatusPill status={product.status} /> : null}
          </div>
        </div>
      </Link>

      <div className="flex grow flex-col space-y-2 p-3.5 md:space-y-4 md:p-5">
        <div className="space-y-1.5 md:space-y-2">
          <p className="hidden text-xs uppercase tracking-[0.14em] text-white/58 md:block">{product.category}</p>
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 text-[0.97rem] font-semibold leading-snug text-white hover:text-white/85 md:text-[1.05rem]"
          >
            {product.name}
          </Link>
          <p className="hidden line-clamp-2 text-[0.96rem] leading-relaxed text-white/72 md:block">{product.description}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <p className="whitespace-nowrap text-base font-semibold text-white md:text-xl">
              <Currency cents={product.finalPrice} />
            </p>
            {hasDiscount ? (
              <p className="hidden text-sm text-white/52 line-through md:block">
                <Currency cents={product.price} />
              </p>
            ) : null}
          </div>
          {mobilePill ? (
            <span className="inline-flex rounded-full border border-white/20 bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/85 md:hidden">
              {mobilePill}
            </span>
          ) : null}
        </div>

        <div className="hidden min-h-8 md:block">
          {quickSpecs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {quickSpecs.map((spec) => (
                <span
                  key={`${product.id}-${spec}`}
                  className="rounded-full border border-white/14 bg-white/[0.035] px-2.5 py-1 text-xs text-white/78"
                >
                  {spec}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-white/55">No quick specs</span>
          )}
        </div>

        <div className="hidden pt-1 md:block">
          <AddToCartButton productId={product.id} className="w-full" />
        </div>
      </div>
    </article>
  );
}
