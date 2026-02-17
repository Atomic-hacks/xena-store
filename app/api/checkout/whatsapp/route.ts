import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { applyDiscount, formatCurrencyFromCents } from "@/lib/pricing";
import { asDiscountSnapshot } from "@/lib/cart";
import { getCustomerFromCookie } from "@/lib/customer-auth";

type CheckoutBody = {
  location?: string;
  note?: string;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const cartId = request.cookies.get("cartId")?.value;
    logger.info("checkout.cookie.read", { hasCartCookie: Boolean(cartId) });

    if (!cartId) {
      return NextResponse.json({ error: "Cart not found" }, { status: 400 });
    }

    const customer = await getCustomerFromCookie();
    if (!customer) {
      return NextResponse.json(
        { error: "Please create or sign in to a checkout profile first." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CheckoutBody;
    const location = body.location?.trim() || customer.defaultLocation || "";
    if (!location) {
      return NextResponse.json(
        { error: "Delivery location is required." },
        { status: 400 }
      );
    }
    if (location.length > 180) {
      return NextResponse.json(
        { error: "Delivery location is too long." },
        { status: 400 }
      );
    }
    const note = (body.note ?? "").trim();
    if (note.length > 600) {
      return NextResponse.json(
        { error: "Note is too long." },
        { status: 400 }
      );
    }

    logger.info("db.cart.findUnique.withItems", { cartId });
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let subtotal = 0;
    let discountTotal = 0;

    const itemLines = cart.items.map((item) => {
      const discount = asDiscountSnapshot(item.discountSnapshot);
      const discountedUnit = applyDiscount(item.unitPriceSnapshot, discount);
      const lineSubtotal = item.unitPriceSnapshot * item.quantity;
      const lineTotal = discountedUnit * item.quantity;

      subtotal += lineSubtotal;
      discountTotal += lineSubtotal - lineTotal;

      return {
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: discountedUnit,
        lineTotal,
      };
    });

    const finalTotal = subtotal - discountTotal;

    const lines: string[] = [];
    lines.push("Hello Xena Store team,");
    lines.push("");
    lines.push("I want to place this order:");
    lines.push("");

    itemLines.forEach((line, index) => {
      lines.push(
        `${index + 1}. ${line.name} | Qty: ${line.quantity} | Unit: ${formatCurrencyFromCents(
          line.unitPrice
        )} | Total: ${formatCurrencyFromCents(line.lineTotal)}`
      );
    });

    lines.push("");
    lines.push(`Subtotal: ${formatCurrencyFromCents(subtotal)}`);
    lines.push(`Discount Total: ${formatCurrencyFromCents(discountTotal)}`);
    lines.push(`Final Total: ${formatCurrencyFromCents(finalTotal)}`);
    lines.push("");
    lines.push("Customer details:");
    lines.push(`Name: ${customer.fullName}`);
    lines.push(`Phone: ${customer.phone}`);
    if (customer.email) {
      lines.push(`Email: ${customer.email}`);
    }
    lines.push(`Delivery Location: ${location}`);
    lines.push(`Note: ${note || "None"}`);

    const message = lines.join("\n");

    logger.info("db.orderIntent.create", { cartId });
    await prisma.orderIntent.create({
      data: {
        cartId,
        customerId: customer.id,
        finalTotal,
        customerInfo: {
          name: customer.fullName,
          phone: customer.phone,
          email: customer.email ?? "",
          location,
          note,
        },
        cartSnapshot: {
          cartId,
          items: itemLines,
          subtotal,
          discountTotal,
          finalTotal,
        },
      },
    });

    const number = (process.env.WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
    if (!number) {
      logger.error("checkout.whatsapp.number.missing");
      return NextResponse.json({ error: "WhatsApp number is not configured" }, { status: 500 });
    }

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    return NextResponse.json({ url });
  } catch (error) {
    logger.error("api.checkout.whatsapp.error");
    if (error instanceof Error) {
      logger.error("api.checkout.whatsapp.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Failed to create checkout link" }, { status: 500 });
  }
}
