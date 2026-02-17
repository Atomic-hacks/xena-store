"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass";

type Spotlight = {
  name: string;
  slug: string;
  description: string;
  image: string;
};

export function HeroBanner({ spotlight }: { spotlight?: Spotlight }) {
  return (
    <GlassCard className="relative overflow-hidden p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_45%_45%,rgba(255,255,255,0.22),transparent_38%),radial-gradient(circle_at_10%_90%,rgba(255,255,255,0.08),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 xena-grain opacity-[0.025]" />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 grid min-h-[540px] gap-6 lg:grid-cols-[1.05fr_1.2fr_0.9fr]"
      >
        <div className="order-2 flex flex-col justify-end space-y-4 lg:order-1">
          <p className="text-xs uppercase tracking-[0.22em] text-white/70">Xena Store</p>
          <h1 className="text-4xl font-semibold leading-[0.95] text-white md:text-6xl">
            Sound.
            <br />
            Power.
            <br />
            Precision.
          </h1>
          <p className="max-w-sm text-base text-white/70">
            Premium gadgets with clear condition labels, transparent pricing, and clean product detail.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-xl border border-white/25 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/85"
            >
              Shop Products
            </Link>
            <Link
              href="/categories"
              className="rounded-xl border border-white/20 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.09]"
            >
              Browse Categories
            </Link>
          </div>
        </div>

        <div className="order-1 flex items-center justify-center lg:order-2">
          <div className="relative w-full max-w-[520px]">
            <div className="absolute -bottom-8 left-1/2 h-20 w-[72%] -translate-x-1/2 rounded-full bg-black/45 blur-3xl" />
            <img
              src={spotlight?.image || "/next.svg"}
              alt={spotlight?.name || "Featured product"}
              className="relative z-10 mx-auto max-h-[470px] w-full object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>

        <div className="order-3 flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/18 bg-white/[0.045]">
            <img
              src={spotlight?.image || "/next.svg"}
              alt={spotlight?.name || "Spotlight product"}
              className="h-44 w-full object-cover"
            />
            <div className="space-y-3 p-4">
              <p className="line-clamp-2 text-lg font-medium leading-snug text-white">
                {spotlight?.name || "New arrivals this week"}
              </p>
              <p className="line-clamp-2 text-sm text-white/70">
                {spotlight?.description || "Curated picks built for everyday performance."}
              </p>
              <Link
                href={spotlight ? `/products/${spotlight.slug}` : "/products"}
                className="block rounded-xl border border-white/20 bg-black/45 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-white hover:text-black"
              >
                View Product
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </GlassCard>
  );
}
