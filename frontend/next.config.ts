import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output a static export (generates an 'out' folder)
  output: 'export',
  
  // Ensure that trailing slashes are handled for static hosting
  trailingSlash: true,
  
  images: {
    unoptimized: true,
  },

  // Webpack fallback configuration
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: "asset/resource",
    });
    return config;
  },

  turbopack: {
    rules: {
      "*.glb": { type: "asset" },
      "*.gltf": { type: "asset" },
      "*.mp4": { type: "asset" },
    },
  },

  async headers() {
    // Note: static export does not support custom headers via next.config.js
    // You must set these in your .htaccess file on Hostinger
    return [];
  },
};

export default nextConfig;
