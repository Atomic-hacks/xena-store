"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { Currency } from "@/components/store/Currency";

type SearchProduct = {
  id: string;
  slug: string;
  name: string;
  image: string;
  finalPrice: number;
  category: string;
  stock: number;
  isOnSale: boolean;
};

function getPill(product: SearchProduct): string {
  if (product.isOnSale) {
    return "Sale";
  }
  if (product.stock > 0) {
    return "In Stock";
  }
  return "Out of Stock";
}

export function GlobalProductSearch({ tab = false }: { tab?: boolean }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const hasMatches = results.length > 0;

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!open || isMobile) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, isMobile]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=8`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const body = (await response.json()) as { products?: SearchProduct[] };
        if (!response.ok || !Array.isArray(body.products)) {
          setResults([]);
          return;
        }
        setResults(body.products);
        setActiveIndex(0);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [open, query]);

  const widthClass = useMemo(() => {
    if (!open) {
      return "w-10";
    }
    return "w-72 md:w-[24rem] lg:w-[30rem]";
  }, [open]);

  function openSearch() {
    setOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 120);
  }

  function closeSearch() {
    setOpen(false);
  }

  function submitSearch() {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    closeSearch();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      closeSearch();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!hasMatches) {
        return;
      }
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!hasMatches) {
        return;
      }
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (hasMatches) {
        const selected = results[activeIndex];
        if (selected) {
          router.push(`/products/${selected.slug}`);
          closeSearch();
          return;
        }
      }
      submitSearch();
    }
  }

  function onChangeValue(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setLoading(false);
      setResults([]);
      setActiveIndex(0);
    }
  }

  const resultsPanel = (
    <div className="max-h-[22rem] overflow-y-auto p-2">
      {loading ? <p className="px-2 py-3 text-sm text-neutral-500">Searching...</p> : null}

      {!loading && hasMatches ? (
        <ul className="space-y-1">
          {results.map((product, index) => {
            const active = index === activeIndex;
            return (
              <li key={product.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    router.push(`/products/${product.slug}`);
                    closeSearch();
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition ${
                    active ? "bg-white" : "hover:bg-white/70"
                  }`}
                >
                  <img src={product.image} alt={product.name} className="h-11 w-11 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-neutral-900">{product.name}</p>
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
      ) : null}

      {!loading && query.trim() && !hasMatches ? (
        <p className="rounded-2xl bg-white px-3 py-3 text-sm text-neutral-500">No products found.</p>
      ) : null}

      <button
        type="button"
        onClick={submitSearch}
        className="mt-2 flex w-full items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
      >
        <span>View all results for &quot;{query.trim() || "all"}&quot;</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {tab ? (
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex h-14 w-full flex-col items-center justify-center gap-1 text-[11px] text-neutral-600"
            aria-label="Search products"
          >
            <Search className="h-[18px] w-[18px]" />
            <span>Search</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700"
            aria-label="Search products"
          >
            <Search className="h-4 w-4" />
          </button>
        )}

        {open ? (
          <div className="fixed inset-0 z-[90] bg-black/25 p-3" onClick={closeSearch}>
            <div
              className="mx-auto mt-1 max-w-xl rounded-3xl bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex h-12 items-center gap-2 rounded-full bg-neutral-100 px-3">
                <Search className="h-4 w-4 text-neutral-500" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => onChangeValue(event.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search products..."
                  className="h-full w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
                  aria-label="Global product search"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/90 backdrop-blur-xl">
                {resultsPanel}
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  if (tab) {
    return null;
  }

  return (
    <div ref={rootRef} className="relative">
      <div
        className={`flex h-10 items-center overflow-hidden rounded-full bg-neutral-100 shadow-[0_6px_16px_rgba(15,23,42,0.08)] transition-all duration-300 ${widthClass}`}
      >
        <button
          type="button"
          onClick={() => {
            if (!open) {
              openSearch();
              return;
            }
            submitSearch();
          }}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-neutral-700"
          aria-label="Search products"
        >
          <Search className="h-4 w-4" />
        </button>

        <input
          ref={inputRef}
          value={query}
          onChange={(event) => onChangeValue(event.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search products..."
          className={`h-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none transition-all duration-200 ${
            open ? "w-full opacity-100 pr-1" : "w-0 opacity-0"
          }`}
          aria-label="Global product search"
          aria-expanded={open}
          aria-controls="global-search-results"
          role="combobox"
        />

        {open ? (
          <button
            type="button"
            onClick={closeSearch}
            className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {open ? (
        <div
          id="global-search-results"
          className="absolute right-0 z-50 mt-2 w-[min(32rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/50 bg-white/80 shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl"
        >
          {resultsPanel}
        </div>
      ) : null}
    </div>
  );
}
