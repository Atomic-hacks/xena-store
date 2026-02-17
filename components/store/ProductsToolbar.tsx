"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/ui/SearchBar";
import { logger } from "@/lib/logger";
import { glassStyles } from "@/components/ui/glass";

type CategoryOption = {
  slug: string;
  name: string;
};

const conditionOptions: Array<{ value: "" | ProductCondition; label: string }> = [
  { value: "", label: "All conditions" },
  { value: "NEW", label: "New" },
  { value: "UK_USED", label: "UK Used" },
  { value: "NG_USED", label: "NG Used" },
];

type ProductCondition = "NEW" | "UK_USED" | "NG_USED";

export function ProductsToolbar({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryFromUrl = searchParams.get("query") ?? "";
  const [search, setSearch] = useState(queryFromUrl);

  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "latest";
  const condition = (searchParams.get("condition") as ProductCondition | null) ?? "";

  useEffect(() => {
    setSearch((current) => (current === queryFromUrl ? current : queryFromUrl));
  }, [queryFromUrl]);

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
      const next = `${pathname}?${nextParams}`;
      logger.info("client.products.search.push", { hasQuery: Boolean(trimmed) });
      router.replace(next, { scroll: false });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [currentQueryString, pathname, router, search]);

  function buildNextParams(
    update: (params: URLSearchParams) => void
  ): string {
    const params = new URLSearchParams(searchParams.toString());
    update(params);
    return params.toString();
  }

  return (
    <div className="space-y-4">
      <SearchBar value={search} onChange={setSearch} placeholder="Search by name, brand, tag, or condition..." />
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="text-sm text-white/70" htmlFor="category-filter">
          Category
        </label>
        <select
          id="category-filter"
          value={category}
          onChange={(event) => {
            const nextParams = buildNextParams((params) => {
              if (event.target.value) {
                params.set("category", event.target.value);
                return;
              }
              params.delete("category");
            });
            logger.info("client.products.filter.category", {
              category: event.target.value || "all",
            });
            router.replace(`${pathname}?${nextParams}`, { scroll: false });
          }}
          className={`${glassStyles.input} px-3 py-2 text-sm`}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>

        <label className="text-sm text-white/70" htmlFor="condition-filter">
          Condition
        </label>
        <select
          id="condition-filter"
          value={condition}
          onChange={(event) => {
            const nextParams = buildNextParams((params) => {
              if (event.target.value) {
                params.set("condition", event.target.value);
                return;
              }
              params.delete("condition");
            });
            logger.info("client.products.filter.condition", {
              condition: event.target.value || "all",
            });
            router.replace(`${pathname}?${nextParams}`, { scroll: false });
          }}
          className={`${glassStyles.input} px-3 py-2 text-sm`}
        >
          {conditionOptions.map((item) => (
            <option key={item.label} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <label className="text-sm text-white/70" htmlFor="sort-filter">
          Sort
        </label>
        <select
          id="sort-filter"
          value={sort}
          onChange={(event) => {
            const nextParams = buildNextParams((params) => {
              params.set("sort", event.target.value);
            });
            logger.info("client.products.filter.sort", { sort: event.target.value });
            router.replace(`${pathname}?${nextParams}`, { scroll: false });
          }}
          className={`${glassStyles.input} px-3 py-2 text-sm`}
        >
          <option value="latest">Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
