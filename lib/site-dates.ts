/**
 * Content-updated dates per route — the single source of truth for every
 * freshness signal the site emits (sitemap `<lastmod>` and JSON-LD
 * `dateModified`). Crawlers and AI answer engines both use these to decide
 * whether a page is current enough to cite.
 *
 * Bump a route's entry when that route's *content* changes. Deliberately not
 * `new Date()` at build time: that would claim every page was updated on
 * every deploy, including CSS-only ones, and Google drops `<lastmod>` from
 * consideration entirely once it decides a site's values are unreliable.
 *
 * Seeded from `git log -1` on each route's content source, so the starting
 * values are real dates rather than invented ones.
 *
 * Blog posts are not listed here — they already carry their own
 * `publishedDate` / `updatedDate` in lib/blog.ts, which is what those routes
 * and their sitemap entries use.
 */
export const siteUpdated = {
  home: "2026-08-03",
  call: "2026-07-28",
  explorations: "2026-07-29",
  clients: "2026-08-11",
  /** Every case study lives in lib/case-studies.ts, so they share one date. */
  caseStudies: "2026-08-07",
} as const;

/** First public commit of the site — used as `datePublished` on the homepage. */
export const sitePublished = "2026-07-03";
