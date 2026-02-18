"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid2x2, Headset, House, Percent, ShoppingBag, Store, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/ui/CartContextProvider";
import { GlobalProductSearch } from "@/components/layout/GlobalProductSearch";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/products?query=deal", label: "Deals" },
  { href: "/contact", label: "Support" },
];

const mobileTabs = [
  { href: "/", label: "Home", Icon: House },
  { href: "/products", label: "Shop", Icon: Store },
  { href: "/categories", label: "Categories", Icon: Grid2x2 },
  { href: "/products?query=deal", label: "Deals", Icon: Percent },
  { href: "/contact", label: "Support", Icon: Headset },
];

function isActive(pathname: string, href: string): boolean {
  const cleanHref = href.split("?")[0];
  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [showMobileTabs, setShowMobileTabs] = useState(true);
  const lastScrollY = useRef(0);
  const restTimerRef = useRef<number | null>(null);

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);

      if (currentY <= 8) {
        setShowMobileTabs(true);
      } else if (currentY > lastScrollY.current) {
        setShowMobileTabs(false);
      } else if (currentY < lastScrollY.current) {
        setShowMobileTabs(true);
      }

      lastScrollY.current = currentY;

      if (restTimerRef.current) {
        window.clearTimeout(restTimerRef.current);
      }

      restTimerRef.current = window.setTimeout(() => {
        setShowMobileTabs(true);
      }, 180);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    const raf = window.requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
      if (restTimerRef.current) {
        window.clearTimeout(restTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-shadow ${
          scrolled ? "shadow-[0_8px_30px_rgba(15,23,42,0.08)]" : "shadow-none"
        }`}
      >
        <nav className="mx-auto flex w-full max-w-[98rem] items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-[var(--font-azonix)] text-base uppercase tracking-[0.08em] text-neutral-900 sm:text-lg">
              Xena Store
            </Link>
          </div>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
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
            <div className="md:hidden">
              <GlobalProductSearch key={`${pathname}-top`} />
            </div>

            <div className="hidden md:block">
              <GlobalProductSearch key={`${pathname}-desktop`} />
            </div>

            <Link
              href="/account"
              className="hidden min-h-10 min-w-10 items-center justify-center rounded-full bg-neutral-100 px-3 text-sm text-neutral-700 transition hover:bg-neutral-200 sm:inline-flex"
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </Link>

            <Link
              href="/cart"
              className="inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-full bg-black px-3 text-sm text-white transition hover:bg-neutral-800"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden md:inline">Cart</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-black">
                {cart?.totals.itemCount ?? 0}
              </span>
            </Link>
          </div>
        </nav>
      </header>

      <div
        className={`pointer-events-none fixed inset-x-0 bottom-3 z-[60] flex justify-center transition-transform duration-300 md:hidden ${
          showMobileTabs ? "translate-y-0" : "translate-y-24"
        }`}
      >
        <nav className="pointer-events-auto w-[calc(100%-1rem)] max-w-lg rounded-3xl border border-neutral-200 bg-white/95 px-2 py-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.14)] backdrop-blur">
          <ul className="grid grid-cols-6">
            {mobileTabs.map((tab) => {
              const active = isActive(pathname, tab.href);
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={`inline-flex h-14 w-full flex-col items-center justify-center gap-1 rounded-2xl text-[11px] transition ${
                      active ? "bg-neutral-100 text-neutral-900" : "text-neutral-600"
                    }`}
                  >
                    <tab.Icon className="h-[18px] w-[18px]" />
                    <span>{tab.label}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <GlobalProductSearch key={`${pathname}-tab`} tab />
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
