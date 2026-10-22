import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { DirectoryBadges } from "@/components/swipe/DirectoryBadges";
import { SwipeExplorer } from "@/components/swipe/SwipeExplorer";
import { siteUpdated } from "@/lib/site-dates";
import { swipeCreators } from "@/lib/swipe/creators";
import { dayLabel, profileUrl } from "@/lib/swipe/format";
import { swipeCategories, swipePosts } from "@/lib/swipe/posts";

/*
 * Swipe by PIXELUP LABS: a swipe file of the best-performing design posts on
 * X and LinkedIn, built to be listed on tool directories. Deliberately an
 * orphan page: it's not in app/sitemap.ts, nothing on the site links here,
 * and it's noindex (see metadata.robots below).
 *
 * Every post opens as the real thing through X's or LinkedIn's official embed
 * (components/swipe/SwipePostEmbed.tsx). The titles and summaries in the
 * cards are our own writing; the creators' text is never stored here.
 *
 * Static route: never read searchParams here. ?post= and ?creator= are
 * handled client-side in SwipeExplorer.
 */

const PAGE_URL = "https://www.pixeluplabs.com/swipe";
const TOOL_NAME = "Swipe by PIXELUP LABS";
const title = `${TOOL_NAME}: Design Swipe File for X and LinkedIn`;
const description = `${swipePosts.length} top-performing design posts from ${swipeCreators.length} designers on X and LinkedIn. Read each one, then copy an AI prompt to write your own. Free, no sign-up.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/swipe" },
  // Kept out of Google's index on purpose: the page exists for directory
  // listings, not search. follow stays on so its links still count.
  // Don't add a robots.txt Disallow: Google has to crawl it to see this.
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
  openGraph: {
    title,
    description,
    url: "/swipe",
    siteName: "PIXELUP LABS",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: title,
      description,
      // First built on this date; dateModified follows lib/site-dates.ts.
      datePublished: "2026-10-20",
      dateModified: siteUpdated.swipe,
      isPartOf: { "@id": "https://www.pixeluplabs.com/#website" },
      publisher: { "@id": "https://www.pixeluplabs.com/#organization" },
      mainEntity: { "@id": `${PAGE_URL}#creators` },
    },
    {
      "@type": "WebApplication",
      "@id": `${PAGE_URL}#app`,
      name: TOOL_NAME,
      url: PAGE_URL,
      description,
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      creator: { "@id": "https://www.pixeluplabs.com/#organization" },
    },
    {
      "@type": "ItemList",
      "@id": `${PAGE_URL}#creators`,
      name: `Creators in ${TOOL_NAME}`,
      numberOfItems: swipeCreators.length,
      itemListElement: swipeCreators.map((creator, index) => {
        const sameAs = [profileUrl(creator, "x"), profileUrl(creator, "linkedin")].filter(
          (url): url is string => url !== null,
        );
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Person",
            name: creator.name,
            ...(creator.role ? { jobTitle: creator.role } : {}),
            url: sameAs[0],
            sameAs,
          },
        };
      }),
    },
  ],
};

/** Heading block at the top of the sidebar (in flow above the feed below desk). */
function SwipeIntro() {
  return (
    <div className="flex flex-col gap-3">
      <p className="fade-up text-[12px] font-medium uppercase leading-none tracking-[0.04em] text-label-grey">
        Swipe by{" "}
        <Link href="/" className="text-white/60 transition-colors hover:text-white">
          PIXELUP LABS
        </Link>
      </p>
      <h1
        id="swipe-title"
        className="fade-up max-w-[22ch] text-balance text-[24px] font-medium leading-[1.1] tracking-display text-white [animation-delay:50ms] desk:text-[30px]"
      >
        The design swipe file for X and LinkedIn
      </h1>
      <p className="fade-up max-w-[40ch] text-pretty text-[16px] leading-[1.35] tracking-[-0.02em] text-muted-65 [animation-delay:100ms]">
        <strong className="font-medium text-white">{swipePosts.length} top-performing posts</strong> from{" "}
        <strong className="font-medium text-white">{swipeCreators.length} designers</strong>, broken down by format
        and opening move. Open any post to read it in full, then copy a prompt that helps you write your own.
      </p>
      <p className="fade-up font-mono text-[12px] uppercase leading-none tracking-[0.04em] text-label-grey [animation-delay:150ms]">
        Free · No sign-up · Updated <time dateTime={siteUpdated.swipe}>{dayLabel(siteUpdated.swipe)}</time>
      </p>
    </div>
  );
}

export default function SwipePage() {
  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <SwipeExplorer
        posts={swipePosts}
        creators={swipeCreators}
        categories={swipeCategories}
        intro={<SwipeIntro />}
      >
        <DirectoryBadges />
        <Footer />
      </SwipeExplorer>
    </div>
  );
}
