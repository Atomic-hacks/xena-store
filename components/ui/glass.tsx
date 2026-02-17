import { cn } from "@/lib/utils";

export const glassStyles = {
  card: "rounded-3xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.08)]",
  cardSoft: "rounded-2xl bg-neutral-50 shadow-[0_8px_18px_rgba(15,23,42,0.06)]",
  interactive: "transition duration-200 hover:bg-neutral-100",
  input: "rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 shadow-[0_8px_20px_rgba(15,23,42,0.07)]",
  pill: "inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-700",
  nav: "border-b border-neutral-200 bg-white",
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
