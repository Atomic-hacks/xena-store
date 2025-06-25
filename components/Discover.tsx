"use client";
import ProductCard from "@/components/ui/ProductCard";
import { FaArrowRight } from "react-icons/fa";

// Your existing ProductCard types (from paste-2.txt)
interface ProductCardImage {
  url: string;
  alt?: string;
}

interface ProductCardSpec {
  key: string;
  value: string;
}

interface ProductCardProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: ProductCardImage[];
  inStock?: boolean;
  category?: string;
  brand?: string;
  featured?: boolean;
  description?: string;
  specifications?: ProductCardSpec[];
  stockQuantity?: number;
  slug?: string;
  rating?: number;
  reviewCount?: number;
}

// Your existing Discover types
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

interface Product {
  title: string;
  price: string;
  categories: string[];
  imageUrl: string;
  productDetails: ProductDetails;
}

// Mapping function to convert your Product to ProductCard's expected format
const mapToProductCardFormat = (
  product: Product,
  index: number
): ProductCardProduct => {
  return {
    id: `product-${index}`, // Generate unique ID
    name: product.title,
    price: parseFloat(product.price.replace("$", "")), // Convert "$75" to 75
    images: [
      {
        url: product.imageUrl,
        alt: product.title,
      },
    ],
    inStock: true, // You can add this to your original Product interface if needed
    category: product.categories[0], // Use first category
    brand: product.categories[1], // Use second category as brand if available
    featured: false, // You can add this logic based on your needs
    description: product.productDetails.description,
    specifications: product.productDetails.specs,
    rating: product.productDetails.rating,
    reviewCount: product.productDetails.reviewCount,
    stockQuantity: 10, // Default value, you can make this dynamic
  };
};

// Define products array for different sections
const designProducts: Product[] = [
  {
    title: "DashFolio",
    price: "$75",
    categories: ["Templates", "Framer"],
    imageUrl: "/ipad5.jpg",
    productDetails: {
      title: "DashFolio",
      price: "$75",
      categories: ["Templates", "Framer"],
      imageUrl: "/ipad5.jpg",
      description:
        "Premium dashboard template built with Framer. Perfect for data visualization and admin interfaces with modern, clean aesthetics.",
      specs: [
        { key: "Framework", value: "Framer X" },
        { key: "Components", value: "50+" },
        { key: "Pages", value: "15" },
        { key: "Updates", value: "Lifetime" },
        { key: "Support", value: "6 months" },
      ],
      rating: 4.7,
      reviewCount: 128,
      availableColors: ["#3366FF", "#6E56CF", "#000000"],
    },
  },
  {
    title: "DesignSystem Pro",
    price: "$99",
    categories: ["UI Kit", "Design"],
    imageUrl: "/ipad6.jpg",
    productDetails: {
      title: "DesignSystem Pro",
      price: "$99",
      categories: ["UI Kit", "Design"],
      imageUrl: "/ipad6.jpg",
      description:
        "Complete design system with 1000+ components, styles, and templates. Perfect for designers and developers working on large-scale projects.",
      specs: [
        { key: "Components", value: "1000+" },
        { key: "File Formats", value: "Figma, Sketch, XD" },
        { key: "Templates", value: "50+" },
        { key: "Updates", value: "12 months" },
        { key: "License", value: "Commercial" },
      ],
      rating: 4.9,
      reviewCount: 256,
      availableColors: ["#3366FF", "#000000", "#FFFFFF"],
    },
  },
  {
    title: "Portfolio Plus",
    price: "$49",
    categories: ["Templates", "Personal"],
    imageUrl: "/iphone.jpg",
    productDetails: {
      title: "Portfolio Plus",
      price: "$49",
      categories: ["Templates", "Personal"],
      imageUrl: "/iphone.jpg",
      description:
        "Professional portfolio template for designers, developers, and creatives. Showcase your work with a modern, responsive layout.",
      specs: [
        { key: "Pages", value: "10" },
        { key: "Responsive", value: "Yes" },
        { key: "Animations", value: "Advanced" },
        { key: "CMS", value: "Built-in" },
        { key: "SEO", value: "Optimized" },
      ],
      rating: 4.5,
      reviewCount: 89,
      availableColors: ["#000000", "#FFFFFF", "#FF3366"],
    },
  },
];

