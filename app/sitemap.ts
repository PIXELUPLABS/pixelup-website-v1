import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/case-studies";

const BASE_URL = "https://pixeluplabs.com";

/**
 * Served at /sitemap.xml (Next metadata route). Case study URLs are derived
 * from lib/case-studies.ts, so new studies are picked up automatically.
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
    ...Object.values(caseStudies).map((study) => ({
      url: `${BASE_URL}/case-studies/${study.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
