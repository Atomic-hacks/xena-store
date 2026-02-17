import { DiscountType, Prisma, ProductCondition, ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { applyDiscount } from "@/lib/pricing";
import { logger } from "@/lib/logger";

type DealTypeValue = "NONE" | "CHEAP_DEAL" | "HOT_SALE" | "CLEARANCE";
type ProductConditionValue = "NEW" | "UK_USED" | "NG_USED";
type ProductStatusValue = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export type ProductCardDTO = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  categorySlug: string;
  image: string;
  images: string[];
  price: number;
  discountType: DiscountType;
  discountValue: number;
  finalPrice: number;
  isOnSale: boolean;
  featured: boolean;
  stock: number;
  status: ProductStatusValue;
  condition: ProductConditionValue;
  conditionNotes: string;
  defects: Array<{ title: string; description: string; severity?: string }>;
  dealType: DealTypeValue;
  warranty: string;
  accessoriesIncluded: string[];
  batteryHealth: string;
  tags: string[];
  specs: Array<{ key: string; value: string }>;
  details: Array<{ key: string; value: string }>;
};

const VALID_CONDITIONS: ProductConditionValue[] = ["NEW", "UK_USED", "NG_USED"];
const VALID_STATUSES: ProductStatusValue[] = ["PUBLISHED", "DRAFT", "ARCHIVED"];
const VALID_DEAL_TYPES: DealTypeValue[] = ["NONE", "CHEAP_DEAL", "HOT_SALE", "CLEARANCE"];

function normalizeCondition(value: unknown): ProductConditionValue {
  return typeof value === "string" && VALID_CONDITIONS.includes(value as ProductConditionValue)
    ? (value as ProductConditionValue)
    : "NEW";
}

function normalizeStatus(value: unknown): ProductStatusValue {
  return typeof value === "string" && VALID_STATUSES.includes(value as ProductStatusValue)
    ? (value as ProductStatusValue)
    : "PUBLISHED";
}

function normalizeDealType(value: unknown): DealTypeValue {
  return typeof value === "string" && VALID_DEAL_TYPES.includes(value as DealTypeValue)
    ? (value as DealTypeValue)
    : "NONE";
}

function parseStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseKV(value: Prisma.JsonValue | null | undefined): Array<{ key: string; value: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const row = entry as { key?: string; value?: string };
      if (!row.key || !row.value) {
        return null;
      }
      return { key: row.key, value: row.value };
    })
    .filter((entry): entry is { key: string; value: string } => Boolean(entry));
}

function parseDefects(
  value: Prisma.JsonValue | null | undefined
): Array<{ title: string; description: string; severity?: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  const defects: Array<{ title: string; description: string; severity?: string }> = [];

  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const row = entry as { title?: string; description?: string; severity?: string };
    if (!row.title || !row.description) {
      continue;
    }

    defects.push(
      row.severity
        ? { title: row.title, description: row.description, severity: row.severity }
        : { title: row.title, description: row.description }
    );
  }

  return defects;
}

export function toProductCardDTO(product: {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  description: string;
  images: Prisma.JsonValue;
  price: number;
  discountType: DiscountType | "NONE" | "PERCENT" | "FIXED";
  discountValue: number;
  featured: boolean;
  stock: number;
  status?: ProductStatus | ProductStatusValue | null;
  condition?: ProductCondition | ProductConditionValue | null;
  conditionNotes: string | null;
  defects: Prisma.JsonValue | null;
  dealType?: DealTypeValue | null;
  warranty: string | null;
  accessoriesIncluded: Prisma.JsonValue | null;
  batteryHealth: string | null;
  tags: Prisma.JsonValue | null;
  specs: Prisma.JsonValue | null;
  details: Prisma.JsonValue | null;
  category: { name: string; slug: string };
}): ProductCardDTO {
  const safeDiscountType: DiscountType =
    product.discountType === DiscountType.PERCENT || product.discountType === DiscountType.FIXED
      ? (product.discountType as DiscountType)
      : DiscountType.NONE;
  const discount = { type: safeDiscountType, value: product.discountValue };
  const images = parseStringArray(product.images);
  const finalPrice = applyDiscount(product.price, discount);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand ?? "",
    description: product.description,
    category: product.category.name,
    categorySlug: product.category.slug,
    image: images[0] ?? "/next.svg",
    images: images.length > 0 ? images : ["/next.svg"],
    price: product.price,
    discountType: safeDiscountType,
    discountValue: product.discountValue,
    finalPrice,
    isOnSale: finalPrice < product.price,
    featured: product.featured,
    stock: product.stock,
    status: normalizeStatus(product.status),
    condition: normalizeCondition(product.condition),
    conditionNotes: product.conditionNotes ?? "",
    defects: parseDefects(product.defects),
    dealType: normalizeDealType(product.dealType),
    warranty: product.warranty ?? "",
    accessoriesIncluded: parseStringArray(product.accessoriesIncluded),
    batteryHealth: product.batteryHealth ?? "",
    tags: parseStringArray(product.tags),
    specs: parseKV(product.specs),
    details: parseKV(product.details),
  };
}

