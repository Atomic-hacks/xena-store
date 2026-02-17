import {
  PrismaClient,
  DealType,
  DiscountType,
  ProductCondition,
  ProductStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Phones", slug: "phones" },
  { name: "Tablets", slug: "tablets" },
  { name: "Monitors", slug: "monitors" },
  { name: "Smartphones", slug: "smartphones" },
  { name: "Laptops", slug: "laptops" },
  { name: "Audio", slug: "audio" },
  { name: "Wearables", slug: "wearables" },
  { name: "Gaming", slug: "gaming" },
  { name: "Smart Home", slug: "smart-home" },
  { name: "Cameras", slug: "cameras" },
  { name: "Accessories", slug: "accessories" },
  { name: "Networking", slug: "networking" },
];

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  brand?: string;
  price: number;
  discountType: DiscountType;
  discountValue: number;
  stock: number;
  featured: boolean;
  tags: string[];
  specs: Array<{ key: string; value: string }>;
};

const products: SeedProduct[] = [
  {
    name: "Nova X1 5G",
    slug: "nova-x1-5g",
    description: "Flagship 5G smartphone with OLED display and all-day battery.",
    categorySlug: "smartphones",
    price: 89900,
    discountType: DiscountType.PERCENT,
    discountValue: 10,
    stock: 34,
    featured: true,
    tags: ["5g", "oled", "fast-charge"],
    specs: [
      { key: "Display", value: "6.7-inch OLED 120Hz" },
      { key: "Chip", value: "Octa-core 3.1GHz" },
      { key: "Storage", value: "256GB" },
      { key: "Battery", value: "5000mAh" },
    ],
  },
  {
    name: "Nova X1 Pro",
    slug: "nova-x1-pro",
    description: "Premium camera-focused smartphone with optical zoom and AI stabilization.",
    categorySlug: "smartphones",
    price: 109900,
    discountType: DiscountType.FIXED,
    discountValue: 8000,
    stock: 18,
    featured: true,
    tags: ["camera", "pro", "5g"],
    specs: [
      { key: "Main Camera", value: "50MP OIS" },
      { key: "Telephoto", value: "5x optical zoom" },
      { key: "Storage", value: "512GB" },
      { key: "RAM", value: "12GB" },
    ],
  },
  {
    name: "AirLite 14",
    slug: "airlite-14",
    description: "Thin productivity laptop for students and remote professionals.",
    categorySlug: "laptops",
    price: 79900,
    discountType: DiscountType.PERCENT,
    discountValue: 12,
    stock: 22,
    featured: true,
    tags: ["lightweight", "office", "battery"],
    specs: [
      { key: "CPU", value: "Intel Core i5" },
      { key: "RAM", value: "16GB" },
      { key: "Storage", value: "512GB SSD" },
      { key: "Weight", value: "1.25kg" },
    ],
  },
  {
    name: "ForgeBook 16",
    slug: "forgebook-16",
    description: "High-performance laptop built for creators and engineers.",
    categorySlug: "laptops",
    price: 149900,
    discountType: DiscountType.NONE,
    discountValue: 0,
    stock: 10,
    featured: false,
    tags: ["creator", "16-inch", "performance"],
    specs: [
      { key: "CPU", value: "Ryzen 9" },
      { key: "GPU", value: "RTX 4070" },
      { key: "RAM", value: "32GB" },
      { key: "Storage", value: "1TB SSD" },
    ],
  },
  {
    name: "Pulse Buds ANC",
    slug: "pulse-buds-anc",
    description: "True wireless earbuds with adaptive noise cancellation.",
    categorySlug: "audio",
    price: 12900,
    discountType: DiscountType.PERCENT,
    discountValue: 15,
    stock: 67,
    featured: true,
    tags: ["anc", "wireless", "bluetooth"],
    specs: [
      { key: "Battery", value: "36 hours with case" },
      { key: "Codec", value: "AAC/SBC" },
      { key: "Mic", value: "Triple beamforming" },
      { key: "Resistance", value: "IPX4" },
    ],
  },
  {
    name: "Wave Studio Headphones",
    slug: "wave-studio-headphones",
    description: "Over-ear wireless headphones with deep bass and low-latency mode.",
    categorySlug: "audio",
    price: 21900,
    discountType: DiscountType.FIXED,
    discountValue: 2500,
    stock: 29,
    featured: false,
    tags: ["wireless", "over-ear", "gaming"],
    specs: [
      { key: "Driver", value: "40mm dynamic" },
      { key: "Battery", value: "45 hours" },
      { key: "Connectivity", value: "Bluetooth 5.3" },
      { key: "Weight", value: "265g" },
    ],
  },
  {
    name: "Stride Watch 2",
    slug: "stride-watch-2",
    description: "Health-focused smartwatch with GPS and sleep analytics.",
    categorySlug: "wearables",
    price: 24900,
    discountType: DiscountType.PERCENT,
    discountValue: 20,
    stock: 44,
    featured: true,
    tags: ["fitness", "gps", "wearable"],
    specs: [
      { key: "Display", value: "1.9-inch AMOLED" },
      { key: "Sensors", value: "HR, SpO2, ECG" },
      { key: "Battery", value: "7 days" },
      { key: "Water", value: "5ATM" },
    ],
  },
  {
    name: "Core Band Lite",
    slug: "core-band-lite",
    description: "Slim smart band with workout tracking and call alerts.",
    categorySlug: "wearables",
    price: 5900,
    discountType: DiscountType.NONE,
    discountValue: 0,
    stock: 120,
    featured: false,
    tags: ["budget", "fitness", "lightweight"],
    specs: [
      { key: "Display", value: "1.1-inch AMOLED" },
      { key: "Battery", value: "14 days" },
      { key: "Modes", value: "60+ sports" },
      { key: "Weight", value: "18g" },
    ],
  },
  {
    name: "Apex Controller Pro",
    slug: "apex-controller-pro",
    description: "Wireless controller with programmable paddles and haptic feedback.",
    categorySlug: "gaming",
    price: 14900,
    discountType: DiscountType.PERCENT,
    discountValue: 8,
    stock: 52,
    featured: false,
    tags: ["controller", "wireless", "esports"],
    specs: [
      { key: "Connection", value: "2.4GHz + Bluetooth" },
      { key: "Battery", value: "30 hours" },
      { key: "Paddles", value: "4 rear paddles" },
      { key: "Latency", value: "< 2ms" },
    ],
  },
  {
    name: "Nebula RGB Keyboard",
    slug: "nebula-rgb-keyboard",
    description: "Mechanical keyboard with hot-swappable switches and macro layers.",
    categorySlug: "gaming",
    price: 10900,
    discountType: DiscountType.FIXED,
    discountValue: 1200,
    stock: 73,
    featured: true,
    tags: ["mechanical", "rgb", "keyboard"],
    specs: [
      { key: "Layout", value: "75%" },
      { key: "Switches", value: "Hot-swappable" },
      { key: "Backlight", value: "Per-key RGB" },
      { key: "Connection", value: "USB-C" },
    ],
  },
  {
    name: "HomeHub Mini",
    slug: "homehub-mini",
    description: "Compact smart home assistant with voice and routine control.",
    categorySlug: "smart-home",
    price: 7900,
    discountType: DiscountType.PERCENT,
    discountValue: 18,
    stock: 95,
    featured: false,
    tags: ["assistant", "voice", "iot"],
    specs: [
      { key: "Audio", value: "360-degree speaker" },
      { key: "Mics", value: "Far-field array" },
      { key: "Standards", value: "Matter ready" },
      { key: "Wi-Fi", value: "Dual-band" },
    ],
  },
  {
    name: "GlowCam Indoor",
    slug: "glowcam-indoor",
    description: "Indoor security camera with person detection and night vision.",
    categorySlug: "smart-home",
    price: 9900,
    discountType: DiscountType.NONE,
    discountValue: 0,
    stock: 64,
    featured: false,
    tags: ["security", "camera", "home"],
    specs: [
      { key: "Resolution", value: "2K" },
      { key: "Night Vision", value: "Infrared" },
      { key: "Storage", value: "Cloud + SD" },
      { key: "Alerts", value: "Motion/Person" },
    ],
  },
  {
    name: "PixelShot S",
    slug: "pixelshot-s",
    description: "Mirrorless camera designed for travel photography.",
    categorySlug: "cameras",
    price: 99900,
    discountType: DiscountType.FIXED,
    discountValue: 9000,
    stock: 16,
    featured: true,
    tags: ["mirrorless", "travel", "4k"],
    specs: [
      { key: "Sensor", value: "APS-C 24MP" },
      { key: "Video", value: "4K 60fps" },
      { key: "Stabilization", value: "5-axis IBIS" },
      { key: "Weight", value: "410g" },
    ],
  },
  {
    name: "VisionCam Pro",
    slug: "visioncam-pro",
    description: "Hybrid camera body for photo and cinematic video workflows.",
    categorySlug: "cameras",
    price: 159900,
    discountType: DiscountType.NONE,
    discountValue: 0,
    stock: 8,
    featured: false,
    tags: ["pro", "video", "hybrid"],
    specs: [
      { key: "Sensor", value: "Full-frame 30MP" },
      { key: "Video", value: "6K open gate" },
      { key: "Ports", value: "HDMI + USB-C" },
      { key: "Media", value: "Dual card slots" },
    ],
  },
  {
    name: "HyperCharge 100W",
    slug: "hypercharge-100w",
    description: "GaN wall charger with three ports and fast charging profiles.",
    categorySlug: "accessories",
    price: 4900,
    discountType: DiscountType.PERCENT,
    discountValue: 10,
    stock: 150,
    featured: false,
    tags: ["charger", "gan", "usb-c"],
    specs: [
      { key: "Power", value: "100W max" },
      { key: "Ports", value: "2x USB-C, 1x USB-A" },
      { key: "Protocol", value: "PD/PPS" },
      { key: "Size", value: "Compact" },
    ],
  },
  {
    name: "FlexDock 8-in-1",
    slug: "flexdock-8-in-1",
    description: "USB-C docking station with Ethernet, HDMI and card reader.",
    categorySlug: "accessories",
    price: 8500,
    discountType: DiscountType.FIXED,
    discountValue: 1000,
    stock: 77,
    featured: true,
    tags: ["dock", "usb-c", "productivity"],
    specs: [
      { key: "Video", value: "4K HDMI" },
      { key: "Network", value: "Gigabit Ethernet" },
      { key: "Power Delivery", value: "85W passthrough" },
      { key: "Ports", value: "8 total" },
    ],
  },
  {
    name: "MeshRouter M5",
    slug: "meshrouter-m5",
    description: "Tri-band Wi-Fi mesh router system for larger homes.",
    categorySlug: "networking",
    price: 22900,
    discountType: DiscountType.PERCENT,
    discountValue: 14,
    stock: 31,
    featured: false,
    tags: ["wifi", "mesh", "router"],
    specs: [
      { key: "Standard", value: "Wi-Fi 6E" },
      { key: "Coverage", value: "Up to 6,000 sq ft" },
      { key: "Bands", value: "Tri-band" },
      { key: "Ports", value: "2.5GbE WAN" },
    ],
  },
  {
    name: "SignalBoost AX",
    slug: "signalboost-ax",
    description: "Range extender for dead-zone elimination with easy pairing.",
    categorySlug: "networking",
    price: 6900,
    discountType: DiscountType.NONE,
    discountValue: 0,
    stock: 88,
    featured: false,
    tags: ["extender", "wifi", "home"],
    specs: [
      { key: "Standard", value: "Wi-Fi 6" },
      { key: "Setup", value: "One-touch pairing" },
      { key: "Antenna", value: "4 high-gain" },
      { key: "Modes", value: "AP/Extender" },
    ],
  },
  {
    name: "FocusPad Tablet 11",
    slug: "focuspad-tablet-11",
    description: "11-inch tablet optimized for reading, note-taking, and media.",
    categorySlug: "tablets",
    price: 39900,
    discountType: DiscountType.PERCENT,
    discountValue: 6,
    stock: 40,
    featured: true,
    tags: ["tablet", "notes", "productivity"],
    specs: [
      { key: "Display", value: "11-inch IPS" },
      { key: "Storage", value: "256GB" },
      { key: "Battery", value: "10 hours" },
      { key: "Pen Support", value: "Active stylus" },
    ],
  },
  {
    name: "KeyFlow Ergonomic",
    slug: "keyflow-ergonomic",
    description: "Split ergonomic keyboard for long writing sessions.",
    categorySlug: "tablets",
    price: 12900,
    discountType: DiscountType.FIXED,
    discountValue: 900,
    stock: 46,
    featured: false,
    tags: ["ergonomic", "keyboard", "office"],
    specs: [
      { key: "Layout", value: "Split 65%" },
      { key: "Switch", value: "Quiet tactile" },
      { key: "Connectivity", value: "Bluetooth + USB-C" },
      { key: "Battery", value: "3 weeks" },
    ],
  },
  {
    name: "StreamMic USB",
    slug: "streammic-usb",
    description: "Plug-and-play condenser microphone for streaming and podcasts.",
    categorySlug: "audio",
    price: 10900,
    discountType: DiscountType.PERCENT,
    discountValue: 9,
    stock: 58,
    featured: false,
    tags: ["microphone", "streaming", "usb"],
    specs: [
      { key: "Capsule", value: "Condenser" },
      { key: "Pattern", value: "Cardioid" },
      { key: "Bit Depth", value: "24-bit" },
      { key: "Mount", value: "Shock mount included" },
    ],
  },
  {
    name: "ArcLight Monitor 27",
    slug: "arclight-monitor-27",
    description: "27-inch QHD monitor with fast refresh and color accuracy.",
    categorySlug: "gaming",
    price: 32900,
    discountType: DiscountType.PERCENT,
    discountValue: 11,
    stock: 21,
    featured: true,
    tags: ["monitor", "qhd", "gaming"],
    specs: [
      { key: "Resolution", value: "2560x1440" },
      { key: "Refresh", value: "165Hz" },
      { key: "Response", value: "1ms" },
      { key: "Color", value: "98% DCI-P3" },
    ],
  },
  {
    name: "VoltPower Bank 20K",
    slug: "voltpower-bank-20k",
    description: "High-capacity power bank with dual USB-C fast output.",
    categorySlug: "accessories",
    price: 6900,
    discountType: DiscountType.NONE,
    discountValue: 0,
    stock: 112,
    featured: false,
    tags: ["power-bank", "portable", "usb-c"],
    specs: [
      { key: "Capacity", value: "20,000mAh" },
      { key: "Output", value: "65W max" },
      { key: "Input", value: "USB-C fast recharge" },
      { key: "Display", value: "Battery indicator" },
    ],
  },
  {
    name: "ClipCam 4K",
    slug: "clipcam-4k",
    description: "Premium webcam with auto-framing and low-light correction.",
    categorySlug: "cameras",
    price: 15900,
    discountType: DiscountType.FIXED,
    discountValue: 1400,
    stock: 39,
    featured: false,
    tags: ["webcam", "4k", "meeting"],
    specs: [
      { key: "Resolution", value: "4K 30fps" },
      { key: "FOV", value: "90 degrees" },
      { key: "Mic", value: "Dual noise-canceling" },
      { key: "Mount", value: "Universal clip" },
    ],
  },
  {
    name: "GamePulse Mouse",
    slug: "gamepulse-mouse",
    description: "Ultra-light gaming mouse with optical switches.",
    categorySlug: "gaming",
    price: 7900,
    discountType: DiscountType.PERCENT,
    discountValue: 7,
    stock: 84,
    featured: false,
    tags: ["mouse", "esports", "rgb"],
    specs: [
      { key: "Weight", value: "59g" },
      { key: "Sensor", value: "26K DPI" },
      { key: "Switch", value: "Optical" },
      { key: "Cable", value: "Paracord" },
    ],
  },
  {
    name: "SyncBulb Starter Kit",
    slug: "syncbulb-starter-kit",
    description: "Smart lighting starter kit with app scheduling and scenes.",
    categorySlug: "smart-home",
    price: 11900,
    discountType: DiscountType.PERCENT,
    discountValue: 13,
    stock: 61,
    featured: false,
    tags: ["lighting", "smart-home", "automation"],
    specs: [
      { key: "Bulbs", value: "3 included" },
      { key: "Brightness", value: "1100 lumens each" },
      { key: "Color", value: "16M colors" },
      { key: "Control", value: "App + voice" },
    ],
  },
  {
    name: "RoadLink Router 5G",
    slug: "roadlink-router-5g",
    description: "Portable 5G hotspot router for travel and backup internet.",
    categorySlug: "networking",
    price: 18900,
    discountType: DiscountType.FIXED,
    discountValue: 1500,
    stock: 27,
    featured: false,
    tags: ["5g", "hotspot", "travel"],
    specs: [
      { key: "Cellular", value: "5G Sub-6" },
      { key: "Battery", value: "12 hours" },
      { key: "Wi-Fi", value: "Wi-Fi 6" },
      { key: "Sim", value: "Nano + eSIM" },
    ],
  },
];

