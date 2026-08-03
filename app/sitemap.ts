import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/case-studies";
import { blogPosts } from "@/lib/blog";

// Must match metadataBase in app/layout.tsx — www, not the apex, which redirects.
const BASE_URL = "https://www.pixeluplabs.com";

/**
 * Served at /sitemap.xml (Next metadata route). Case study and blog post
 * URLs are derived from lib/case-studies.ts and lib/blog.ts, so new ones
 * are picked up automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/call`,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/explorations`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...Object.values(caseStudies).map((study) => ({
      url: `${BASE_URL}/case-studies/${study.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
