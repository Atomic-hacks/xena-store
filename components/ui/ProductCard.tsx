"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Heart, ShoppingCart, Star, Zap, Shield, RotateCcw } from 'lucide-react';

interface ProductSpec {
  key: string;
  value: string;
}

interface ProductDetails {
  title: string;
  price: string;
  categories: string[];
  imageUrl: string;
  description: string;
  specs: ProductSpec[];
  rating: number;
  reviewCount: number;
  availableColors?: string[];
  availableSizes?: string[];
}

interface ProductCardProps {
  title: string;
  price: string;
  categories: string[];
  imageUrl: string;
  productDetails: ProductDetails;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  categories,
  imageUrl,
  productDetails,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <motion.div
        className="w-full h-[300px] rounded-lg overflow-hidden relative bg-gray-900"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={{
            filter: isHovered
              ? "blur(3px) brightness(0.7)"
              : "blur(0px) brightness(1)",
          }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </motion.div>

        {/* Product Info - This will animate upwards */}
        <motion.div
          className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-between text-white"
          animate={{
            bottom: isHovered ? "80px" : "0px",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">{title}</h3>
            <div className="flex gap-2 opacity-70">
              {categories.map((category, index) => (
                <span key={index} className="text-sm">
                  {index > 0 ? " • " : ""}
                  {category}
                </span>
              ))}
            </div>
            <div className="text-xl font-medium">{price}</div>
          </div>
        </motion.div>

        {/* Buttons positioned below the product info */}
        <motion.div
          className="absolute bottom-4 left-0 p-4 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
        >
          <motion.button
            className="px-4 py-2 text-sm bg-white text-black font-medium rounded-md hover:bg-gray-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreview(true)}
          >
            Preview
          </motion.button>
          <motion.button
            className="px-4 text-sm py-2 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDetails(true)}
          >
            Details
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Quick Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        product={productDetails}
        openDetails={() => {
          setShowPreview(false);
          setShowDetails(true);
        }}
      />

      {/* Detailed Product Modal */}
      <DetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        product={productDetails}
      />
    </>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetails;
}

const PreviewModal: React.FC<ModalProps & { openDetails: () => void }> = ({
  isOpen,
  onClose,
  product,
  openDetails,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-neutral-950/80 rounded-xl overflow-hidden w-full max-w-md md:max-w-2xl mx-auto my-4"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex md:flex-row flex-col w-full max-h-[90vh]">
              {/* Close button - floating for better mobile UX */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 bg-black/50 rounded-full p-2 text-neutral-300 hover:text-neutral-100 transition-colors duration-200"
              >
                <X size={20} />
              </button>

              {/* Image side */}
              <div className="relative w-full ">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="bg-gray-900"
                />
              </div>

              {/* Content side */}
              <div className="p-5 flex flex-col overflow-y-auto">
                <h2 className="text-xl font-bold text-neutral-100 mb-4">{product.title}</h2>

                <div className="flex items-center mb-2">
                  <div className="flex items-center text-amber-500">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                        className={i < Math.floor(product.rating) ? "text-amber-500" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-400 ml-2">
                    ({product.reviewCount} reviews)
                  </span>
                </div>

                <div className="text-2xl font-bold text-neutral-300 mb-4">
                  {product.price}
                </div>

                <div className="text-neutral-200 mb-6 line-clamp-3">
                  {product.description}
                </div>

                <div className="mt-auto flex gap-3">
                  <motion.button
                    className="flex-1 bg-gradient-to-r from-emerald-950 via-emerald-400 to-emerald-900 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </motion.button>
                  <motion.button
                    className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300"
                    whileHover={{ scale: 1.05, borderColor: "#9CA3AF" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart size={20} className="text-gray-400" />
                  </motion.button>
                </div>

                <motion.button
                  onClick={openDetails}
                  className="text-neutral-200 text-sm font-medium mt-4 hover:text-emerald-400 transition-colors duration-200 w-full text-center"
                  whileHover={{ scale: 1.01 }}
                >
                  View full details
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DetailsModal: React.FC<ModalProps> = ({ isOpen, onClose, product }) => {
  const [selectedColor, setSelectedColor] = useState(product.availableColors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const features = [
    { icon: <Zap size={20} className="text-emerald-500" />, text: "Fast Delivery" },
    { icon: <Shield size={20} className="text-emerald-500" />, text: "1 Year Warranty" },
    { icon: <RotateCcw size={20} className="text-emerald-500" />, text: "30 Days Return" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-neutral-950/80 rounded-xl overflow-hidden w-full max-w-lg md:max-w-4xl mx-auto my-4"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row max-h-[90vh] overflow-y-auto no-scrollbar">
              {/* Image section */}
              <div className="w-full md:w-5/12 bg-neutral-900 p-4">
                {/* Close button - floating for better mobile UX */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 z-10 bg-black/50 rounded-full p-2 text-neutral-300 hover:text-neutral-100 transition-colors duration-200 md:hidden"
                >
                  <X size={20} />
                </button>

                <div className="relative w-full h-60 md:h-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    style={{ objectFit: "contain" }}
                    className="bg-neutral-950/50 rounded-lg"
                  />
                </div>
                
                {/* Features */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={index} 
                      className="flex flex-col items-center text-center p-2"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="bg-emerald-950/50 rounded-full p-2 mb-2">
                        {feature.icon}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-neutral-300">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Content section */}
              <div className="p-4 sm:p-6 w-full md:w-7/12">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {product.categories.map((category, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-neutral-800 text-neutral-300 rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-neutral-100 mb-1">{product.title}</h1>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center text-amber-500">
                        {Array(5).fill(0).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                            className={i < Math.floor(product.rating) ? "text-amber-500" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-neutral-400 ml-2">
                        ({product.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="text-neutral-300 hover:text-neutral-100 transition duration-200 hidden md:block"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="text-2xl sm:text-3xl font-bold text-neutral-300 mb-6">
                  {product.price}
                </div>

                {/* Tabs */}
                <div className="mb-6">
                  <div className="flex border-b border-neutral-800">
                    <motion.button
                      className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'description' ? 'text-emerald-400' : 'text-neutral-400'}`}
                      onClick={() => setActiveTab('description')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Description
                      {activeTab === 'description' && (
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" 
                          layoutId="activeTab"
                        />
                      )}
                    </motion.button>
                    <motion.button
                      className={`px-4 py-2 font-medium text-sm relative ${activeTab === 'specifications' ? 'text-emerald-400' : 'text-neutral-400'}`}
                      onClick={() => setActiveTab('specifications')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Specifications
                      {activeTab === 'specifications' && (
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" 
                          layoutId="activeTab"
                        />
                      )}
                    </motion.button>
                  </div>

                  <div className="py-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {activeTab === 'description' ? (
                          <p className="text-neutral-300 max-h-32 overflow-y-auto">{product.description}</p>
                        ) : (
                          <div className="grid grid-cols-1 gap-y-2 max-h-32 overflow-y-auto">
                            {product.specs.map((spec, index) => (
                              <div key={index} className="grid grid-cols-2">
                                <div className="text-sm font-medium text-neutral-400">{spec.key}</div>
                                <div className="text-sm text-neutral-300">{spec.value}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Options */}
                {product.availableColors?.length && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-neutral-200 mb-2">Color</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.availableColors.map((color) => (
                        <motion.button
                          key={color}
                          className={`w-8 h-8 rounded-full ${
                            selectedColor === color ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-neutral-900' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {product.availableSizes?.length && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-neutral-200 mb-2">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.availableSizes.map((size) => (
                        <motion.button
                          key={size}
                          className={`w-10 h-10 rounded-md flex items-center justify-center ${
                            selectedSize === size
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                          onClick={() => setSelectedSize(size)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-neutral-200 mb-2">Quantity</h3>
                  <div className="flex items-center border border-neutral-700 rounded-md w-32">
                    <motion.button
                      className="w-10 h-10 flex items-center justify-center text-neutral-300 hover:bg-neutral-800"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      whileHover={{ backgroundColor: "#1F2937" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      -
                    </motion.button>
                    <div className="flex-1 text-center font-medium text-neutral-200">{quantity}</div>
                    <motion.button
                      className="w-10 h-10 flex items-center justify-center text-neutral-300 hover:bg-neutral-800"
                      onClick={() => setQuantity(prev => prev + 1)}
                      whileHover={{ backgroundColor: "#1F2937" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      +
                    </motion.button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <motion.button
                    className="flex-1 bg-gradient-to-r from-emerald-950 via-emerald-400 to-emerald-900 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(16, 185, 129, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </motion.button>
                  <motion.button
                    className="w-12 h-12 flex items-center justify-center rounded-lg border border-neutral-700"
                    whileHover={{ scale: 1.05, borderColor: "#9CA3AF" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Heart size={20} className="text-neutral-400" />
                  </motion.button>
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