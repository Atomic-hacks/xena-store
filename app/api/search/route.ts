import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/store";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const rawLimit = Number(request.nextUrl.searchParams.get("limit") ?? "8");
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 12) : 8;

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  const products = await getProducts({ query, sort: "latest" });

  const trimmed = products.slice(0, limit).map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    image: product.image,
    finalPrice: product.finalPrice,
    category: product.category,
    stock: product.stock,
    isOnSale: product.isOnSale,
  }));

  return NextResponse.json({ products: trimmed });
}
