/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Product } from "./ProductCard";

// Cart Item interface
export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

// Cart Context interface
interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  favoriteItems: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: Product) => void;
  isInCart: (productId: string) => boolean;
  isFavorite: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider Props
interface CartProviderProps {
  children: React.ReactNode;
}

// Cart Provider Component
const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setItems(JSON.parse(storedCartItems).map((item:any) => ({ ...item, addedAt: new Date(item.addedAt) })));
    }
    const storedFavoriteItems = localStorage.getItem("favoriteItems");
    if (storedFavoriteItems) {
      setFavoriteItems(JSON.parse(storedFavoriteItems));
    }
  }, []);

  // Save cart data to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  // Save favorites data to localStorage whenever favoriteItems change
  useEffect(() => {
    localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const addToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      setItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex((item) => item.product.id === product.id);

        if (existingItemIndex !== -1) {
          const newItems = [...prevItems];
          newItems[existingItemIndex].quantity += quantity;
          return newItems;
        } else {
          return [...prevItems, { product, quantity, addedAt: new Date() }];
        }
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleFavorite = useCallback((product: Product) => {
    setFavoriteItems((prevFavoriteItems) => {
      if (prevFavoriteItems.find((item) => item.id === product.id)) {
        return prevFavoriteItems.filter((item) => item.id !== product.id);
      } else {
        return [...prevFavoriteItems, product];
      }
    });
  }, []);

  const isInCart = useCallback((productId: string) => {
    return items.some((item) => item.product.id === productId);
  }, [items]);

  const isFavorite = useCallback((productId: string) => {
    return favoriteItems.some((item) => item.id === productId);
  }, [favoriteItems]);

  const getCartItem = useCallback((productId: string) => {
    return items.find((item) => item.product.id === productId);
  }, [items]);


  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    favoriteItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleFavorite,
    isInCart,
    isFavorite,
    getCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use Cart Context
const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
