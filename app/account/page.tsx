import Link from "next/link";
import { Metadata } from "next";
import { PageShell, GlassPanel } from "@/components/store/PageShell";
import { prisma } from "@/lib/prisma";
import { getCustomerFromCookie } from "@/lib/customer-auth";
import { CustomerAccountPanel } from "@/components/store/CustomerAccountPanel";

export const metadata: Metadata = {
  title: "Account",
  description: "View your checkout profile and order history.",
};

export default async function AccountPage() {
  const customer = await getCustomerFromCookie();

  if (!customer) {
    return (
      <PageShell className="space-y-4">
        <GlassPanel>
          <h1 className="text-3xl font-bold text-neutral-900">Account</h1>
          <p className="mt-2 text-neutral-600">
            You are not signed in with a checkout profile yet.
          </p>
          <Link
            href="/checkout"
            className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-sm text-white transition hover:bg-neutral-800"
          >
            Go to checkout profile setup
          </Link>
        </GlassPanel>
      </PageShell>
    );
  }

  const [fullCustomer, history] = await Promise.all([
    prisma.customerProfile.findUnique({
      where: { id: customer.id },
      select: {
        fullName: true,
        phone: true,
        email: true,
        defaultLocation: true,
        createdAt: true,
      },
    }),
    prisma.orderIntent.findMany({
      where: { customerId: customer.id },
      select: {
        id: true,
        finalTotal: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  if (!fullCustomer) {
    return (
      <PageShell className="space-y-4">
        <GlassPanel>
          <h1 className="text-3xl font-bold text-neutral-900">Account</h1>
          <p className="mt-2 text-neutral-600">Profile no longer exists. Please create a new one at checkout.</p>
        </GlassPanel>
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-4">
      <GlassPanel>
        <h1 className="text-3xl font-bold text-neutral-900">Your Account</h1>
        <p className="mt-1 text-neutral-600">Profile, order history, and totals.</p>
      </GlassPanel>
      <CustomerAccountPanel
        customer={{
          ...fullCustomer,
          createdAt: fullCustomer.createdAt.toISOString(),
        }}
        orderHistory={history.map((row) => ({
          ...row,
          createdAt: row.createdAt.toISOString(),
        }))}
      />
    </PageShell>
  );
}