const localImagePool = [
  "/Setup.jpg",
  "/Setup2.jpg",
  "/Setup3.jpg",
  "/Headset2.jpg",
  "/Headset3.jpg",
  "/Headset4.jpg",
  "/Monitor.jpg",
  "/Ipad.jpg",
  "/Ipad2.jpg",
  "/Ipad3.jpg",
  "/Ipad4.jpg",
  "/PC.jpg",
  "/dell.jpg",
  "/ipad5.jpg",
  "/ipad6.jpg",
  "/iphone.jpg",
  "/iphone2.jpg",
  "/laptop.jpg",
  "/macbookm3.jpg",
  "/ps5.jpg",
  "/ps52.jpg",
  "/ps53.jpg",
  "/samsung.jpg",
];

function imageFor(slug: string): string[] {
  const seed =
    slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    localImagePool.length;

  return [
    localImagePool[seed],
    localImagePool[(seed + 1) % localImagePool.length],
    localImagePool[(seed + 2) % localImagePool.length],
  ];
}

function inferBrand(product: SeedProduct): string {
  if (product.brand) {
    return product.brand;
  }
  return product.name.split(" ")[0] ?? "Generic";
}

function inferCondition(index: number): ProductCondition {
  if (index % 7 === 0) {
    return ProductCondition.UK_USED;
  }
  if (index % 9 === 0) {
    return ProductCondition.NG_USED;
  }
  return ProductCondition.NEW;
}

