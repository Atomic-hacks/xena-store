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

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    logger.info("db.product.findUnique", { productId: id });

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    logger.error("api.admin.products.id.get.error");
    if (error instanceof Error) {
      logger.error("api.admin.products.id.get.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as ProductBody;

    logger.info("db.product.update", { productId: id });
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        brand: typeof body.brand === "string" ? body.brand.trim() || null : undefined,
        description: body.description,
        images: body.images,
        price: typeof body.price === "number" ? Math.max(0, Math.round(body.price)) : undefined,
        discountType: body.discountType,
        discountValue:
          typeof body.discountValue === "number"
            ? Math.max(0, Math.round(body.discountValue))
            : undefined,
        stock: typeof body.stock === "number" ? Math.max(0, Math.round(body.stock)) : undefined,
        featured: typeof body.featured === "boolean" ? body.featured : undefined,
        status: body.status,
        condition: body.condition,
        conditionNotes:
          typeof body.conditionNotes === "string" ? body.conditionNotes.trim() || null : undefined,
        defects: body.defects,
        dealType: body.dealType,
        warranty: typeof body.warranty === "string" ? body.warranty.trim() || null : undefined,
        accessoriesIncluded: body.accessoriesIncluded,
        batteryHealth:
          typeof body.batteryHealth === "string" ? body.batteryHealth.trim() || null : undefined,
        categoryId: body.categoryId,
        tags: body.tags,
        specs: body.specs,
        details: body.details,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    logger.error("api.admin.products.id.patch.error");
    if (error instanceof Error) {
      logger.error("api.admin.products.id.patch.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    logger.info("db.product.delete", { productId: id });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("api.admin.products.id.delete.error");
    if (error instanceof Error) {
      logger.error("api.admin.products.id.delete.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
