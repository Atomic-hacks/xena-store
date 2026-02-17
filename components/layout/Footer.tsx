import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/8 bg-black/40 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-white/70 md:flex-row md:items-center md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} Xena Store</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/policies/shipping-returns" className="hover:text-white">
            Shipping & Returns
          </Link>
          <Link href="/policies/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/policies/terms" className="hover:text-white">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