function inferConditionNotes(condition: ProductCondition): string {
  if (condition === ProductCondition.NEW) {
    return "Factory sealed or open-box inspected.";
  }
  if (condition === ProductCondition.UK_USED) {
    return "Clean UK-used unit with light signs of previous use.";
  }
  return "Nigerian-used unit tested and fully functional.";
}

function inferDefects(condition: ProductCondition, categorySlug: string) {
  if (condition === ProductCondition.NEW) {
    return [];
  }
  if (condition === ProductCondition.UK_USED) {
    return [
      {
        title: "Minor body marks",
        description: "Hairline marks visible under direct light.",
        severity: "low",
      },
    ];
  }
  return [
    {
      title: "Visible frame wear",
      description: "Corner scuffs from prior daily use.",
      severity: "medium",
    },
    ...(categorySlug === "smartphones"
      ? [
          {
            title: "Battery drop",
            description: "Battery retention slightly below new unit baseline.",
            severity: "medium",
          },
        ]
      : []),
  ];
}

function inferDealType(product: SeedProduct): DealType {
  if (product.discountType !== DiscountType.NONE && product.discountValue >= 12) {
    return DealType.HOT_SALE;
  }
  if (product.price <= 12000) {
    return DealType.CHEAP_DEAL;
  }
  return DealType.NONE;
}

