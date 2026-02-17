import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";
import { RouteProgress } from "@/components/ui/RouteProgress";

const azonix = localFont({
  src: "../public/fonts/Azonix.otf",
  variable: "--font-azonix",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Xena Store",
    template: "%s | Xena Store",
  },
  description: "Gadgets, gaming gear, and premium accessories.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${azonix.variable} min-h-screen antialiased`}>
        <Providers>
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
