import { DiscountType, ProductCondition, ProductStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

type DealType = "NONE" | "CHEAP_DEAL" | "HOT_SALE" | "CLEARANCE";

type ProductBody = {
  name?: string;
  slug?: string;
  brand?: string;
  description?: string;
  images?: string[];
  price?: number;
  discountType?: DiscountType;
  discountValue?: number;
  stock?: number;
  featured?: boolean;
  status?: ProductStatus;
  condition?: ProductCondition;
  conditionNotes?: string;
  defects?: Array<{ title: string; description: string; severity?: string }>;
  dealType?: DealType;
  warranty?: string;
  accessoriesIncluded?: string[];
  batteryHealth?: string;
  categoryId?: string;
  tags?: string[];
  specs?: Array<{ key: string; value: string }>;
  details?: Array<{ key: string; value: string }>;
};

export async function GET(): Promise<NextResponse> {
  try {
    logger.info("db.product.findMany.admin");
    const rows = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rows);
  } catch (error) {
    logger.error("api.admin.products.get.error");
    if (error instanceof Error) {
      logger.error("api.admin.products.get.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ProductBody;
    if (!body.name || !body.slug || !body.categoryId || typeof body.price !== "number") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    logger.info("db.product.create");
    const created = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        brand: body.brand?.trim() || null,
        description: body.description ?? "",
        images: body.images ?? ["/next.svg"],
        price: Math.max(0, Math.round(body.price)),
        discountType: body.discountType ?? DiscountType.NONE,
        discountValue: Math.max(0, Math.round(body.discountValue ?? 0)),
        stock: Math.max(0, Math.round(body.stock ?? 0)),
        featured: Boolean(body.featured),
        status: body.status ?? ProductStatus.PUBLISHED,
        condition: body.condition ?? ProductCondition.NEW,
        conditionNotes: body.conditionNotes?.trim() || null,
        defects: body.defects ?? [],
        dealType: body.dealType ?? "NONE",
        warranty: body.warranty?.trim() || null,
        accessoriesIncluded: body.accessoriesIncluded ?? [],
        batteryHealth: body.batteryHealth?.trim() || null,
        categoryId: body.categoryId,
        tags: body.tags ?? [],
        specs: body.specs ?? [],
        details: body.details ?? [],
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    logger.error("api.admin.products.post.error");
    if (error instanceof Error) {
      logger.error("api.admin.products.post.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
