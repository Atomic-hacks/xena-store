export default function ProductsLoading() {
  return (
    <main className="mx-auto flex w-full max-w-[90rem] items-center justify-center px-4 py-16 md:px-7 lg:px-10" aria-busy="true">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/25 border-t-white/90" />
    </main>
  );
}
