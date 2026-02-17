"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Currency } from "@/components/store/Currency";
import { glassStyles } from "@/components/ui/glass";

type Props = {
  customer: {
    fullName: string;
    phone: string;
    email: string | null;
    defaultLocation: string | null;
    createdAt: string;
  };
  orderHistory: Array<{ id: string; finalTotal: number; createdAt: string }>;
};

export function CustomerAccountPanel({ customer, orderHistory }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const lifetimeTotal = orderHistory.reduce((acc, row) => acc + row.finalTotal, 0);

  async function signOut() {
    setPending(true);
    try {
      await fetch("/api/customer/session", {
        method: "DELETE",
        credentials: "include",
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className={`p-5 md:p-6 ${glassStyles.card}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">{customer.fullName}</h2>
            <p className="text-sm text-white/70">{customer.phone}</p>
            {customer.email ? <p className="text-sm text-white/70">{customer.email}</p> : null}
            {customer.defaultLocation ? (
              <p className="mt-1 text-sm text-white/65">{customer.defaultLocation}</p>
            ) : null}
          </div>
          <button
            type="button"
            disabled={pending}
            onClick={() => void signOut()}
            className="rounded-lg border border-white/25 px-3 py-1 text-xs text-white/80 hover:bg-white/[0.04] disabled:opacity-60"
          >
            {pending ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </section>

      <section className={`p-5 md:p-6 ${glassStyles.card}`}>
        <h3 className="text-lg font-semibold text-white">Order history</h3>
        <p className="mt-1 text-sm text-white/70">
          Total across {orderHistory.length} orders: <Currency cents={lifetimeTotal} />
        </p>
        {orderHistory.length === 0 ? (
          <p className="mt-4 text-sm text-white/60">No orders yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {orderHistory.map((order) => (
              <li
                key={order.id}
                className={`flex items-center justify-between rounded-xl p-3 ${glassStyles.cardSoft}`}
              >
                <span className="text-sm text-white/75">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm font-medium text-white">
                  <Currency cents={order.finalTotal} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
