import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/case-studies";
import { siteUpdated } from "@/lib/site-dates";
import { getBlogIndexUpdated, getBlogSitemapEntries } from "@/sanity/lib/blog-data";

// Must match metadataBase in app/layout.tsx — www, not the apex, which redirects.
const BASE_URL = "https://www.pixeluplabs.com";

/**
 * Render on every request. Next caches `sitemap.ts` by default (it is a Route
 * Handler), and neither cache refresh tried so far kept blog `<lastmod>`
 * current: the webhook's `revalidatePath('/sitemap.xml')` did not clear it
 * (2026-08-19), and the `revalidate = 3600` that followed re-ran the route
 * hourly but re-read the same cached Sanity result each time. On 2026-10-13
 * the sitemap regenerated on schedule and still listed 2026-10-08 for 16 of
 * 17 posts. getBlogSitemapEntries() now reads Sanity uncached, and crawlers
 * fetch a sitemap rarely enough that per-request rendering is cheap.
 *
 * Valid because Cache Components is not enabled in next.config.ts; under
 * Cache Components this export is removed (Next 16), and the uncached fetch
 * alone keeps the route dynamic.
 */
export const dynamic = "force-dynamic";

/**
 * Served at /sitemap.xml (Next metadata route). Case study and blog post
 * URLs are derived from lib/case-studies.ts and the active blog source, so
 * newly published Sanity posts appear on the next request.
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
    // Linked only from tool directories, so the sitemap is how Google finds it.
    {
      url: `${BASE_URL}/swipe`,
      lastModified: siteUpdated.swipe,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: siteUpdated.faq,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: siteUpdated.privacy,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/case-studies`,
      lastModified: siteUpdated.caseStudies,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // 301s to designforb2b.com (next.config.ts), so Search Console lists it
    // under "Page with redirect" rather than as indexed.
    {
      url: `${BASE_URL}/designforb2b`,
      lastModified: siteUpdated.designforb2b,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...Object.values(caseStudies)
      .filter((study) => study.publication.status === "published")
      .map((study) => ({
        url: `${BASE_URL}/case-studies/${study.slug}`,
        lastModified: study.publication.updatedDate,
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
