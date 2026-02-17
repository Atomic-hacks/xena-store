export const STOREFRONT_CATEGORY_LABELS = [
  "Mobile Phones",
  "Tablets",
  "Gaming Phones",
  "Gaming Accessories",
  "Monitors",
  "Laptops",
] as const;

export type StorefrontCategoryLabel = (typeof STOREFRONT_CATEGORY_LABELS)[number];

export function toKebab(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
