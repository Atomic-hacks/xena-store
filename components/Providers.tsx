"use client";

import { ToastProvider } from "@/components/ui/ToastProvider";
import { CartProvider } from "@/components/ui/CartContextProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>{children}</CartProvider>
    </ToastProvider>
  );
}