function inferWarranty(condition: ProductCondition): string {
  if (condition === ProductCondition.NEW) {
    return "12 months";
  }
  if (condition === ProductCondition.UK_USED) {
    return "30 days";
  }
  return "7 days";
}

function inferAccessories(categorySlug: string): string[] {
  if (categorySlug === "smartphones") {
    return ["USB-C cable", "SIM ejector", "Protective pouch"];
  }
  if (categorySlug === "laptops") {
    return ["Power adapter", "Quick start guide"];
  }
  if (categorySlug === "audio") {
    return ["Charging cable", "Extra ear tips"];
  }
  return ["User guide"];
}

async function main() {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderIntent.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const createdCategories = await Promise.all(
    categories.map((category) => prisma.category.create({ data: category }))
  );

  const categoryMap = new Map(createdCategories.map((category) => [category.slug, category.id]));

  await Promise.all(
    products.slice(0, 25).map((product, index) => {
      const categoryId = categoryMap.get(product.categorySlug);
      if (!categoryId) {
        throw new Error(`Missing category for product ${product.slug}`);
      }

      const condition = inferCondition(index);
      const dealType = inferDealType(product);

      return prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          brand: inferBrand(product),
          description: product.description,
          images: imageFor(product.slug),
          price: product.price,
          discountType: product.discountType,
          discountValue: product.discountValue,
          stock: product.stock,
          featured: product.featured,
          status: ProductStatus.PUBLISHED,
          condition,
          conditionNotes: inferConditionNotes(condition),
          defects: inferDefects(condition, product.categorySlug),
          dealType,
          warranty: inferWarranty(condition),
          accessoriesIncluded: inferAccessories(product.categorySlug),
          batteryHealth:
            product.categorySlug === "smartphones"
              ? condition === ProductCondition.NEW
                ? "100%"
                : condition === ProductCondition.UK_USED
                ? "88%"
                : "79%"
              : null,
          categoryId,
          tags: product.tags,
          specs: product.specs,
          details: [
            { key: "Market", value: "Nigerian retail" },
            { key: "Inspection", value: "QC tested before dispatch" },
            { key: "Deal Type", value: dealType.replace(/_/g, " ") },
          ],
        },
      });
    })
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    console.error("[xenastore] prisma.seed.failed");
    await prisma.$disconnect();
    process.exit(1);
  });
