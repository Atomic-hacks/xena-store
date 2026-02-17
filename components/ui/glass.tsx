import { cn } from "@/lib/utils";

export const glassStyles = {
  card: "rounded-3xl border border-white/14 bg-[rgba(38,38,44,0.42)] shadow-[0_12px_28px_rgba(0,0,0,0.28)] backdrop-blur-md",
  cardSoft: "rounded-2xl border border-white/12 bg-[rgba(24,24,28,0.5)] shadow-[0_8px_18px_rgba(0,0,0,0.2)]",
  interactive: "transition duration-200 hover:bg-white/[0.045] hover:border-white/22",
  input: "rounded-xl border border-white/14 bg-white/[0.028] backdrop-blur-xl text-white placeholder:text-white/48",
  pill: "inline-flex items-center rounded-full border border-white/24 bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-xl",
  nav: "border-b border-white/8 bg-black/92",
} as const;

export function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn(glassStyles.card, className)}>{children}</section>;
}
