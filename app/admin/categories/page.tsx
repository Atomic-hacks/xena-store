import { Metadata } from "next";
import { AdminCategoryManager } from "@/components/admin/AdminCategoryManager";
import { GlassCard } from "@/components/ui/glass";

export const metadata: Metadata = {
  title: "Admin Categories",
  description: "Manage categories.",
};

export default function AdminCategoriesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8">
      <GlassCard className="p-6">
        <h1 className="text-3xl font-bold text-white">Admin Categories</h1>
        <p className="mt-1 text-white/70">Add, edit, and remove categories with live product counts.</p>
      </GlassCard>
      <AdminCategoryManager />
    </main>
  );
}
