import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { applyDiscount, type DiscountSnapshot } from "@/lib/pricing";
import { GlassCard } from "@/components/ui/glass";
import { ConditionPill, DealPill, DiscountPill, StatusPill } from "@/components/store/Pills";
import { ProductRowActions } from "@/components/admin/ProductRowActions";

export const metadata: Metadata = {
  title: "Admin Products",
  description: "Manage products.",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Products</h1>
            <p className="mt-1 text-white/70">Manage inventory, condition, and publishing status.</p>
          </div>
          <Link href="/admin/products/new" className="rounded-xl border border-fuchsia-400/40 bg-fuchsia-500/15 px-4 py-2 text-sm text-fuchsia-100">
            Add Product
          </Link>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-white/85">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Condition</th>
                <th className="px-4 py-3 text-left">Deal</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const image = Array.isArray(product.images) ? String(product.images[0] ?? "/next.svg") : "/next.svg";
                const discount: DiscountSnapshot = {
                  type: product.discountType,
                  value: product.discountValue,
                };
                const discounted = applyDiscount(product.price, discount);
                const percent =
                  product.discountType === "PERCENT" ? product.discountValue : Math.round(((product.price - discounted) / Math.max(1, product.price)) * 100);

                return (
                  <tr key={product.id} className="border-t border-white/8">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={image} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-xs text-white/55">{product.category.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">₦{(discounted / 100).toLocaleString()}</p>
                      {discounted < product.price ? (
                        <p className="text-xs text-white/45 line-through">₦{(product.price / 100).toLocaleString()}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={product.status} />
                    </td>
                    <td className="px-4 py-3">
                      <ConditionPill condition={product.condition} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <DealPill dealType={product.dealType} />
                        {discounted < product.price ? <DiscountPill percent={percent} /> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      <ProductRowActions id={product.id} status={product.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </main>
  );
}
