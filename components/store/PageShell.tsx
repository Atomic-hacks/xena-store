import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("mx-auto w-full max-w-[90rem] px-4 py-8 md:px-7 lg:px-10 md:py-10", className)}>
      {children}
    </main>
  );
}

export function GlassPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-white/8 bg-black/45 p-4 md:p-5 lg:p-6 shadow-[0_10px_24px_rgba(0,0,0,0.2)]",
        className
      )}
    >
      {children}
    </section>
  );
}
