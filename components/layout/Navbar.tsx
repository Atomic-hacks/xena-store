"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/ui/CartContextProvider";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/products?query=deal", label: "Deals" },
  { href: "/contact", label: "Support" },
];

function isActive(pathname: string, href: string): boolean {
  const cleanHref = href.split("?")[0];
  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-[90rem] items-center justify-between gap-3 px-4 py-3 md:px-7 lg:px-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/12 bg-white/[0.03] text-white md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <Link href="/" className="font-[var(--font-azonix)] text-base uppercase tracking-[0.12em] text-white sm:text-lg">
            Xena Store
          </Link>
        </div>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`inline-flex min-h-10 items-center rounded-lg px-3 text-sm transition ${
                  isActive(pathname, link.href)
                    ? "bg-white/[0.1] text-white"
                    : "text-white/72 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/12 bg-white/[0.03] text-white/85 transition hover:text-white"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            href="/account"
            className="hidden min-h-10 items-center gap-2 rounded-lg border border-white/12 bg-white/[0.03] px-3 text-sm text-white/80 transition hover:text-white sm:inline-flex"
          >
            <User className="h-4 w-4" />
            Account
          </Link>

          <Link
            href="/cart"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/12 bg-white/[0.03] px-3 text-sm text-white transition hover:border-white/25"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="rounded-full bg-violet-500/85 px-2 py-0.5 text-[11px] font-semibold text-white">
              {cart?.totals.itemCount ?? 0}
            </span>
          </Link>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 px-4 pb-4 pt-3 md:hidden">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg border px-3 py-2.5 text-sm ${
                    isActive(pathname, link.href)
                      ? "border-white/25 bg-white/[0.1] text-white"
                      : "border-white/12 bg-white/[0.03] text-white/78"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/account"
                className="block rounded-lg border border-white/12 bg-white/[0.03] px-3 py-2.5 text-sm text-white/78"
              >
                Account
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
