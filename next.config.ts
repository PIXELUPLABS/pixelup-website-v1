import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (multiple lockfiles exist above it).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
