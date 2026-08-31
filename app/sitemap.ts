import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/case-studies";
import { siteUpdated } from "@/lib/site-dates";
import { getBlogIndexUpdated, getBlogSitemapEntries } from "@/sanity/lib/blog-data";

// Must match metadataBase in app/layout.tsx — www, not the apex, which redirects.
const BASE_URL = "https://www.pixeluplabs.com";

/**
 * Re-generate at most hourly. Next caches `sitemap.ts` indefinitely by default
 * (it is a Route Handler), so without this the blog `<lastmod>` values freeze
 * at whatever the last deploy baked in: a Sanity publish updates the article
 * but the sitemap keeps advertising the old date until something triggers a
 * rebuild. That happened on 2026-08-19 — the agency-vs article was corrected
 * in Sanity and the sitemap still claimed 2026-08-05.
 *
 * The revalidate webhook's `revalidatePath('/sitemap.xml')` did not clear it
 * either, so this is the durable fix. Valid because Cache Components is not
 * enabled in next.config.ts; under Cache Components this export is removed
 * (Next 16) and the equivalent is `'use cache'` + `cacheLife`.
 */
export const revalidate = 3600;

/**
 * Served at /sitemap.xml (Next metadata route). Case study and blog post
 * URLs are derived from lib/case-studies.ts and the active blog source, so
 * newly published Sanity posts are picked up automatically after revalidation.
 *
 * Every entry carries `lastModified`, which Next renders as `<lastmod>`.
 * Without it, crawlers and AI answer engines have no way to tell whether a
 * URL is current, so they treat it as undated and discount it. Dates come
 * from lib/site-dates.ts (static routes) and each post's own `updatedDate`
 * (blog) — see the note there on why this isn't `new Date()`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogSitemapEntries();
  const blogIndexUpdated = getBlogIndexUpdated(blogPosts);

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: siteUpdated.home,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/call`,
      lastModified: siteUpdated.call,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/explorations`,
      lastModified: siteUpdated.explorations,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/clients`,
      lastModified: siteUpdated.clients,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: blogIndexUpdated,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: siteUpdated.privacy,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...Object.values(caseStudies)
      .filter((study) => study.publication.status === "published")
      .map((study) => ({
        url: `${BASE_URL}/case-studies/${study.slug}`,
        lastModified: siteUpdated.caseStudies,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      })),
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
