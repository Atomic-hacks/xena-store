import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center gap-4 px-4 text-center md:px-8">
      <p className="text-sm uppercase tracking-wide text-white/60">404</p>
      <h1 className="text-3xl font-bold text-white">Page not found</h1>
      <p className="max-w-md text-white/70">The page you requested does not exist or was moved.</p>
      <Link href="/" className="rounded-xl border border-white/25 bg-white px-4 py-2 text-black transition hover:bg-white/85">
        Back home
      </Link>
    </main>
  );
}
