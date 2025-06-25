"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3X3, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductCard, { Product } from "@/components/ui/ProductCard";
import CategoryBar from "@/components/ui/CategoryBar";
import SearchBar from "@/components/ui/SearchBar";
import { CartProvider, useCart } from "@/components/ui/CartContextProvider";

// Mock data - types and data in same file as requested
export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Mock categories
const mockCategories: Category[] = [
  { id: "all", name: "All", slug: "all", count: 24 },
  { id: "new", name: "New Releases", slug: "new-releases", count: 8 },
  { id: "used", name: "Used Devices", slug: "used-devices", count: 12 },
  {
    id: "impaired",
    name: "Devices with Impairments",
    slug: "impaired",
    count: 4,
  },
];

// Mock products
const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 999.99,
    originalPrice: 1199.99,
    images: [{ url: "/iphone.jpg", alt: "iPhone 15 Pro Max" }],
    inStock: true,
    category: "new",
    brand: "Apple",
    featured: true,
    description:
      "The most advanced iPhone yet with titanium design and A17 Pro chip.",
    specifications: [
      { key: "Storage", value: "256GB" },
      { key: "Display", value: "6.7-inch Super Retina XDR" },
      { key: "Camera", value: "48MP Main + 12MP Ultra Wide" },
      { key: "Chip", value: "A17 Pro" },
    ],
    stockQuantity: 15,
    rating: 4.8,
    reviewCount: 342,
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    price: 849.99,
    originalPrice: 1099.99,
    images: [{ url: "/samsung.jpg", alt: "Samsung Galaxy S24 Ultra" }],
    inStock: true,
    category: "new",
    brand: "Samsung",
    featured: true,
    description:
      "AI-powered smartphone with S Pen and advanced photography features.",
    specifications: [
      { key: "Storage", value: "512GB" },
      { key: "Display", value: "6.8-inch Dynamic AMOLED 2X" },
      { key: "Camera", value: "200MP Main + 50MP Periscope" },
      { key: "RAM", value: "12GB" },
    ],
    stockQuantity: 8,
    rating: 4.7,
    reviewCount: 198,
  },
  {
    id: "3",
    name: "MacBook Air M3",
    price: 1099.99,
    images: [{ url: "/macbookm3.jpg", alt: "MacBook Air M3" }],
    inStock: true,
    category: "new",
    brand: "Apple",
    description: "Incredibly thin and light laptop with M3 chip performance.",
    specifications: [
      { key: "Chip", value: "Apple M3" },
      { key: "Display", value: "13.6-inch Liquid Retina" },
      { key: "Memory", value: "8GB Unified Memory" },
      { key: "Storage", value: "256GB SSD" },
    ],
    stockQuantity: 12,
    rating: 4.9,
    reviewCount: 156,
  },
  {
    id: "4",
    name: "iPad Pro 11-inch (Used)",
    price: 649.99,
    originalPrice: 899.99,
    images: [{ url: "/Ipad3.jpg", alt: "iPad Pro 11-inch Used" }],
    inStock: true,
    category: "used",
    brand: "Apple",
    description:
      "Excellent condition iPad Pro with M2 chip. Minor wear on corners.",
    specifications: [
      { key: "Chip", value: "Apple M2" },
      { key: "Display", value: "11-inch Liquid Retina" },
      { key: "Storage", value: "128GB" },
      { key: "Condition", value: "Excellent" },
    ],
    stockQuantity: 3,
    rating: 4.5,
    reviewCount: 89,
  },
  {
    id: "5",
    name: "Surface Laptop 5 (Refurbished)",
    price: 799.99,
    originalPrice: 1299.99,
    images: [{ url: "/laptop.jpg", alt: "Surface Laptop 5" }],
    inStock: true,
    category: "used",
    brand: "Microsoft",
    description:
      "Professionally refurbished Surface Laptop with 12th Gen Intel Core i5.",
    specifications: [
      { key: "Processor", value: "Intel Core i5-1235U" },
      { key: "Display", value: "13.5-inch PixelSense" },
      { key: "RAM", value: "8GB LPDDR5x" },
      { key: "Storage", value: "256GB SSD" },
    ],
    stockQuantity: 5,
    rating: 4.3,
    reviewCount: 67,
  },
  {
    id: "6",
    name: "iPhone 13 (Screen Crack)",
    price: 399.99,
    originalPrice: 699.99,
    images: [{ url: "/iphone2.jpg", alt: "iPhone 13 with damage" }],
    inStock: true,
    category: "impaired",
    brand: "Apple",
    description:
      "iPhone 13 with cracked screen but fully functional. Great for parts or repair.",
    specifications: [
      { key: "Storage", value: "128GB" },
      { key: "Condition", value: "Screen Cracked" },
      { key: "Functionality", value: "Fully Working" },
      { key: "Battery Health", value: "89%" },
    ],
    stockQuantity: 2,
    rating: 3.8,
    reviewCount: 24,
  },
  {
    id: "7",
    name: "AirPods Pro 2nd Gen",
    price: 199.99,
    originalPrice: 249.99,
    images: [{ url: "/Headset3.jpg", alt: "AirPods Pro 2nd Gen" }],
    inStock: true,
    category: "new",
    brand: "Apple",
    featured: true,
    description:
      "Active Noise Cancellation with Adaptive Transparency and spatial audio.",
    specifications: [
      { key: "Chip", value: "H2" },
      { key: "Battery", value: "Up to 6 hours" },
      { key: "Case Battery", value: "Up to 30 hours" },
      { key: "Features", value: "Active Noise Cancellation" },
    ],
    stockQuantity: 25,
    rating: 4.6,
    reviewCount: 445,
  },
  {
    id: "8",
    name: "Dell XPS 13 (Used)",
    price: 699.99,
    originalPrice: 1099.99,
    images: [{ url: "/dell.jpg", alt: "Dell XPS 13 Used" }],
    inStock: true,
    category: "used",
    brand: "Dell",
    description:
      "Premium ultrabook in good condition. Shows minor signs of use.",
    specifications: [
      { key: "Processor", value: "Intel Core i7-1165G7" },
      { key: "RAM", value: "16GB LPDDR4x" },
      { key: "Storage", value: "512GB SSD" },
      { key: "Display", value: "13.3-inch FHD+" },
    ],
    stockQuantity: 4,
    rating: 4.4,
    reviewCount: 78,
  },
];

