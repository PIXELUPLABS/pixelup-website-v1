import type { Metadata, ResolvingMetadata } from "next";

type OpenGraphType = "website" | "article";

/**
 * Builds a route's generateMetadata from its static metadata, adding og:type
 * and og:url (resolved against metadataBase, so it matches the canonical).
 *
 * og:url can't live in app/layout.tsx: every route without its own openGraph
 * would inherit "/" and tell share scrapers it is the homepage. And Next swaps
 * a parent's `openGraph` for the page's instead of merging the two, so a page
 * that sets one stops inheriting app/opengraph-image.jpg. This copies the
 * resolved parent images back in. Routes with their own opengraph-image file
 * (call, swipe) set `openGraph` inline instead: an explicit `images` key would
 * hide their file.
 */
export function withOpenGraph(
  metadata: Metadata,
  url: string,
  type: OpenGraphType = "website",
) {
  return async (
    _props: unknown,
    parent: ResolvingMetadata,
  ): Promise<Metadata> => ({
    ...metadata,
    openGraph: { type, url, images: (await parent).openGraph?.images },
  });
}
