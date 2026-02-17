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
          <mark key={`${part}-${index}`} className="rounded bg-violet-400/30 px-0.5 text-white">
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
    setActiveIndex(0);
  }, [normalized]);

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
    <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="space-y-6">
        <p className="inline-flex rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs tracking-[0.18em] text-white/75">
          PREMIUM GADGET STORE
        </p>
        <div className="space-y-4">
          <h1 className="font-[var(--font-azonix)] text-3xl uppercase leading-[1.05] text-white sm:text-4xl lg:text-5xl">
            Elite Devices For Work, Play, And Pro Gaming
          </h1>
          <p className="max-w-xl text-sm text-white/70 sm:text-base">
            Shop trusted phones, laptops, and gaming gear with verified specs, warranty-backed offers, and fast delivery.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Shop Now
          </Link>
          <Link
            href="/products?query=deal"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:border-white/35"
          >
            View Deals
          </Link>
        </div>

        <div ref={rootRef} className="relative">
          <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/20 bg-[#111118] px-4 shadow-[0_14px_40px_rgba(0,0,0,0.38)]">
            <Search className="h-5 w-5 text-white/60" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                const value = event.target.value;
                setQuery(value);
                setOpen(Boolean(value.trim()));
              }}
              onFocus={() => {
                if (query.trim()) {
                  setOpen(true);
                }
              }}
              onKeyDown={onKeyDown}
              placeholder="Search products, brands, categories..."
              className="h-12 w-full bg-transparent text-[0.95rem] text-white placeholder:text-white/45 focus:outline-none"
              aria-label="Search products"
              aria-expanded={open}
              aria-controls="hero-search-results"
              role="combobox"
            />
            <button
              type="button"
              onClick={submitSearch}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl bg-violet-500/85 px-3 text-sm font-medium text-white transition hover:bg-violet-500"
            >
              Search
            </button>
          </div>

          {open ? (
            <div
              id="hero-search-results"
              className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-white/15 bg-[rgba(16,16,22,0.96)] shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
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
                              className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition ${
                                active ? "bg-white/[0.09]" : "hover:bg-white/[0.06]"
                              }`}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-white">
                                  <HighlightMatch text={product.name} query={query} />
                                </p>
                                <div className="mt-0.5 flex items-center gap-2 text-xs text-white/60">
                                  <span className="truncate">{product.category}</span>
                                  <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] text-white/80">
                                    {getPill(product)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs font-semibold text-white/90">
                                <Currency cents={product.finalPrice} />
                              </p>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
                      <p className="font-medium text-white">No products found.</p>
                      <p className="mt-1 text-xs text-white/60">Try another keyword, brand, or category.</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={submitSearch}
                    className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/85 transition hover:border-white/20"
                  >
                    <span>View all results for &quot;{query.trim() || "all"}&quot;</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <aside className="hidden border-l border-white/10 bg-black/30 p-3 md:block">
                  {previewProduct ? (
                    <div className="space-y-3">
                      <img
                        src={previewProduct.image}
                        alt={previewProduct.name}
                        className="h-28 w-full rounded-lg object-cover"
                      />
                      <p className="line-clamp-2 text-sm text-white">{previewProduct.name}</p>
                      <p className="text-xs text-white/65">{previewProduct.category}</p>
                      <p className="text-sm font-semibold text-white">
                        <Currency cents={previewProduct.finalPrice} />
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-white/50">Select a result to preview</p>
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
                className="rounded-full border border-white/16 bg-white/[0.03] px-3 py-1.5 text-xs text-white/75 transition hover:border-white/30 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span className="text-white/45">Trending:</span>
            {trendingSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuery(item);
                  setOpen(true);
                  inputRef.current?.focus();
                }}
                className="hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-10 top-10 hidden h-52 w-52 rounded-full bg-violet-500/20 blur-3xl lg:block" />
        <div className="relative rounded-3xl border border-white/15 bg-[linear-gradient(165deg,rgba(36,30,58,0.92)_0%,rgba(10,10,14,0.9)_64%)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          {products[0] ? (
            <>
              <p className="text-xs uppercase tracking-[0.16em] text-violet-200/80">Featured Pick</p>
              <img
                src={products[0].image}
                alt={products[0].name}
                className="mt-4 h-60 w-full rounded-2xl object-cover"
              />
              <div className="mt-4 space-y-1">
                <p className="line-clamp-2 text-lg font-semibold text-white">{products[0].name}</p>
                <p className="text-sm text-white/65">{products[0].category}</p>
                <p className="text-xl font-bold text-white">
                  <Currency cents={products[0].finalPrice} />
                </p>
              </div>
              <Link
                href={`/products/${products[0].slug}`}
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-white/25 bg-white/[0.06] px-4 text-sm text-white transition hover:border-white/45"
              >
                View Product
              </Link>
            </>
          ) : (
            <p className="text-white/70">No featured products available.</p>
          )}
        </div>
      </div>
    </section>
  );
}
