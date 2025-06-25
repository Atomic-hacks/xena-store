"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  X,
  Zap,
  Plus,
  Minus,
} from "lucide-react";

// Types
export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: ProductImage[];
  inStock?: boolean;
  category?: string;
  brand?: string;
  featured?: boolean;
  description?: string;
  specifications?: ProductSpec[];
  stockQuantity?: number;
  slug?: string;
  rating?: number;
  reviewCount?: number;
}

// Product Card Props
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Main Product Card Component
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
  className = "",
  size = "md",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [, setImageLoaded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Responsive size configurations
  const sizeClasses = {
    sm: "w-full max-w-xs h-80 sm:h-96",
    md: "w-full max-w-sm h-96 sm:h-[450px]",
    lg: "w-full max-w-md h-[450px] sm:h-[500px]",
  };

  // Safe property access
  const {
    name = "Product Name",
    price = 0,
    originalPrice,
    images = [],
    inStock = true,
    category,
    brand,
    featured = false,
    rating = 0,
    reviewCount = 0,
  } = product;

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const mainImage = images[0]?.url || "/api/placeholder/400/500";
  const displayCategory = [category, brand].filter(Boolean).join(" • ");

  return (
    <>
      <motion.div
        className={`
          group relative ${sizeClasses[size]} cursor-pointer mx-auto
          ${className}
        `}
        onHoverStart={() => {
          setIsHovered(true);
          setShowActions(true);
        }}
        onHoverEnd={() => {
          setIsHovered(false);
          setShowActions(false);
        }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Main Card Container */}
        <div className="relative w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl">
          {/* Base Black Glass Background */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]" />

          {/* Interactive Border */}
          <div className="absolute inset-[1px] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl" />

          {/* Fuchsia Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(217, 70, 239, 0.1) 0%, transparent 50%, rgba(217, 70, 239, 0.05) 100%)",
              boxShadow: "0 0 40px rgba(217, 70, 239, 0.1)",
            }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1.02 : 1,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Product Image Section - Responsive height */}
          <div className="relative w-full h-[65%] sm:h-[70%] overflow-hidden">
            {/* Image Container */}
            <motion.div
              className="relative w-full h-full"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src={mainImage}
                alt={images[0]?.alt || name}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
              />

              {/* Subtle overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
            </motion.div>

            {/* Floating Status Indicators - Responsive positioning */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2">
              {featured && (
                <motion.div
                  className="px-2 py-1 sm:px-3 sm:py-1 bg-black/60 backdrop-blur-md border border-fuchsia-500/30 text-fuchsia-300 text-xs font-medium rounded-full flex items-center gap-1"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Zap size={8} className="sm:w-[10px] sm:h-[10px]" />
                  <span className="hidden sm:inline">Featured</span>
                  <span className="sm:hidden">★</span>
                </motion.div>
              )}
              {hasDiscount && (
                <motion.div
                  className="px-2 py-1 sm:px-3 sm:py-1 bg-black/60 backdrop-blur-md border border-fuchsia-500/30 text-fuchsia-300 text-xs font-medium rounded-full"
                  initial={{ scale: 0, rotate: 10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  -{discountPercent}%
                </motion.div>
              )}
            </div>

            {/* Interactive Action Buttons - Responsive sizing */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col gap-2 sm:gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, staggerChildren: 0.1 }}
                >
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite?.(product);
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-white/70 hover:text-fuchsia-400 hover:border-fuchsia-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Heart size={12} className="sm:w-[14px] sm:h-[14px]" />
                  </motion.button>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuickView(true);
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-white/70 hover:text-fuchsia-400 hover:border-fuchsia-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Eye size={12} className="sm:w-[14px] sm:h-[14px]" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stock Status Overlay */}
            {!inStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-black/80 backdrop-blur-md border border-white/20 px-3 py-2 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl">
                  <span className="text-white/80 font-medium text-xs sm:text-sm">
                    Out of Stock
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Product Info Section - Responsive height and padding */}
          <div className="relative h-[35%] sm:h-[30%] p-3 sm:p-6 flex flex-col justify-between">
            {/* Info Background */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            <div className="relative z-10 flex-1 flex flex-col justify-between min-h-0">
              {/* Top Section - Category and Name */}
              <div className="flex-shrink-0">
                {displayCategory && (
                  <p className="text-xs text-white/50 mb-1 font-medium tracking-wider uppercase truncate">
                    {displayCategory}
                  </p>
                )}
                <h3 className="font-semibold text-white text-sm sm:text-lg leading-tight mb-1 sm:mb-2 line-clamp-2 overflow-hidden">
                  {name}
                </h3>

                {/* Rating - Compact and responsive */}
                {rating > 0 && (
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={8}
                          className={`sm:w-[10px] sm:h-[10px] ${
                            i < Math.floor(rating)
                              ? "fill-fuchsia-400 text-fuchsia-400"
                              : "text-white/20"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-white/50">
                      ({reviewCount})
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Section - Price and Cart */}
              <div className="flex items-center justify-between flex-shrink-0 mt-auto">
                <div className="flex items-baseline gap-1 sm:gap-2 min-w-0 flex-1">
                  <span className="font-bold text-white text-lg sm:text-xl truncate">
                    ${price.toFixed(2)}
                  </span>
                  {hasDiscount && originalPrice && (
                    <span className="text-xs sm:text-sm text-white/40 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Interactive Add to Cart - Responsive sizing */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (inStock) onAddToCart?.(product);
                  }}
                  className={`
                    relative overflow-hidden w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all duration-300 flex-shrink-0
                    ${
                      inStock
                        ? "bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-500/30 hover:border-fuchsia-400/60 hover:shadow-lg hover:shadow-fuchsia-500/25"
                        : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
                    }
                  `}
                  whileHover={inStock ? { scale: 1.05 } : {}}
                  whileTap={inStock ? { scale: 0.95 } : {}}
                  disabled={!inStock}
                >
                  {/* Ripple effect */}
                  {inStock && (
                    <motion.div
                      className="absolute inset-0 bg-fuchsia-400/20 rounded-xl sm:rounded-2xl"
                      initial={{ scale: 0, opacity: 1 }}
                      whileHover={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                  <ShoppingCart
                    size={14}
                    className="relative z-10 sm:w-4 sm:h-4"
                  />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Subtle ambient glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-fuchsia-500/5 via-transparent to-fuchsia-500/5 opacity-0 pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        product={product}
        onAddToCart={onAddToCart}
        onToggleFavorite={onToggleFavorite}
        onViewDetails={onViewDetails}
      />
    </>
  );
};

// Quick View Modal Component - Updated for better responsiveness
interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
}) => {
  const [quantity, setQuantity] = useState(1);

  const {
    name = "Product Name",
    price = 0,
    originalPrice,
    images = [],
    inStock = true,
    category,
    brand,
    description = "No description available.",
    specifications = [],
    stockQuantity,
    rating = 0,
    reviewCount = 0,
  } = product;

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const mainImage = images[0]?.url || "/api/placeholder/400/500";
  const displayCategory = [category, brand].filter(Boolean).join(" • ");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden w-full max-w-xs sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle fuchsia glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-transparent to-fuchsia-500/10" />

            {/* Close Button - Responsive positioning */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 sm:right-6 sm:top-6 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
            >
              <X size={16} className="sm:w-5 sm:h-5" />
            </button>

            <div className="flex flex-col lg:flex-row max-h-[95vh] sm:max-h-[90vh]">
              {/* Image Section - Responsive height */}
              <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-[600px]">
                <img
                  src={mainImage}
                  alt={images[0]?.alt || name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

                {/* Status badges - Responsive positioning */}
                <div className="absolute top-3 left-3 sm:top-6 sm:left-6 flex flex-col gap-2">
                  {hasDiscount && (
                    <span className="px-3 py-1 sm:px-4 sm:py-2 bg-black/60 backdrop-blur-md border border-fuchsia-500/30 text-fuchsia-300 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium">
                      -{discountPercent}% OFF
                    </span>
                  )}
                  {!inStock && (
                    <span className="px-3 py-1 sm:px-4 sm:py-2 bg-black/60 backdrop-blur-md border border-white/20 text-white/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section - Responsive padding and scrolling */}
              <div className="relative w-full lg:w-1/2 p-4 sm:p-8 flex flex-col overflow-y-auto">
                {/* Category */}
                {displayCategory && (
                  <span className="text-xs sm:text-sm text-white/50 mb-2 sm:mb-3 font-medium tracking-wider uppercase">
                    {displayCategory}
                  </span>
                )}

                {/* Title - Responsive sizing */}
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  {name}
                </h2>

                {/* Rating - Responsive sizing */}
                {rating > 0 && (
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`sm:w-4 sm:h-4 ${
                            i < Math.floor(rating)
                              ? "fill-fuchsia-400 text-fuchsia-400"
                              : "text-white/20"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm sm:text-base text-white/60">
                      {rating} ({reviewCount} reviews)
                    </span>
                  </div>
                )}

                {/* Price - Responsive sizing */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      ${price.toFixed(2)}
                    </span>
                    {hasDiscount && originalPrice && (
                      <span className="text-lg sm:text-xl text-white/40 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {stockQuantity && stockQuantity <= 10 && inStock && (
                    <p className="text-fuchsia-400 text-sm mt-2 font-medium">
                      Only {stockQuantity} left in stock
                    </p>
                  )}
                </div>

                {/* Description - Responsive text */}
                <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6 leading-relaxed">
                  {description}
                </p>

                {/* Specifications - Responsive layout */}
                {specifications.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">
                      Specifications
                    </h4>
                    <div className="space-y-2 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                      {specifications.slice(0, 4).map((spec, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-1"
                        >
                          <span className="text-white/60 text-xs sm:text-sm">
                            {spec.key}:
                          </span>
                          <span className="text-white font-medium text-xs sm:text-sm">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector - Responsive sizing */}
                {inStock && (
                  <div className="mb-4 sm:mb-6">
                    <span className="text-white/70 text-sm mb-2 block">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
                      >
                        <Minus size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <span className="text-white font-medium w-8 sm:w-12 text-center text-sm sm:text-base">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
                      >
                        <Plus size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions - Responsive layout */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto">
                  <motion.button
                    onClick={() => inStock && onAddToCart?.(product)}
                    className={`
                      flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 font-semibold transition-all duration-300 backdrop-blur-xl border text-sm sm:text-base
                      ${
                        inStock
                          ? "bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-500/30 hover:border-fuchsia-400/60 hover:shadow-lg hover:shadow-fuchsia-500/20"
                          : "bg-white/5 border-white/10 text-white/40 cursor-not-allowed"
                      }
                    `}
                    disabled={!inStock}
                    whileHover={inStock ? { scale: 1.02 } : {}}
                    whileTap={inStock ? { scale: 0.98 } : {}}
                  >
                    <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                    {inStock ? "Add to Cart" : "Out of Stock"}
                  </motion.button>

                  <motion.button
                    onClick={() => onToggleFavorite?.(product)}
                    className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-fuchsia-500/40 hover:bg-white/20 transition-all duration-300 flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart
                      size={18}
                      className="sm:w-5 sm:h-5 text-white/70 hover:text-fuchsia-400"
                    />
                  </motion.button>
                </div>

                {/* View Details - Responsive text */}
                {onViewDetails && (
                  <button
                    onClick={() => {
                      onViewDetails(product);
                      onClose();
                    }}
                    className="text-center text-fuchsia-400 hover:text-fuchsia-300 font-medium mt-3 sm:mt-4 transition-colors duration-300 text-sm sm:text-base"
                  >
                    View Full Details →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductCard;
