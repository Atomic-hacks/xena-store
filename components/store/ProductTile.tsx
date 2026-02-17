"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductCardDTO } from "@/lib/store";
import { Currency } from "@/components/store/Currency";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { FaCartPlus } from "react-icons/fa";

type ProductTileProps = {
  product: ProductCardDTO;
};

function getStatus(product: ProductCardDTO): { label: string; tone: string } {
  if (product.isOnSale) {
    return {
      label: "Sale",
      tone: "bg-red-100 text-red-700",
    };
  }

  if (product.stock > 0) {
    return {
      label: "In Stock",
      tone: "bg-emerald-100 text-emerald-700",
    };
  }

  if (product.condition === "NEW") {
    return {
      label: "New",
      tone: "bg-sky-100 text-sky-700",
    };
  }

  return {
    label: "Limited",
    tone: "bg-neutral-100 text-neutral-700",
  };
}

export function ProductTile({ product }: ProductTileProps) {
  const [navigating, setNavigating] = useState(false);
  const status = getStatus(product);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_14px_34px_rgba(15,23,42,0.09)] transition hover:shadow-[0_20px_45px_rgba(15,23,42,0.14)]">
      <Link
        href={`/products/${product.slug}`}
        onClick={() => setNavigating(true)}
        className="relative block"
      >
        <div className="relative aspect-square overflow-hidden bg-neutral-100 sm:aspect-[4/3]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <span className={`absolute left-2.5 top-2.5 inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${status.tone}`}>
          {status.label}
        </span>
        {navigating ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-[1px]">
            <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-300" />
          </div>
        ) : null}
      </Link>

      <div className="flex grow flex-col gap-2.5 p-3 sm:gap-3 sm:p-4">
        <div className="space-y-1 sm:space-y-1.5">
          <p className="hidden text-[11px] uppercase tracking-[0.14em] text-neutral-400 sm:block">{product.category}</p>
          <Link
            href={`/products/${product.slug}`}
            onClick={() => setNavigating(true)}
            className="line-clamp-2 text-[0.88rem] font-semibold leading-snug text-neutral-900 transition hover:text-neutral-700 sm:text-[0.98rem]"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-[0.95rem] font-bold text-neutral-900 sm:text-[1.08rem]">
              <Currency cents={product.finalPrice} />
            </p>
            {product.isOnSale ? (
              <p className="text-xs text-neutral-400 line-through">
                <Currency cents={product.price} />
              </p>
            ) : null}
          </div>

          <div className="hidden grid-cols-2 gap-2 sm:grid">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-neutral-100 px-2 text-xs font-medium text-neutral-800 transition hover:bg-neutral-200"
            >
              View
            </Link>
            <AddToCartButton
              productId={product.id}
              label="Add"
              pendingLabel="Adding..."
              icon={<FaCartPlus className="h-3.5 w-3.5" />}
              className="!min-h-10 !rounded-full !px-3 !py-2 !text-xs"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