export async function getFeaturedProducts(limit = 8): Promise<ProductCardDTO[]> {
  const rows = await prisma.product.findMany({
    where: { status: ProductStatus.PUBLISHED, featured: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((row) => toProductCardDTO(row));
}

export async function getHotSaleProducts(limit = 6): Promise<ProductCardDTO[]> {
  try {
    const rows = await prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        OR: [{ dealType: "HOT_SALE" }, { discountType: { not: "NONE" } }],
      },
      include: { category: true },
      orderBy: [{ dealType: "desc" }, { updatedAt: "desc" }],
      take: limit,
    });

    return rows.map((row) => toProductCardDTO(row));
  } catch {
    logger.warn("products.hot_sale.fallback.legacy_schema");
    const rows = await prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        discountType: { not: "NONE" },
      },
      include: { category: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
    return rows.map((row) => toProductCardDTO(row));
  }
}

export async function getCheapDealProducts(limit = 6): Promise<ProductCardDTO[]> {
  try {
    const rows = await prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        dealType: "CHEAP_DEAL",
      },
      include: { category: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
    return rows.map((row) => toProductCardDTO(row));
  } catch {
    logger.warn("products.cheap_deal.fallback.legacy_schema");
    return [];
  }
}

export async function getCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: {
            where: { status: ProductStatus.PUBLISHED },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    count: category._count.products,
  }));
}

export async function getProducts(params: {
  query?: string;
  category?: string;
  condition?: ProductCondition | ProductConditionValue | "";
  sort?: "latest" | "price_asc" | "price_desc";
}) {
  const trimmedQuery = params.query?.trim() ?? "";
  const safeCondition =
    params.condition &&
    VALID_CONDITIONS.includes(params.condition as ProductConditionValue)
      ? (params.condition as ProductConditionValue)
      : undefined;

  const searchWhere: Prisma.ProductWhereInput | undefined = trimmedQuery
    ? {
        OR: [
          { name: { contains: trimmedQuery } },
          { brand: { contains: trimmedQuery } },
          { description: { contains: trimmedQuery } },
          { slug: { contains: trimmedQuery } },
        ],
      }
    : undefined;

  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.PUBLISHED,
    ...(params.category ? { category: { slug: params.category } } : {}),
    ...(safeCondition ? { condition: safeCondition } : {}),
    ...(searchWhere ?? {}),
  };

  logger.info("products.search.build", {
    query: trimmedQuery || "none",
    hasQuery: Boolean(trimmedQuery),
    category: params.category,
    condition: safeCondition,
    sort: params.sort,
  });

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    params.sort === "price_asc"
      ? { price: "asc" }
      : params.sort === "price_desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  logger.info("db.product.findMany.search", {
    whereHasQuery: Boolean(searchWhere),
    whereHasCategory: Boolean(params.category),
    whereHasCondition: Boolean(safeCondition),
  });
  let rows: Array<
    Prisma.ProductGetPayload<{
      include: { category: true };
    }>
  > = [];
  try {
    rows = await prisma.product.findMany({ where, include: { category: true }, orderBy });
  } catch {
    logger.warn("products.search.fallback.legacy_schema", {
      hadCondition: Boolean(safeCondition),
    });
    const legacyWhere: Prisma.ProductWhereInput = {
      status: ProductStatus.PUBLISHED,
      ...(params.category ? { category: { slug: params.category } } : {}),
      ...(searchWhere ?? {}),
    };
    rows = await prisma.product.findMany({ where: legacyWhere, include: { category: true }, orderBy });
  }

  const normalizedQuery = trimmedQuery.toLowerCase();
  const filteredByTagsAndCondition = rows.filter((row) => {
    if (!normalizedQuery) {
      return true;
    }

    const tags = parseStringArray(row.tags).join(" ").toLowerCase();
    const conditionText = String((row as { condition?: string | null }).condition ?? "")
      .replace(/_/g, " ")
      .toLowerCase();
    const name = row.name.toLowerCase();
    const brand = (row.brand ?? "").toLowerCase();
    const description = row.description.toLowerCase();
    const slug = row.slug.toLowerCase();

    return (
      name.includes(normalizedQuery) ||
      brand.includes(normalizedQuery) ||
      description.includes(normalizedQuery) ||
      tags.includes(normalizedQuery) ||
      conditionText.includes(normalizedQuery) ||
      slug.includes(normalizedQuery)
    );
  });

  logger.info("products.search.result", {
    totalDbRows: rows.length,
    totalRows: filteredByTagsAndCondition.length,
    query: trimmedQuery || "none",
  });

  return filteredByTagsAndCondition.map((row) => toProductCardDTO(row));
}

export async function getProductBySlug(slug: string): Promise<ProductCardDTO | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || product.status !== ProductStatus.PUBLISHED) {
    return null;
  }

  return toProductCardDTO(product);
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}
