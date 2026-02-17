import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

type CategoryBody = {
  name?: string;
  slug?: string;
};

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as CategoryBody;

    logger.info("db.category.update", { categoryId: id });
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    logger.error("api.admin.categories.id.patch.error");
    if (error instanceof Error) {
      logger.error("api.admin.categories.id.patch.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    logger.info("db.category.delete", { categoryId: id });

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("api.admin.categories.id.delete.error");
    if (error instanceof Error) {
      logger.error("api.admin.categories.id.delete.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
