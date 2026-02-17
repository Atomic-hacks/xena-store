"use client";

import Link from "next/link";
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
      tone: "border-violet-300/45 bg-violet-400/20 text-violet-100",
    };
  }

  if (product.stock > 0) {
    return {
      label: "In Stock",
      tone: "border-emerald-300/30 bg-emerald-500/15 text-emerald-100",
    };
  }

  if (product.condition === "NEW") {
    return {
      label: "New",
      tone: "border-sky-300/30 bg-sky-500/15 text-sky-100",
    };
  }

  return {
    label: "Limited",
    tone: "border-white/25 bg-white/10 text-white/90",
  };
}

export function ProductTile({ product }: ProductTileProps) {
  const status = getStatus(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-[rgba(18,18,24,0.8)] shadow-[0_14px_34px_rgba(0,0,0,0.32)] transition hover:border-white/22">
      <Link href={`/products/${product.slug}`} className="relative block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        </div>
        <span
          className={`absolute left-3 top-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wide ${status.tone}`}
        >
          {status.label}
        </span>
      </Link>

      <div className="flex grow flex-col gap-3 p-3.5 sm:p-4">
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-white/45">
            {product.category}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 text-[0.92rem] font-semibold leading-snug text-white transition hover:text-white/90 sm:text-[0.98rem]"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-[0.96rem] font-bold text-white sm:text-[1.06rem]">
              <Currency cents={product.finalPrice} />
            </p>
            {product.isOnSale ? (
              <p className="text-xs text-white/45 line-through">
                <Currency cents={product.price} />
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-white/18 bg-white/[0.03] px-2 text-[11px] font-medium text-white/90 transition hover:border-white/30 sm:min-h-10 sm:text-xs"
            >
              View
            </Link>
            <AddToCartButton
              productId={product.id}
              label="Add"
              pendingLabel="Adding..."
              icon={<FaCartPlus className="h-3.5 w-3.5" />}
              className="!min-h-9 !rounded-lg !px-2.5 !py-1.5 !text-[11px] sm:!min-h-10 sm:!px-3 sm:!py-2 sm:!text-xs"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
