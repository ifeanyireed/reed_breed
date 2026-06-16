import type { NextConfig } from "next";
import path from "path";

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
    root: path.resolve(__dirname),
    rules: {
      "*.glb": { type: "asset" },
      "*.gltf": { type: "asset" },
      "*.mp4": { type: "asset" },
    },
  },
};

export default nextConfig;
