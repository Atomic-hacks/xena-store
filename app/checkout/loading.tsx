export default function CheckoutLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8" aria-busy="true">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-white/10" />
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-3xl border border-white/10 bg-black/40" />
        <div className="h-72 animate-pulse rounded-3xl border border-white/10 bg-black/40" />
      </div>
    </main>
  );
}
