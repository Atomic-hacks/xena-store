"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/ui/CartContextProvider";
import { GlobalProductSearch } from "@/components/layout/GlobalProductSearch";

const links = [
  { href: "/", label: "Home" },
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    const raf = window.requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-shadow ${
        scrolled ? "shadow-[0_8px_30px_rgba(15,23,42,0.08)]" : "shadow-none"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-[98rem] items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <Link href="/" className="font-[var(--font-azonix)] text-base uppercase tracking-[0.08em] text-neutral-900 sm:text-lg">
            Xena Store
          </Link>
        </div>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm transition ${
                  isActive(pathname, link.href)
                    ? "bg-black text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <GlobalProductSearch key={pathname} />

          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="hidden min-h-10 min-w-10 items-center justify-center rounded-full bg-neutral-100 px-3 text-sm text-neutral-700 transition hover:bg-neutral-200 sm:inline-flex"
            aria-label="Account"
          >
            <User className="h-4 w-4" />
          </Link>

          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-black px-3 text-sm text-white transition hover:bg-neutral-800"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-black">
              {cart?.totals.itemCount ?? 0}
            </span>
          </Link>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-neutral-200 px-4 pb-4 pt-3 sm:px-6 md:hidden">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg border px-3 py-2.5 text-sm ${
                    isActive(pathname, link.href)
                      ? "border-black bg-black text-white"
                      : "border-neutral-200 bg-white text-neutral-700"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="block rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700"
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
