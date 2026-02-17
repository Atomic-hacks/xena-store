import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { GlassCard } from "@/components/ui/glass";

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit product",
};

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry): entry is string => typeof entry === "string");
}

function asKVArray(value: unknown): Array<{ key: string; value: string }> {
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

function asDefectArray(value: unknown): Array<{ title: string; description: string; severity?: string }> {
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

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [categories, product] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.product.findUnique({ where: { id } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-8">
      <GlassCard className="p-6">
        <h1 className="text-3xl font-bold text-white">Edit Product</h1>
      </GlassCard>
      <ProductForm
        mode="edit"
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          description: product.description,
          price: product.price,
          discountType: product.discountType,
          discountValue: product.discountValue,
          categoryId: product.categoryId,
          tags: asStringArray(product.tags),
          specs: asKVArray(product.specs),
          details: asKVArray(product.details),
          stock: product.stock,
          featured: product.featured,
          status: product.status,
          condition: product.condition,
          conditionNotes: product.conditionNotes,
          defects: asDefectArray(product.defects),
          dealType: product.dealType,
          warranty: product.warranty,
          accessoriesIncluded: asStringArray(product.accessoriesIncluded),
          batteryHealth: product.batteryHealth,
          images: asStringArray(product.images),
        }}
      />
    </main>
  );
}
