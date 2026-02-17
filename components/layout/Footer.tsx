import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-4 px-4 py-8 text-sm text-white/65 md:flex-row md:items-center md:justify-between md:px-7 lg:px-10">
        <p>© {new Date().getFullYear()} Xena Store. Premium gadgets and gaming gear.</p>
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
