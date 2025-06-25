import type { Metadata } from "next";
import { Orbitron, Rajdhani, Titillium_Web } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


// Gaming-inspired fonts
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetBrainsMono = Titillium_Web({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Xena Store | Power Up Your Setup",
  description: "Your ultimate destination for gaming gadgets and gear.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${jetBrainsMono.variable}`}>
      <head>
        <title>{String(metadata.title) ?? "Xena Store"}</title>
        <meta name="description" content={metadata.description ?? ""} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body className="antialiased text-white">
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
