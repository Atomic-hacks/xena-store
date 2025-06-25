import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns:[{
      protocol: "https",
      hostname: "cdn.sanity.io"
    },
   {
      protocol: "https",
      hostname: "placehold.co"
    },],
    domains: ['images.unsplash.com', 'assets.aceternity.com', 'unsplash.com'],
  },
};

export default nextConfig;