"use client";
import React from "react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Horizontal Layout */}
      <div className="hidden md:block">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                relative px-6 py-3 rounded-2xl font-medium whitespace-nowrap transition-all duration-300 backdrop-blur-xl border
                ${
                  selectedCategory === category.id
                    ? "bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300 shadow-lg shadow-fuchsia-500/10"
                    : "bg-black/40 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white"
                }
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active indicator */}
              {selectedCategory === category.id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-fuchsia-500/5 rounded-2xl"
                  layoutId="activeCategory"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2">
                {category.name}
                <span
                  className={`
                  text-xs px-2 py-1 rounded-full
                  ${
                    selectedCategory === category.id
                      ? "bg-fuchsia-400/20 text-fuchsia-200"
                      : "bg-white/10 text-white/50"
                  }
                `}
                >
                  {category.count}
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mobile Vertical Layout */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                relative p-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-xl border text-center
                ${
                  selectedCategory === category.id
                    ? "bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300 shadow-lg shadow-fuchsia-500/10"
                    : "bg-black/40 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white"
                }
              `}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active indicator */}
              {selectedCategory === category.id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-500/5 rounded-2xl"
                  layoutId="activeCategoryMobile"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                />
              )}

              <div className="relative z-10">
                <div className="text-sm font-semibold mb-1">
                  {category.name}
                </div>
                <div
                  className={`
                  text-xs px-2 py-1 rounded-full inline-block
                  ${
                    selectedCategory === category.id
                      ? "bg-fuchsia-400/20 text-fuchsia-200"
                      : "bg-white/10 text-white/50"
                  }
                `}
                >
                  {category.count} items
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