const ShopPageContent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("featured");
  const router = useRouter();

  const { addToCart, toggleFavorite } = useCart();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        // For demo, assume featured items are newest
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default: // featured
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleProductClick = (product: Product) => {
    // Navigate to product detail page using Next.js router
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-fuchsia-200 to-white bg-clip-text text-transparent">
            Shop
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Discover premium devices, from the latest releases to carefully
            curated pre-owned items.
          </p>
        </motion.div>

        {/* Search and Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search products..."
              />
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 text-white/80 text-sm focus:outline-none focus:border-fuchsia-500/50 focus:ring-2 focus:ring-fuchsia-500/20"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-fuchsia-500/20 text-fuchsia-300"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-fuchsia-500/20 text-fuchsia-300"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <CategoryBar
            categories={mockCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>

        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-white/60 text-sm">
            Showing {filteredProducts.length} products
            {selectedCategory !== "all" && (
              <span className="text-fuchsia-400 ml-1">
                in{" "}
                {
                  mockCategories.find((cat) => cat.id === selectedCategory)
                    ?.name
                }
              </span>
            )}
            {searchQuery && (
              <span className="text-fuchsia-400 ml-1">
                for &quot;{searchQuery}&quot;
              </span>
            )}
          </p>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key="products-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              className={`
                grid gap-8 mb-12
                ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1 lg:grid-cols-2"
                }
              `}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => handleProductClick(product)}
                  className="cursor-pointer"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                    onToggleFavorite={toggleFavorite}
                    onViewDetails={handleProductClick}
                    size={viewMode === "list" ? "lg" : "md"}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md mx-auto">
                <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No products found
                </h3>
                <p className="text-white/60 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-3 bg-fuchsia-500/20 border border-fuchsia-500/40 rounded-2xl text-fuchsia-300 hover:bg-fuchsia-500/30 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Main Shop Page Component with Cart Provider - Now as a proper Next.js page
const ShopPage: React.FC = () => {
  return (
    <CartProvider>
      <ShopPageContent />
    </CartProvider>
  );
};

export default ShopPage;