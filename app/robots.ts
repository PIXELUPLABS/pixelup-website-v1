import type { MetadataRoute } from "next";

/** Served at /robots.txt (Next metadata route). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.pixeluplabs.com/sitemap.xml",
  };
}
