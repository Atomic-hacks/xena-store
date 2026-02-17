"use client";

import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  featured: boolean;
};

export function AdminProductManager({ categories }: { categories: Category[] }) {
  const { notify } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("0");
  const [stock, setStock] = useState("0");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");

  async function loadProducts() {
    const response = await fetch("/api/admin/products", { cache: "no-store" });
    const body = (await response.json()) as Product[] | { error: string };

    if (!response.ok || !Array.isArray(body)) {
      notify("Unable to load products", "error");
      return;
    }

    setProducts(body);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        categoryId,
        description: "",
        images: ["/next.svg"],
        price: Math.round(Number(price)),
        stock: Math.round(Number(stock)),
        discountType: "NONE",
        discountValue: 0,
        featured: false,
      }),
    });

    if (!response.ok) {
      notify("Unable to create product", "error");
      return;
    }

    notify("Product created");
    setName("");
    setSlug("");
    setPrice("0");
    setStock("0");
    await loadProducts();
  }

  async function onDelete(id: string) {
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!response.ok) {
      notify("Unable to delete product", "error");
      return;
    }
    notify("Product deleted");
    await loadProducts();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onCreate} className="grid gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 md:grid-cols-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="Name"
          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-white"
        />
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          required
          placeholder="Slug"
          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-white"
        />
        <input
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
          placeholder="Price in kobo"
          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-white"
        />
        <input
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          required
          placeholder="Stock"
          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-white"
        />
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-white"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button className="rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/20 px-4 py-2 text-fuchsia-200" type="submit">
          Create product
        </button>
      </form>

      <div className="space-y-2">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3">
            <div>
              <p className="font-medium text-white">{product.name}</p>
              <p className="text-xs text-white/60">
                {product.slug} | {product.price} kobo | stock {product.stock}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(product.id)}
              className="rounded-lg border border-red-500/40 px-3 py-1 text-sm text-red-200"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
