"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { Currency } from "@/components/store/Currency";
import { STOREFRONT_CATEGORY_LABELS, toKebab } from "@/lib/storefront";

type SearchProduct = {
  id: string;
  slug: string;
  name: string;
  image: string;
  finalPrice: number;
  price: number;
  category: string;
  status: string;
  stock: number;
  isOnSale: boolean;
  condition: string;
  tags: string[];
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const pattern = new RegExp(`(${escapeRegExp(query.trim())})`, "ig");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === query.trim().toLowerCase();
        return isMatch ? (
          <mark key={`${part}-${index}`} className="rounded bg-red-100 px-0.5 text-neutral-900">
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        );
      })}
    </>
  );
}

export function HeroTypeahead({ products }: { products: SearchProduct[] }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const normalized = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalized) {
      return [];
    }

    return products
      .filter((product) => {
        const haystack = [
          product.name,
          product.category,
          product.condition,
          product.slug,
          ...product.tags,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalized);
      })
      .slice(0, 8);
  }, [normalized, products]);

  const previewIndex = hoverIndex ?? activeIndex;
  const previewProduct = results[previewIndex] ?? null;

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setHoverIndex(null);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const hasMatches = results.length > 0;

  function submitSearch() {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setHoverIndex(null);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      }
      if (!hasMatches) {
        return;
      }
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      }
      if (!hasMatches) {
        return;
      }
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (open && hasMatches) {
        const selected = results[activeIndex];
        if (selected) {
          router.push(`/products/${selected.slug}`);
          setOpen(false);
          return;
        }
      }
      submitSearch();
    }
  }

  function getPill(product: SearchProduct): string {
    if (product.isOnSale) {
      return "Sale";
    }
    if (product.stock > 0) {
      return "In Stock";
    }
    return "Out of Stock";
  }

  const trendingSearches = ["iPhone", "PS5 accessories", "Gaming monitors", "RTX laptops"];

  return (
    <section className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
      <div className="space-y-6">
        <p className="inline-flex rounded-full bg-neutral-100 px-4 py-1 text-xs tracking-[0.18em] text-neutral-600">
          PREMIUM GADGET STORE
        </p>
        <div className="space-y-4">
          <h1 className="font-[var(--font-azonix)] text-3xl uppercase leading-[1.04] text-neutral-900 sm:text-4xl lg:text-5xl">
            Elite Devices For Work, Play, And Pro Gaming
          </h1>
          <p className="max-w-2xl text-sm text-neutral-600 sm:text-base">
            Shop trusted phones, laptops, and gaming gear with verified specs, warranty-backed offers, and fast delivery.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Shop Now
          </Link>
          <Link
            href="/products?query=deal"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-100 px-6 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
          >
            View Deals
          </Link>
        </div>

        <div ref={rootRef} className="relative">
          <div className="flex min-h-14 items-center gap-3 rounded-full bg-white px-5 shadow-[0_16px_40px_rgba(15,23,42,0.1)]">
            <Search className="h-5 w-5 text-neutral-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                const value = event.target.value;
                setQuery(value);
                setOpen(Boolean(value.trim()));
                setActiveIndex(0);
                setHoverIndex(null);
              }}
              onFocus={() => {
                if (query.trim()) {
                  setOpen(true);
                }
              }}
              onKeyDown={onKeyDown}
              placeholder="Search products, brands, categories..."
              className="h-12 w-full bg-transparent text-[0.95rem] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              aria-label="Search products"
              aria-expanded={open}
              aria-controls="hero-search-results"
              role="combobox"
            />
            <button
              type="button"
              onClick={submitSearch}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Search
            </button>
          </div>

          {open ? (
            <div
              id="hero-search-results"
              className="absolute z-40 mt-2 w-full overflow-hidden rounded-3xl border border-white/50 bg-white/75 shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl"
            >
              <div className="grid md:grid-cols-[1fr_220px]">
                <div className="max-h-[22rem] overflow-y-auto p-2">
                  {hasMatches ? (
                    <ul className="space-y-1">
                      {results.map((product, index) => {
                        const active = index === activeIndex;
                        return (
                          <li key={product.id}>
                            <button
                              type="button"
                              onMouseEnter={() => {
                                setHoverIndex(index);
                                setActiveIndex(index);
                              }}
                              onClick={() => {
                                router.push(`/products/${product.slug}`);
                                setOpen(false);
                              }}
                              className={`flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition ${
                                active ? "bg-white" : "hover:bg-white/70"
                              }`}
                            >
                              <img src={product.image} alt={product.name} className="h-12 w-12 rounded-xl object-cover" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-neutral-900">
                                  <HighlightMatch text={product.name} query={query} />
                                </p>
                                <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                                  <span className="truncate">{product.category}</span>
                                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700">
                                    {getPill(product)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs font-semibold text-neutral-900">
                                <Currency cents={product.finalPrice} />
                              </p>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="rounded-2xl bg-white p-4 text-sm text-neutral-500">
                      <p className="font-medium text-neutral-900">No products found.</p>
                      <p className="mt-1 text-xs text-neutral-500">Try another keyword, brand, or category.</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={submitSearch}
                    className="mt-2 flex w-full items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
                  >
                    <span>View all results for &quot;{query.trim() || "all"}&quot;</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <aside className="hidden bg-white/60 p-3 md:block">
                  {previewProduct ? (
                    <div className="space-y-3">
                      <img
                        src={previewProduct.image}
                        alt={previewProduct.name}
                        className="h-28 w-full rounded-xl object-cover"
                      />
                      <p className="line-clamp-2 text-sm text-neutral-900">{previewProduct.name}</p>
                      <p className="text-xs text-neutral-500">{previewProduct.category}</p>
                      <p className="text-sm font-semibold text-neutral-900">
                        <Currency cents={previewProduct.finalPrice} />
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500">Select a result to preview</p>
                  )}
                </aside>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {STOREFRONT_CATEGORY_LABELS.map((label) => (
              <Link
                key={label}
                href={`/products?category=${toKebab(label)}`}
                className="rounded-full bg-white px-3 py-1.5 text-xs text-neutral-700 shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition hover:bg-neutral-100 hover:text-neutral-900"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="text-neutral-500">Trending:</span>
            {trendingSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuery(item);
                  setOpen(true);
                  inputRef.current?.focus();
                }}
                className="text-neutral-600 hover:text-neutral-900"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative rounded-[2rem] bg-[#ececef] p-6 shadow-[0_20px_52px_rgba(15,23,42,0.12)] md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Featured Pick</p>
        {products[0] ? (
          <>
            <img
              src={products[0].image}
              alt={products[0].name}
              className="mx-auto mt-5 h-64 w-full max-w-[460px] object-contain md:h-72"
            />
            <p className="mt-2 line-clamp-1 text-lg font-semibold text-neutral-900">{products[0].name}</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-sm text-neutral-500">{products[0].category}</p>
              <p className="text-lg font-bold text-neutral-900">
                <Currency cents={products[0].finalPrice} />
              </p>
            </div>
            <Link
              href={`/products/${products[0].slug}`}
              className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full bg-black px-5 text-sm text-white transition hover:bg-neutral-800"
            >
              View Product
            </Link>
          </>
        ) : (
          <p className="mt-4 text-neutral-600">No featured products available.</p>
        )}
      </div>
    </section>
  );
}
