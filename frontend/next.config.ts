import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  // Webpack fallback configuration (for production builds)
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: "asset/resource",
    });
    return config;
  },

  // ✅ STABLE TOP-LEVEL KEY (Next.js 16+)
  turbopack: {
    rules: {
      "*.glb": {
        type: "asset",
      },
      "*.gltf": {
        type: "asset",
      },
      "*.mp4": {
        type: "asset",
      },
    },
  },

  // Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
