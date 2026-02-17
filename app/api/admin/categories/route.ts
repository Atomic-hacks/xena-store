import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

type CategoryBody = {
  name?: string;
  slug?: string;
};

export async function GET(): Promise<NextResponse> {
  try {
    logger.info("db.category.findMany.admin");
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    logger.error("api.admin.categories.get.error");
    if (error instanceof Error) {
      logger.error("api.admin.categories.get.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CategoryBody;
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Missing name/slug" }, { status: 400 });
    }

    logger.info("db.category.create");
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    logger.error("api.admin.categories.post.error");
    if (error instanceof Error) {
      logger.error("api.admin.categories.post.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
