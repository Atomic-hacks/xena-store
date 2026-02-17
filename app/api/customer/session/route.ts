import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import {
  CUSTOMER_COOKIE_NAME,
  CUSTOMER_SESSION_MAX_AGE,
  getCustomerFromCookie,
  signCustomerSession,
} from "@/lib/customer-auth";

type CustomerSessionBody = {
  fullName?: string;
  phone?: string;
  email?: string;
  defaultLocation?: string;
};

function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "").trim();
}

function normalizeEmail(value: string): string | null {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  return isValid ? trimmed : null;
}

export async function GET(): Promise<NextResponse> {
  try {
    const customer = await getCustomerFromCookie();
    if (!customer) {
      return NextResponse.json({ customer: null, history: [] });
    }

    const history = await prisma.orderIntent.findMany({
      where: { customerId: customer.id },
      select: { id: true, finalTotal: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return NextResponse.json({ customer, history });
  } catch (error) {
    logger.error("api.customer.session.get.error");
    if (error instanceof Error) {
      logger.error("api.customer.session.get.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to load customer session" }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CustomerSessionBody;
    const fullName = body.fullName?.trim() ?? "";
    const phone = normalizePhone(body.phone?.trim() ?? "");
    const email = normalizeEmail(body.email ?? "");
    const defaultLocation = body.defaultLocation?.trim() || null;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "Full name and phone are required." },
        { status: 400 }
      );
    }

    if (fullName.length < 2 || fullName.length > 120) {
      return NextResponse.json(
        { error: "Full name must be between 2 and 120 characters." },
        { status: 400 }
      );
    }

    if (phone.length < 7 || phone.length > 20) {
      return NextResponse.json(
        { error: "Phone number format is invalid." },
        { status: 400 }
      );
    }

    if ((body.email?.trim() ?? "") && !email) {
      return NextResponse.json({ error: "Email format is invalid." }, { status: 400 });
    }

    const existing = await prisma.customerProfile.findFirst({
      where: {
        OR: [{ phone }, ...(email ? [{ email }] : [])],
      },
    });

    if (existing && email) {
      const emailOwner = await prisma.customerProfile.findUnique({
        where: { email },
        select: { id: true },
      });
      if (emailOwner && emailOwner.id !== existing.id) {
        return NextResponse.json(
          { error: "That email is already used by another profile." },
          { status: 409 }
        );
      }
    }

    const customer = existing
      ? await prisma.customerProfile.update({
          where: { id: existing.id },
          data: {
            fullName,
            phone,
            email,
            defaultLocation,
          },
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            defaultLocation: true,
          },
        })
      : await prisma.customerProfile.create({
          data: {
            fullName,
            phone,
            email,
            defaultLocation,
          },
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            defaultLocation: true,
          },
        });

    const token = await signCustomerSession(customer.id);
    const response = NextResponse.json({ customer });
    response.cookies.set(CUSTOMER_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: CUSTOMER_SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    logger.error("api.customer.session.post.error");
    if (error instanceof Error) {
      logger.error("api.customer.session.post.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to save customer profile" }, { status: 500 });
  }
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CUSTOMER_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
