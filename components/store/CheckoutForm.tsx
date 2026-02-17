"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { useCart } from "@/components/ui/CartContextProvider";
import { Currency } from "@/components/store/Currency";
import { glassStyles } from "@/components/ui/glass";

type CustomerSession = {
  customer: {
    id: string;
    fullName: string;
    phone: string;
    email: string | null;
    defaultLocation: string | null;
  } | null;
  history: Array<{ id: string; finalTotal: number; createdAt: string }>;
};

export function CheckoutForm() {
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [session, setSession] = useState<CustomerSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [profilePending, setProfilePending] = useState(false);
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const { notify } = useToast();
  const { cart } = useCart();

  const hasProfile = Boolean(session?.customer);
  const totalHistoryValue = useMemo(
    () =>
      (session?.history ?? []).reduce((acc, order) => acc + order.finalTotal, 0),
    [session?.history]
  );

  const loadSession = useCallback(async () => {
    setSessionLoading(true);
    try {
      const response = await fetch("/api/customer/session", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const body = (await response.json()) as CustomerSession | { error: string };
      if (!response.ok || "error" in body) {
        notify("Unable to load checkout profile", "error");
        return;
      }
      setSession(body);
      if (body.customer?.defaultLocation) {
        setLocation(body.customer.defaultLocation);
      }
    } catch {
      notify("Unable to load checkout profile", "error");
    } finally {
      setSessionLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  async function saveProfile(): Promise<boolean> {
    setProfilePending(true);
    try {
      const response = await fetch("/api/customer/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: profileName,
          phone: profilePhone,
          email: profileEmail,
          defaultLocation: location,
        }),
      });

      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        notify(body.error ?? "Unable to save profile", "error");
        return false;
      }

      await loadSession();
      notify("Checkout profile saved");
      return true;
    } catch {
      notify("Unable to save profile", "error");
      return false;
    } finally {
      setProfilePending(false);
    }
  }

  async function logoutProfile() {
    try {
      const response = await fetch("/api/customer/session", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        notify("Unable to sign out profile", "error");
        return;
      }

      setSession({ customer: null, history: [] });
      setProfileName("");
      setProfilePhone("");
      setProfileEmail("");
      notify("Profile signed out");
    } catch {
      notify("Unable to sign out profile", "error");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasProfile) {
      const ok = await saveProfile();
      if (!ok) {
        return;
      }
    }

    setPending(true);
    try {
      const response = await fetch("/api/checkout/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ location, note }),
      });

      const body = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !body.url) {
        notify(body.error ?? "Unable to create WhatsApp link", "error");
        return;
      }

      window.location.assign(body.url);
    } catch {
      notify("Checkout failed", "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={onSubmit} className={`space-y-4 p-6 ${glassStyles.card}`}>
        <h2 className="text-xl font-semibold text-white">Delivery details</h2>
        {!hasProfile ? (
          <div className={`space-y-3 rounded-2xl p-4 ${glassStyles.cardSoft}`}>
            <p className="text-sm text-white/80">
              Create a quick profile for checkout history and totals.
            </p>
            <input
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
              required
              placeholder="Full name"
              className={`w-full px-4 py-3 ${glassStyles.input}`}
            />
            <input
              value={profilePhone}
              onChange={(event) => setProfilePhone(event.target.value)}
              required
              placeholder="Phone number"
              className={`w-full px-4 py-3 ${glassStyles.input}`}
            />
            <input
              value={profileEmail}
              onChange={(event) => setProfileEmail(event.target.value)}
              placeholder="Email (optional)"
              className={`w-full px-4 py-3 ${glassStyles.input}`}
            />
            <button
              type="button"
              onClick={() => void saveProfile()}
              disabled={profilePending || sessionLoading}
              className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-white transition hover:bg-white hover:text-black disabled:opacity-60"
            >
              {profilePending ? "Saving profile..." : "Save profile"}
            </button>
          </div>
        ) : (
          <div className={`rounded-2xl p-4 ${glassStyles.cardSoft}`}>
            <p className="text-sm text-white/85">
              Checking out as <span className="font-medium">{session?.customer?.fullName}</span>
            </p>
            <p className="text-xs text-white/65">
              {session?.customer?.phone}
              {session?.customer?.email ? ` | ${session.customer.email}` : ""}
            </p>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => void logoutProfile()}
                className="rounded-lg border border-white/25 px-3 py-1 text-xs text-white/80 hover:bg-white/[0.04]"
              >
                Use a different profile
              </button>
            </div>
          </div>
        )}
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          required
          placeholder="Delivery location"
          className={`w-full px-4 py-3 ${glassStyles.input}`}
        />
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Optional note"
          className={`h-24 w-full px-4 py-3 ${glassStyles.input}`}
        />
        <button
          type="submit"
          disabled={pending || sessionLoading || !cart || cart.items.length === 0}
          className="rounded-xl border border-white/25 bg-white px-4 py-2 text-black transition hover:bg-white/85 disabled:opacity-60"
        >
          {pending ? "Preparing..." : "Open WhatsApp"}
        </button>
      </form>

      <aside className={`h-fit p-6 ${glassStyles.card}`}>
        <h3 className="text-lg font-semibold text-white">Order summary</h3>
        {!cart || cart.items.length === 0 ? (
          <p className="mt-3 text-white/70">Your cart is empty.</p>
        ) : (
          <>
            <div className="mt-4 space-y-3 text-sm">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-white/80">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    <Currency cents={item.lineTotal} />
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-white/10 pt-3 text-sm text-white/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  <Currency cents={cart.totals.subtotal} />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>
                  -<Currency cents={cart.totals.discountTotal} />
                </span>
              </div>
              <div className="mt-2 flex justify-between font-semibold text-white">
                <span>Total</span>
                <span>
                  <Currency cents={cart.totals.finalTotal} />
                </span>
              </div>
            </div>
          </>
        )}

        {hasProfile ? (
          <div className={`mt-5 space-y-3 rounded-2xl p-4 ${glassStyles.cardSoft}`}>
            <div>
              <h4 className="text-sm font-semibold text-white">Your recent checkout totals</h4>
              <p className="text-xs text-white/65">
                Last {session?.history.length ?? 0} orders: <Currency cents={totalHistoryValue} />
              </p>
            </div>
            {session?.history.length ? (
              <ul className="space-y-2 text-xs text-white/75">
                {session.history.map((order) => (
                  <li key={order.id} className="flex items-center justify-between">
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="font-medium text-white">
                      <Currency cents={order.finalTotal} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/65">No previous checkout history yet.</p>
            )}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
