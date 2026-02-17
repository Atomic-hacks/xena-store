"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { logger } from "@/lib/logger";

type CategoryOption = {
  slug: string;
  name: string;
};

type ProductCondition = "NEW" | "UK_USED" | "NG_USED";

const conditionOptions: Array<{ value: "" | ProductCondition; label: string }> = [
  { value: "", label: "All conditions" },
  { value: "NEW", label: "New" },
  { value: "UK_USED", label: "UK Used" },
  { value: "NG_USED", label: "NG Used" },
];

export function ProductsToolbar({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryFromUrl = searchParams.get("query") ?? "";
  const [search, setSearch] = useState(queryFromUrl);

  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "latest";
  const condition = (searchParams.get("condition") as ProductCondition | null) ?? "";

  const currentQueryString = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(currentQueryString);
      const trimmed = search.trim();
      const existing = params.get("query") ?? "";

      if (trimmed) {
        params.set("query", trimmed);
      } else {
        params.delete("query");
      }

      if (trimmed === existing) {
        return;
      }

      const nextParams = params.toString();
      logger.info("client.products.search.push", { hasQuery: Boolean(trimmed) });
      router.replace(`${pathname}?${nextParams}`, { scroll: false });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [currentQueryString, pathname, router, search]);

  function buildNextParams(update: (params: URLSearchParams) => void): string {
    const params = new URLSearchParams(searchParams.toString());
    update(params);
    return params.toString();
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by product, brand, or keyword"
          className="h-11 w-full rounded-full bg-white pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-[0_10px_24px_rgba(15,23,42,0.08)] focus:outline-none"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          value={category}
          onChange={(event) => {
            const nextParams = buildNextParams((params) => {
              if (event.target.value) {
                params.set("category", event.target.value);
                return;
              }
              params.delete("category");
            });
            logger.info("client.products.filter.category", { category: event.target.value || "all" });
            router.replace(`${pathname}?${nextParams}`, { scroll: false });
          }}
          className="h-11 rounded-full bg-white px-4 text-sm text-neutral-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] focus:outline-none"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={condition}
          onChange={(event) => {
            const nextParams = buildNextParams((params) => {
              if (event.target.value) {
                params.set("condition", event.target.value);
                return;
              }
              params.delete("condition");
            });
            logger.info("client.products.filter.condition", { condition: event.target.value || "all" });
            router.replace(`${pathname}?${nextParams}`, { scroll: false });
          }}
          className="h-11 rounded-full bg-white px-4 text-sm text-neutral-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] focus:outline-none"
          aria-label="Filter by condition"
        >
          {conditionOptions.map((item) => (
            <option key={item.label} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => {
            const nextParams = buildNextParams((params) => {
              params.set("sort", event.target.value);
            });
            logger.info("client.products.filter.sort", { sort: event.target.value });
            router.replace(`${pathname}?${nextParams}`, { scroll: false });
          }}
          className="h-11 rounded-full bg-white px-4 text-sm text-neutral-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] focus:outline-none"
          aria-label="Sort products"
        >
          <option value="latest">Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
