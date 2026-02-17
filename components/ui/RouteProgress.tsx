"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a") as HTMLAnchorElement | null;
      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || link.target === "_blank") {
        return;
      }
      if (/^https?:\/\//.test(href) && !href.includes(window.location.host)) {
        return;
      }

      setLoading(true);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => setLoading(false), 2200);
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setLoading(false));
    return () => window.cancelAnimationFrame(raf);
  }, [pathname, searchParams]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r from-neutral-300 via-black to-neutral-300 transition-all duration-300 ${
          loading ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />
    </div>
  );
}
