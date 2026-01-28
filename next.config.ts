import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    skewProtection: true,
  },
};

export default nextConfig;
