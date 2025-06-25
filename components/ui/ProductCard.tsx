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

  // Size configurations
  const sizeClasses = {
    sm: "w-72 h-96",
    md: "w-80 h-[450px]",
    lg: "w-96 h-[500px]",
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
          group relative ${sizeClasses[size]} cursor-pointer
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
        whileHover={{ y: -12 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Main Card Container */}
        <div className="relative w-full h-full overflow-hidden rounded-3xl">
          {/* Base Black Glass Background */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]" />

          {/* Interactive Border */}
          <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl" />

          {/* Fuchsia Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
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

          {/* Product Image Section - Takes 70% height */}
          <div className="relative w-full h-[70%] overflow-hidden">
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

            {/* Floating Status Indicators */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {featured && (
                <motion.div
                  className="px-3 py-1 bg-black/60 backdrop-blur-md border border-fuchsia-500/30 text-fuchsia-300 text-xs font-medium rounded-full flex items-center gap-1"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Zap size={10} />
                  Featured
                </motion.div>
              )}
              {hasDiscount && (
                <motion.div
                  className="px-3 py-1 bg-black/60 backdrop-blur-md border border-fuchsia-500/30 text-fuchsia-300 text-xs font-medium rounded-full"
                  initial={{ scale: 0, rotate: 10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  -{discountPercent}%
                </motion.div>
              )}
            </div>

            {/* Interactive Action Buttons */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  className="absolute top-4 right-4 flex flex-col gap-3"
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
                    className="w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center text-white/70 hover:text-fuchsia-400 hover:border-fuchsia-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Heart size={14} />
                  </motion.button>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuickView(true);
                    }}
                    className="w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center text-white/70 hover:text-fuchsia-400 hover:border-fuchsia-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Eye size={14} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stock Status Overlay */}
            {!inStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-black/80 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl">
                  <span className="text-white/80 font-medium text-sm">
                    Out of Stock
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Product Info Section - Takes 30% height */}
          <div className="relative h-[30%] p-6 flex flex-col justify-between">
            {/* Info Background */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            <div className="relative z-10 flex-1 flex flex-col justify-between">
              {/* Top Section - Category and Name */}
              <div>
                {displayCategory && (
                  <p className="text-xs text-white/50 mb-1 font-medium tracking-wider uppercase">
                    {displayCategory}
                  </p>
                )}
                <h3 className="font-semibold text-white text-lg leading-tight mb-2 line-clamp-1">
                  {name}
                </h3>

                {/* Rating - Compact */}
                {rating > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={
                            i < Math.floor(rating)
                              ? "fill-fuchsia-400 text-fuchsia-400"
                              : "text-white/20"
                          }
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
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-white text-xl">
                    ${price.toFixed(2)}
                  </span>
                  {hasDiscount && originalPrice && (
                    <span className="text-sm text-white/40 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Interactive Add to Cart */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (inStock) onAddToCart?.(product);
                  }}
                  className={`
                    relative overflow-hidden w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all duration-300
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
                      className="absolute inset-0 bg-fuchsia-400/20 rounded-2xl"
                      initial={{ scale: 0, opacity: 1 }}
                      whileHover={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                  <ShoppingCart size={16} className="relative z-10" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Subtle ambient glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-fuchsia-500/5 via-transparent to-fuchsia-500/5 opacity-0 pointer-events-none"
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

// Quick View Modal Component
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
          className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden w-full max-w-4xl max-h-[90vh] shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle fuchsia glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-transparent to-fuchsia-500/10" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-20 w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col lg:flex-row max-h-[90vh]">
              {/* Image Section */}
              <div className="relative lg:w-1/2 h-80 lg:h-[600px]">
                <img
                  src={mainImage}
                  alt={images[0]?.alt || name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

                {/* Status badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {hasDiscount && (
                    <span className="px-4 py-2 bg-black/60 backdrop-blur-md border border-fuchsia-500/30 text-fuchsia-300 rounded-2xl text-sm font-medium">
                      -{discountPercent}% OFF
                    </span>
                  )}
                  {!inStock && (
                    <span className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/20 text-white/70 rounded-2xl text-sm font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="relative lg:w-1/2 p-8 flex flex-col overflow-y-auto">
                {/* Category */}
                {displayCategory && (
                  <span className="text-sm text-white/50 mb-3 font-medium tracking-wider uppercase">
                    {displayCategory}
                  </span>
                )}

                {/* Title */}
                <h2 className="text-3xl font-bold text-white mb-4">{name}</h2>

                {/* Rating */}
                {rating > 0 && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(rating)
                              ? "fill-fuchsia-400 text-fuchsia-400"
                              : "text-white/20"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-white/60">
                      {rating} ({reviewCount} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-white">
                      ${price.toFixed(2)}
                    </span>
                    {hasDiscount && originalPrice && (
                      <span className="text-xl text-white/40 line-through">
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
                <p className="text-white/70 mb-6 leading-relaxed">
                  {description}
                </p>

                {/* Specifications */}
                {specifications.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-white mb-3">
                      Specifications
                    </h4>
                    <div className="space-y-2 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                      {specifications.slice(0, 4).map((spec, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-1"
                        >
                          <span className="text-white/60 text-sm">
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
                    <span className="text-white/70 text-sm mb-2 block">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-white font-medium w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 mt-auto">
                  <motion.button
                    onClick={() => inStock && onAddToCart?.(product)}
                    className={`
                      flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 backdrop-blur-xl border
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
                    <ShoppingCart size={20} />
                    {inStock ? "Add to Cart" : "Out of Stock"}
                  </motion.button>

                  <motion.button
                    onClick={() => onToggleFavorite?.(product)}
                    className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-fuchsia-500/40 hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart
                      size={20}
                      className="text-white/70 hover:text-fuchsia-400"
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
                    className="text-center text-fuchsia-400 hover:text-fuchsia-300 font-medium mt-4 transition-colors duration-300"
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