const gamingSetups: Product[] = [
  {
    title: "Ultimate Battle Station",
    price: "$1299",
    categories: ["Gaming", "Desktop"],
    imageUrl: "/setup.jpg",
    productDetails: {
      title: "Ultimate Battle Station",
      price: "$1299",
      categories: ["Gaming", "Desktop"],
      imageUrl: "/setup.jpg",
      description:
        "Complete high-end gaming setup with RGB lighting, ergonomic features, and top-tier components. Designed for serious gamers and professionals.",
      specs: [
        { key: "Monitor", value: '27" 240Hz QHD' },
        { key: "Keyboard", value: "Mechanical RGB" },
        { key: "Mouse", value: "16K DPI Gaming" },
        { key: "Lighting", value: "Addressable RGB" },
        { key: "Chair", value: "Ergonomic Gaming" },
      ],
      rating: 4.8,
      reviewCount: 312,
      availableColors: ["#FF0000", "#00FF00", "#0000FF"],
    },
  },
  {
    title: "RGB Dream Setup",
    price: "$899",
    categories: ["Gaming", "RGB"],
    imageUrl: "/setup2.jpg",
    productDetails: {
      title: "RGB Dream Setup",
      price: "$899",
      categories: ["Gaming", "RGB"],
      imageUrl: "/setup2.jpg",
      description:
        "Immersive gaming environment with synchronized RGB lighting across all components. Create the perfect atmosphere for any game.",
      specs: [
        { key: "RGB Zones", value: "12+" },
        { key: "Sync", value: "Cross-platform" },
        { key: "Controls", value: "Software + Remote" },
        { key: "Effects", value: "200+" },
        { key: "Power", value: "120W" },
      ],
      rating: 4.6,
      reviewCount: 178,
      availableColors: ["#FF00FF", "#00FFFF", "#FFFF00"],
    },
  },
  {
    title: "Streamer Pro Bundle",
    price: "$1499",
    categories: ["Gaming", "Streaming"],
    imageUrl: "/setup3.jpg",
    productDetails: {
      title: "Streamer Pro Bundle",
      price: "$1499",
      categories: ["Gaming", "Streaming"],
      imageUrl: "/setup3.jpg",
      description:
        "Professional streaming setup with high-quality camera, microphone, lighting, and stream deck. Everything you need to start your streaming career.",
      specs: [
        { key: "Camera", value: "4K 60fps" },
        { key: "Microphone", value: "Studio Quality" },
        { key: "Lighting", value: "Key + Fill" },
        { key: "Stream Deck", value: "15-key" },
        { key: "Software", value: "Premium Suite" },
      ],
      rating: 4.9,
      reviewCount: 205,
      availableColors: ["#000000", "#FFFFFF"],
      availableSizes: ["Standard", "Deluxe"],
    },
  },
];

const codmStarterPacks: Product[] = [
  {
    title: "CODM Beginner Pack",
    price: "$29",
    categories: ["Mobile", "Starter"],
    imageUrl: "/ipad2.jpg",
    productDetails: {
      title: "CODM Beginner Pack",
      price: "$29",
      categories: ["Mobile", "Starter"],
      imageUrl: "/ipad2.jpg",
      description:
        "Essential starter pack for Call of Duty Mobile players. Includes weapon XP cards, credits, and exclusive skins to get your gameplay off to a strong start.",
      specs: [
        { key: "Credits", value: "2,000" },
        { key: "Weapon XP Cards", value: "100" },
        { key: "Exclusive Skins", value: "3" },
        { key: "Character", value: "1 Rare" },
        { key: "Battle Pass Points", value: "500" },
      ],
      rating: 4.3,
      reviewCount: 421,
      availableSizes: ["Basic", "Premium"],
    },
  },
  {
    title: "CODM Weapon Bundle",
    price: "$39",
    categories: ["Mobile", "Weapons"],
    imageUrl: "/ipad.jpg",
    productDetails: {
      title: "CODM Weapon Bundle",
      price: "$39",
      categories: ["Mobile", "Weapons"],
      imageUrl: "/ipad.jpg",
      description:
        "Advanced weapon bundle featuring legendary and epic weapon blueprints with unique kill effects and designs for CODM players.",
      specs: [
        { key: "Legendary Weapons", value: "1" },
        { key: "Epic Weapons", value: "3" },
        { key: "Custom Kill Effects", value: "Yes" },
        { key: "Weapon Charms", value: "5" },
        { key: "Skins", value: "Animated" },
      ],
      rating: 4.7,
      reviewCount: 289,
      availableColors: ["#FF0000", "#0000FF", "#FFFF00"],
    },
  },
  {
    title: "CODM Season Pass",
    price: "$25",
    categories: ["Mobile", "Battle Pass"],
    imageUrl: "/ipad33.jpg",
    productDetails: {
      title: "CODM Season Pass",
      price: "$25",
      categories: ["Mobile", "Battle Pass"],
      imageUrl: "/ipad33.jpg",
      description:
        "Premium Battle Pass for the current season of Call of Duty Mobile. Unlock exclusive rewards, skins, weapons, and more as you progress through tiers.",
      specs: [
        { key: "Premium Tiers", value: "50" },
        { key: "Character Skins", value: "4" },
        { key: "Weapon Blueprints", value: "5" },
        { key: "COD Points", value: "560" },
        { key: "Emotes & Sprays", value: "10+" },
      ],
      rating: 4.8,
      reviewCount: 532,
      availableSizes: ["Regular", "Premium Plus"],
    },
  },
];

