"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartPayload } from "@/lib/types";
import { logger } from "@/lib/logger";
import { useToast } from "@/components/ui/ToastProvider";

type CartContextValue = {
  cart: CartPayload | null;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

async function parseResponse(response: Response): Promise<CartPayload> {
  const body = (await response.json()) as CartPayload | { error: string };
  if (!response.ok || "error" in body) {
    throw new Error("error" in body ? body.error : "Cart request failed");
  }
  return body;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { notify } = useToast();

  const refreshCart = useCallback(async () => {
    logger.info("client.cart.fetch.start");
    const response = await fetch("/api/cart", { method: "GET", credentials: "include", cache: "no-store" });
    const payload = await parseResponse(response);
    setCart(payload);
    logger.info("client.cart.fetch.done", { cartId: payload.cartId });
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        await refreshCart();
      } catch {
        notify("Unable to load cart", "error");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [notify, refreshCart]);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      try {
        logger.info("client.cart.add.start", { productId });
        const response = await fetch("/api/cart/items", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });
        const payload = await parseResponse(response);
        setCart(payload);
        notify("Added to cart");
        logger.info("client.cart.add.done", { cartId: payload.cartId });
      } catch {
        notify("Unable to add item", "error");
      }
    },
    [notify]
  );

  const updateItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        logger.info("client.cart.update.start", { itemId });
        const response = await fetch(`/api/cart/items/${itemId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });
        const payload = await parseResponse(response);
        setCart(payload);
        logger.info("client.cart.update.done", { cartId: payload.cartId });
      } catch {
        notify("Unable to update quantity", "error");
      }
    },
    [notify]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        logger.info("client.cart.remove.start", { itemId });
        const response = await fetch(`/api/cart/items/${itemId}`, {
          method: "DELETE",
          credentials: "include",
        });
        const payload = await parseResponse(response);
        setCart(payload);
        notify("Removed from cart");
        logger.info("client.cart.remove.done", { cartId: payload.cartId });
      } catch {
        notify("Unable to remove item", "error");
      }
    },
    [notify]
  );

  const value = useMemo(
    () => ({
      cart,
      isLoading,
      refreshCart,
      addItem,
      updateItemQuantity,
      removeItem,
    }),
    [cart, isLoading, refreshCart, addItem, updateItemQuantity, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
