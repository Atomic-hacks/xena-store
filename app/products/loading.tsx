export default function ProductsLoading() {
  return (
    <main
      className="mx-auto w-full max-w-[98rem] px-4 py-10 sm:px-6 md:px-8 lg:px-10 xl:px-12"
      aria-busy="true"
    >
      <div className="h-10 w-48 animate-pulse rounded-full bg-neutral-200" />
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-3xl bg-white shadow-[0_10px_22px_rgba(15,23,42,0.06)]" />
        ))}
      </div>
    </main>
  );
}
