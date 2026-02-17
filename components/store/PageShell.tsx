import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[98rem] px-4 py-8 sm:px-6 md:px-8 md:py-10 lg:px-10 xl:px-12",
        className
      )}
    >
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
        "rounded-3xl bg-white p-4 shadow-[0_14px_38px_rgba(15,23,42,0.08)] md:p-5 lg:p-6",
        className
      )}
    >
      {children}
    </section>
  );
}
