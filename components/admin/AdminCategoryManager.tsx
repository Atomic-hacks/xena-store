"use client";

import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { GlassCard, glassStyles } from "@/components/ui/glass";

type Category = {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
};

export function AdminCategoryManager() {
  const { notify } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  async function load() {
    const response = await fetch("/api/admin/categories", { cache: "no-store" });
    const body = (await response.json()) as Category[] | { error: string };
    if (!response.ok || !Array.isArray(body)) {
      notify("Unable to load categories", "error");
      return;
    }
    setCategories(body);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });

    if (!response.ok) {
      notify("Unable to create category", "error");
      return;
    }

    setName("");
    setSlug("");
    notify("Category created");
    await load();
  }

  async function onDelete(id: string) {
    const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!response.ok) {
      notify("Unable to delete category", "error");
      return;
    }
    notify("Category deleted");
    await load();
  }

  async function onSaveEdit(id: string) {
    const response = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, slug: editSlug }),
    });

    if (!response.ok) {
      notify("Unable to update category", "error");
      return;
    }

    notify("Category updated");
    setEditingId(null);
    await load();
  }

  return (
    <div className="space-y-5">
      <GlassCard className="p-4">
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="Category name"
            className={`${glassStyles.input} px-3 py-2`}
          />
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
            placeholder="Slug"
            className={`${glassStyles.input} px-3 py-2`}
          />
          <button className="rounded-xl border border-fuchsia-500/35 bg-fuchsia-500/15 px-4 py-2 text-fuchsia-100" type="submit">
            Create category
          </button>
        </form>
      </GlassCard>

      <div className="space-y-2">
        {categories.map((category) => {
          const isEditing = editingId === category.id;

          return (
            <GlassCard key={category.id} className="p-3">
              <div className="flex items-center justify-between gap-3">
                {isEditing ? (
                  <div className="grid w-full gap-2 md:grid-cols-2">
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className={`${glassStyles.input} px-3 py-2`} />
                    <input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className={`${glassStyles.input} px-3 py-2`} />
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-white">{category.name}</p>
                    <p className="text-xs text-white/60">
                      {category.slug} | {category._count?.products ?? 0} products
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={() => onSaveEdit(category.id)}
                      className="rounded-lg border border-fuchsia-500/35 px-3 py-1 text-xs text-fuchsia-100"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(category.id);
                        setEditName(category.name);
                        setEditSlug(category.slug);
                      }}
                      className="rounded-lg border border-white/20 px-3 py-1 text-xs text-white/80"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onDelete(category.id)}
                    className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
