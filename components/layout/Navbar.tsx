"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/components/ui/CartContextProvider";
import { glassStyles } from "@/components/ui/glass";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/account", label: "Account" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`sticky top-0 z-50 ${glassStyles.nav}`}>
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="text-xl font-bold text-white">
          Xena Store
        </Link>
        <ul className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    active
                      ? "border border-white/30 bg-white/10 text-white"
                      : "text-white/78 hover:bg-white/[0.045] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className={`relative inline-flex items-center gap-2 px-3 py-2 text-sm text-white hover:border-white/30 hover:text-white ${glassStyles.cardSoft}`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-white">
              {cart?.totals.itemCount ?? 0}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-white md:hidden ${glassStyles.cardSoft}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>
      {menuOpen ? (
        <div className="border-t border-white/10 px-4 pb-4 pt-3 md:hidden">
          <ul className="space-y-2">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-xl px-3 py-2.5 text-sm transition ${
                      active
                        ? "border border-white/30 bg-white/10 text-white"
                        : "border border-white/12 bg-white/[0.03] text-white/80 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