const proGamerProducts: Product[] = [
  {
    title: "Pro Gaming Mouse",
    price: "$129",
    categories: ["Hardware", "Peripheral"],
    imageUrl: "/monitor.jpg",
    productDetails: {
      title: "Pro Gaming Mouse",
      price: "$129",
      categories: ["Hardware", "Peripheral"],
      imageUrl: "/monitor.jpg",
      description:
        "Precision gaming mouse with 25K DPI optical sensor, lightweight design, and programmable buttons. Used by professional esports players worldwide.",
      specs: [
        { key: "Sensor", value: "25K DPI Optical" },
        { key: "Weight", value: "67g" },
        { key: "Buttons", value: "8 Programmable" },
        { key: "Connection", value: "Wired/Wireless" },
        { key: "Battery Life", value: "70 hours" },
      ],
      rating: 4.9,
      reviewCount: 1245,
      availableColors: ["#000000", "#FFFFFF", "#FF0000"],
    },
  },
  {
    title: "Mechanical Keyboard Elite",
    price: "$189",
    categories: ["Hardware", "Peripheral"],
    imageUrl: "/Headset4.jpg",
    productDetails: {
      title: "Mechanical Keyboard Elite",
      price: "$189",
      categories: ["Hardware", "Peripheral"],
      imageUrl: "/Headset4.jpg",
      description:
        "Premium mechanical keyboard with hot-swappable switches, PBT keycaps, and customizable RGB lighting. Designed for competitive gaming and typing comfort.",
      specs: [
        { key: "Switches", value: "Hot-swappable" },
        { key: "Keycaps", value: "PBT Double-shot" },
        { key: "Lighting", value: "Per-key RGB" },
        { key: "Layout", value: "TKL/Full-size" },
        { key: "Polling Rate", value: "8000Hz" },
      ],
      rating: 4.8,
      reviewCount: 873,
      availableColors: ["#000000", "#808080", "#FFFFFF"],
      availableSizes: ["TKL", "Full"],
    },
  },
  {
    title: "240Hz Gaming Monitor",
    price: "$349",
    categories: ["Hardware", "Display"],
    imageUrl: "/pc.jpg",
    productDetails: {
      title: "240Hz Gaming Monitor",
      price: "$349",
      categories: ["Hardware", "Display"],
      imageUrl: "/pc.jpg",
      description:
        "Ultra-fast gaming monitor with 240Hz refresh rate, 1ms response time, and adaptive sync technology. Perfect for competitive gaming and esports.",
      specs: [
        { key: "Refresh Rate", value: "240Hz" },
        { key: "Response Time", value: "1ms GTG" },
        { key: "Resolution", value: "1080p FHD" },
        { key: "Panel Type", value: "IPS" },
        { key: "Sync Technology", value: "G-Sync/FreeSync" },
      ],
      rating: 4.7,
      reviewCount: 742,
      availableSizes: ['24"', '27"'],
    },
  },
];

// Section component to reuse for each product category
const ProductSection = ({
  title,
  description,
  products,
  moreLink,
  more,
  className,
}: {
  title: string;
  description: string;
  products: Product[];
  more?: string;
  moreLink?: string;
  className?: string;
}) => {
  // Event handlers for the ProductCard
  const handleAddToCart = (product: ProductCardProduct) => {
    console.log("Adding to cart:", product);
    // Add your cart logic here
  };

  const handleToggleFavorite = (product: ProductCardProduct) => {
    console.log("Toggling favorite:", product);
    // Add your favorites logic here
  };

  const handleViewDetails = (product: ProductCardProduct) => {
    console.log("Viewing details:", product);
    // Add your view details logic here (e.g., navigate to product page)
  };

  return (
    <div className={`w-full mb-[100px] ${className}`}>
      <div className="flex text-start items-end justify-between w-full mb-6">
        <div className="block">
          <h2 className="md:text-3xl text-lg font-bold text-white">{title}</h2>
          <p className="text-white opacity-70 md:text-base text-xs mt-2">
            {description}
          </p>
        </div>
        {more && moreLink && (
          <a
            href={moreLink}
            className="flex items-center gap-2 text-white hover:opacity-55 md:text-base text-xs transition duration-300"
          >
            {more}
            <FaArrowRight />
          </a>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ProductCard
          key={index}
        product={mapToProductCardFormat(product, index)}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        onViewDetails={handleViewDetails}
      />
        ))}
      </div>
    </div>
  );
};

const Discover = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 mt-20">
      <div className="max-w-6xl w-full">
        <ProductSection
          title="Discover"
          description="Explore our latest products and collections"
          products={designProducts}
        />

        <ProductSection
          title="Gaming Setups"
          description="Complete gaming stations for every budget"
          products={gamingSetups}
          moreLink="/design"
          more="View all"
        />

        <ProductSection
          title="CODM Starter Packs"
          description="Everything you need to get started with Call of Duty Mobile"
          products={codmStarterPacks}
          moreLink="/Starter"
          more="View all"
        />

        <ProductSection
          title="Pro Gamer Equipment"
          description="Professional-grade gear used by esports champions"
          products={proGamerProducts}
          moreLink="/ProGamer"
          more="View all"
          className="border-t border-neutral-500/20 border-opacity-10 pt-10"
        />
      </div>
    </div>
  );
};

export default Discover;
