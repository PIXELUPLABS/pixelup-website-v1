import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (multiple lockfiles exist above it).
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Serve AVIF where supported (smaller than the WebP default), fall back
    // to WebP. Sources are large PNGs; the optimizer does the heavy lifting.
    formats: ["image/avif", "image/webp"],
    // Optimized images are immutable per URL — cache them for a year.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    // statusCode 301 (not `permanent: true`, which is 308) — explicitly
    // requested for SEO-equivalence with the old URLs.
    return [
      {
        source: "/greptile-design-system",
        destination: "/case-studies/greptile",
        statusCode: 301,
      },
      {
        source: "/sainapse",
        destination: "/case-studies/sainapse",
        statusCode: 301,
      },
      {
        source: "/sully",
        destination: "/case-studies/sully",
        statusCode: 301,
      },
      {
        source: "/old/home",
        destination: "/",
        statusCode: 301,
      },
      // Old or mistyped blog slugs that still get search impressions.
      {
        source: "/blog/best-b2b-ai-and-tech-startup-branding-agencies",
        destination: "/blog/best-branding-agencies-b2b-ai-tech-startups",
        statusCode: 301,
      },
      {
        source: "/blog/best-design-adapters-for-ai-startups",
        destination: "/blog/best-design-agencies-for-ai-startups",
        statusCode: 301,
      },
      {
        source: "/blog/best-design-agencies-ai-startups",
        destination: "/blog/best-design-agencies-for-ai-startups",
        statusCode: 301,
      },
      {
        source: "/blog/best-b2b-ai-tech-startups-2026",
        destination: "/blog/best-branding-agencies-b2b-ai-tech-startups",
        statusCode: 301,
      },
      {
        source: "/blog/best-branding-ai-tech-startups",
        destination: "/blog/best-branding-agencies-b2b-ai-tech-startups",
        statusCode: 301,
      },
      {
        source: "/blog/best-design-agencies-b2b-ai-tech-startups",
        destination: "/blog/best-branding-agencies-b2b-ai-tech-startups",
        statusCode: 301,
      },
      {
        source: "/pixeluplabs",
        destination: "/",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
