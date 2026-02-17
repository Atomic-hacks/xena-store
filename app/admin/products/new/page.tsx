import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { GlassCard } from "@/components/ui/glass";

export const metadata: Metadata = {
  title: "New Product",
  description: "Create product",
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-8">
      <GlassCard className="p-6">
        <h1 className="text-3xl font-bold text-white">Add Product</h1>
      </GlassCard>
      <ProductForm mode="create" categories={categories} />
    </main>
  );
}
