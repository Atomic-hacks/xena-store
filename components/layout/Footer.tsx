import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      <div className="mx-auto flex w-full max-w-[98rem] flex-col gap-4 px-4 py-8 text-sm text-neutral-600 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10 xl:px-12">
        <p>© {new Date().getFullYear()} Xena Store. Premium gadgets and gaming gear.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/policies/shipping-returns" className="hover:text-neutral-900">
            Shipping & Returns
          </Link>
          <Link href="/policies/privacy" className="hover:text-neutral-900">
            Privacy
          </Link>
          <Link href="/policies/terms" className="hover:text-neutral-900">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
