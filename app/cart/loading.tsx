export default function CartLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8" aria-busy="true">
      <div className="h-8 w-32 animate-pulse rounded-lg bg-white/10" />
      <div className="mt-6 h-60 animate-pulse rounded-3xl border border-white/10 bg-black/40" />
    </main>
  );
}
