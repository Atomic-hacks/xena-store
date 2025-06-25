export interface Product {
  originalPrice: boolean;
  id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
  // Add other fields relevant to your product
}

export type AddToCartHandler = (product: Product, quantity?: number) => void;
export type ToggleFavoriteHandler = (product: Product) => void;
export type ShareHandler = (product: Product) => void;