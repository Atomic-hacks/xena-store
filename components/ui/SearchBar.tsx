"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <motion.div
        className={`
          relative flex items-center backdrop-blur-xl border rounded-2xl transition-all duration-300 overflow-hidden
          ${
            isFocused
              ? "bg-black/60 border-fuchsia-500/50 shadow-lg shadow-fuchsia-500/10"
              : "bg-black/40 border-white/20 hover:border-white/30"
          }
        `}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Search Icon */}
        <div className="flex items-center justify-center w-12 h-12">
          <motion.div
            animate={{
              color: isFocused ? "#d946ef" : "rgba(255, 255, 255, 0.5)",
            }}
            transition={{ duration: 0.2 }}
          >
            <Search size={18} />
          </motion.div>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 h-12 bg-transparent text-white placeholder-white/40 text-sm font-medium focus:outline-none pr-2"
        />

        {/* Clear Button */}
        <AnimatePresence>
          {value && (
            <motion.button
              onClick={handleClear}
              className="flex items-center justify-center w-10 h-10 mr-1 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Focus ring effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isFocused
              ? "0 0 0 3px rgba(217, 70, 239, 0.1)"
              : "0 0 0 0px rgba(217, 70, 239, 0)",
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Search suggestions or recent searches could go here */}
      <AnimatePresence>
        {isFocused && value.length > 0 && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              <p className="text-white/60 text-sm">
                Searching for &quot;{value}&quot;...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;