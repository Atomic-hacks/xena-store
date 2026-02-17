import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for Xena Store.",
};

export default async function AdminDashboardPage() {
  const [products, categories, carts] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.cart.count(),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8">
      <section className="rounded-3xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
            Products: {products}
          </article>
          <article className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
            Categories: {categories}
          </article>
          <article className="rounded-2xl border border-white/10 bg-black/30 p-4 text-white">
            Carts: {carts}
          </article>
        </div>
      </section>

      <section className="flex gap-3">
        <Link href="/admin/products" className="rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/20 px-4 py-2 text-fuchsia-200">
          Manage products
        </Link>
        <Link href="/admin/categories" className="rounded-xl border border-white/20 bg-black/40 px-4 py-2 text-white">
          Manage categories
        </Link>
      </section>
    </main>
  );
}
