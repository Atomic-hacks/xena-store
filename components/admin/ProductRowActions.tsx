"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

type ProductStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

type Props = {
  id: string;
  status: ProductStatus;
};

export function ProductRowActions({ id, status }: Props) {
  const router = useRouter();
  const { notify } = useToast();

  async function togglePublish() {
    const next = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    if (!response.ok) {
      notify("Unable to update status", "error");
      return;
    }

    notify(next === "PUBLISHED" ? "Product published" : "Product moved to draft");
    router.refresh();
  }

  async function remove() {
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!response.ok) {
      notify("Unable to delete product", "error");
      return;
    }

    notify("Product deleted");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/products/${id}/edit`} className="rounded-lg border border-white/20 px-2 py-1 text-xs text-white/80">
        Edit
      </Link>
      <button
        type="button"
        onClick={togglePublish}
        className="rounded-lg border border-fuchsia-500/35 px-2 py-1 text-xs text-fuchsia-100"
      >
        {status === "PUBLISHED" ? "Unpublish" : "Publish"}
      </button>
      <button type="button" onClick={remove} className="rounded-lg border border-red-500/35 px-2 py-1 text-xs text-red-200">
        Delete
      </button>
    </div>
  );
}
