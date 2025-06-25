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

  // Improved responsive size configurations with better height management
  const sizeClasses = {
    sm: "w-full max-w-xs h-[420px] sm:h-[480px]",
    md: "w-full max-w-sm h-[480px] sm:h-[520px] lg:h-[540px]",
    lg: "w-full max-w-md h-[520px] sm:h-[560px] lg:h-[580px]",
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

          {/* Product Image Section - Better height distribution */}
          <div className="relative w-full h-[60%] sm:h-[65%] overflow-hidden">
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

            {/* Floating Status Indicators - Better mobile positioning */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 sm:gap-2">
              {featured && (
                <motion.div
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-black/70 backdrop-blur-md border border-fuchsia-500/40 text-fuchsia-300 text-[10px] sm:text-xs font-medium rounded-full flex items-center gap-1"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Zap size={10} className="sm:w-3 sm:h-3" />
                  <span>Featured</span>
                </motion.div>
              )}
              {hasDiscount && (
                <motion.div
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-black/70 backdrop-blur-md border border-fuchsia-500/40 text-fuchsia-300 text-[10px] sm:text-xs font-medium rounded-full"
                  initial={{ scale: 0, rotate: 10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  -{discountPercent}%
                </motion.div>
              )}
            </div>

            {/* Interactive Action Buttons - Always visible on mobile, hover on desktop */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-2">
              {/* Mobile: Always show, Desktop: Show on hover */}
              <AnimatePresence>
                {(showActions || window.innerWidth < 640) && (
                  <motion.div
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, staggerChildren: 0.05 }}
                  >
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite?.(product);
                      }}
                      className="w-9 h-9 sm:w-10 sm:h-10 bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl flex items-center justify-center text-white/80 hover:text-fuchsia-400 hover:border-fuchsia-500/40 hover:bg-black/70 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Heart size={14} className="sm:w-4 sm:h-4" />
                    </motion.button>

                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowQuickView(true);
                      }}
                      className="w-9 h-9 sm:w-10 sm:h-10 bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl flex items-center justify-center text-white/80 hover:text-fuchsia-400 hover:border-fuchsia-500/40 hover:bg-black/70 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <Eye size={14} className="sm:w-4 sm:h-4" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stock Status Overlay */}
            {!inStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-black/80 backdrop-blur-md border border-white/20 px-4 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl">
                  <span className="text-white/90 font-medium text-xs sm:text-sm">
                    Out of Stock
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Product Info Section - Better height and spacing management */}
          <div className="relative h-[40%] sm:h-[35%] p-4 sm:p-5 lg:p-6 flex flex-col">
            {/* Info Background */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Top Section - Category and Name */}
              <div className="flex-shrink-0 mb-2 sm:mb-3">
                {displayCategory && (
                  <p className="text-[10px] sm:text-xs text-white/60 mb-1 sm:mb-1.5 font-medium tracking-wider uppercase truncate">
                    {displayCategory}
                  </p>
                )}
                <h3 className="font-semibold text-white text-sm sm:text-base lg:text-lg leading-tight mb-1.5 sm:mb-2 line-clamp-2">
                  {name}
                </h3>

                {/* Rating - More compact */}
                {rating > 0 && (
                  <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={`sm:w-3 sm:h-3 ${
                            i < Math.floor(rating)
                              ? "fill-fuchsia-400 text-fuchsia-400"
                              : "text-white/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-white/60 font-medium">
                      ({reviewCount})
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Section - Price and Cart - Push to bottom */}
              <div className="flex items-end justify-between mt-auto">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-white text-lg sm:text-xl lg:text-2xl">
                      ${price.toFixed(2)}
                    </span>
                    {hasDiscount && originalPrice && (
                      <span className="text-xs sm:text-sm text-white/50 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {/* Stock info for mobile */}
                  {inStock &&
                    product.stockQuantity &&
                    product.stockQuantity <= 10 && (
                      <span className="text-[10px] sm:text-xs text-fuchsia-400 font-medium">
                        Only {product.stockQuantity} left
                      </span>
                    )}
                </div>

                {/* Interactive Add to Cart - Better mobile sizing */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (inStock) onAddToCart?.(product);
                  }}
                  className={`
                    relative overflow-hidden w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all duration-300 flex-shrink-0
                    ${
                      inStock
                        ? "bg-fuchsia-500/25 border-fuchsia-500/50 text-fuchsia-300 hover:bg-fuchsia-500/35 hover:border-fuchsia-400/70 hover:shadow-lg hover:shadow-fuchsia-500/30"
                        : "bg-white/10 border-white/20 text-white/40 cursor-not-allowed"
                    }
                  `}
                  whileHover={inStock ? { scale: 1.05 } : {}}
                  whileTap={inStock ? { scale: 0.95 } : {}}
                  disabled={!inStock}
                >
                  {/* Ripple effect */}
                  {inStock && (
                    <motion.div
                      className="absolute inset-0 bg-fuchsia-400/25 rounded-xl sm:rounded-2xl"
                      initial={{ scale: 0, opacity: 1 }}
                      whileHover={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                  <ShoppingCart
                    size={16}
                    className="relative z-10 sm:w-5 sm:h-5"
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

// Quick View Modal Component - Improved mobile layout
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
          className="fixed inset-0 bg-black/85 backdrop-blur-2xl flex items-center justify-center z-50 p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-black/70 backdrop-blur-3xl border border-white/15 rounded-2xl sm:rounded-3xl overflow-hidden w-full max-w-sm sm:max-w-4xl max-h-[95vh] shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle fuchsia glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/8 via-transparent to-fuchsia-500/12" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/25 rounded-xl sm:rounded-2xl flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>

            <div className="flex flex-col lg:flex-row max-h-[95vh]">
              {/* Image Section */}
              <div className="relative w-full lg:w-1/2 h-72 sm:h-80 lg:h-[600px]">
                <img
                  src={mainImage}
                  alt={images[0]?.alt || name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/25" />

                {/* Status badges */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-2">
                  {hasDiscount && (
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black/70 backdrop-blur-md border border-fuchsia-500/40 text-fuchsia-300 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium">
                      -{discountPercent}% OFF
                    </span>
                  )}
                  {!inStock && (
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black/70 backdrop-blur-md border border-white/25 text-white/80 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section - Better mobile scrolling */}
              <div className="relative w-full lg:w-1/2 flex flex-col overflow-hidden">
                <div className="p-5 sm:p-6 lg:p-8 overflow-y-auto flex-1">
                  {/* Category */}
                  {displayCategory && (
                    <span className="text-xs sm:text-sm text-white/60 mb-2 sm:mb-3 font-medium tracking-wider uppercase block">
                      {displayCategory}
                    </span>
                  )}

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                    {name}
                  </h2>

                  {/* Rating */}
                  {rating > 0 && (
                    <div className="flex items-center gap-3 mb-4 sm:mb-5">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`sm:w-4 sm:h-4 ${
                              i < Math.floor(rating)
                                ? "fill-fuchsia-400 text-fuchsia-400"
                                : "text-white/25"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm sm:text-base text-white/70">
                        {rating} ({reviewCount} reviews)
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-5 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        ${price.toFixed(2)}
                      </span>
                      {hasDiscount && originalPrice && (
                        <span className="text-lg sm:text-xl text-white/50 line-through">
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

                  {/* Description */}
                  <p className="text-sm sm:text-base text-white/75 mb-5 sm:mb-6 leading-relaxed">
                    {description}
                  </p>

                  {/* Specifications */}
                  {specifications.length > 0 && (
                    <div className="mb-5 sm:mb-6">
                      <h4 className="font-semibold text-white mb-3 text-sm sm:text-base">
                        Specifications
                      </h4>
                      <div className="space-y-2 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/15">
                        {specifications.slice(0, 4).map((spec, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-1"
                          >
                            <span className="text-white/70 text-sm">
                              {spec.key}:
                            </span>
                            <span className="text-white font-medium text-sm">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  {inStock && (
                    <div className="mb-6">
                      <span className="text-white/70 text-sm mb-3 block">
                        Quantity
                      </span>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/25 rounded-xl flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-white font-medium w-12 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-10 bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/25 rounded-xl flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions - Fixed at bottom */}
                <div className="p-5 sm:p-6 lg:p-8 pt-0 border-t border-white/10 bg-black/20 backdrop-blur-xl">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <motion.button
                      onClick={() => inStock && onAddToCart?.(product)}
                      className={`
                        flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 backdrop-blur-xl border
                        ${
                          inStock
                            ? "bg-fuchsia-500/25 border-fuchsia-500/50 text-fuchsia-300 hover:bg-fuchsia-500/35 hover:border-fuchsia-400/70 hover:shadow-lg hover:shadow-fuchsia-500/25"
                            : "bg-white/10 border-white/20 text-white/50 cursor-not-allowed"
                        }
                      `}
                      disabled={!inStock}
                      whileHover={inStock ? { scale: 1.02 } : {}}
                      whileTap={inStock ? { scale: 0.98 } : {}}
                    >
                      <ShoppingCart size={18} />
                      {inStock ? "Add to Cart" : "Out of Stock"}
                    </motion.button>

                    <motion.button
                      onClick={() => onToggleFavorite?.(product)}
                      className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 hover:border-fuchsia-500/50 hover:bg-white/25 transition-all duration-300 flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart
                        size={18}
                        className="text-white/80 hover:text-fuchsia-400"
                      />
                    </motion.button>
                  </div>

                  {/* View Details */}
                  {onViewDetails && (
                    <button
                      onClick={() => {
                        onViewDetails(product);
                        onClose();
                      }}
                      className="text-center text-fuchsia-400 hover:text-fuchsia-300 font-medium mt-4 transition-colors duration-300 text-sm w-full"
                    >
                      View Full Details →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductCard;
