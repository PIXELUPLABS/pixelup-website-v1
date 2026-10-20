import { links, type ProjectMedia } from "./projects";
import { testimonials } from "./testimonials";

/**
 * Case study page content, mirroring the Figma case study template
 * (one identical layout per project, only copy + media change).
 *
 * Media slots are placeholders for now: when `media` is omitted the slot
 * renders as a solid block matching the Figma placeholder fill (`tone`).
 * Once real assets land, drop files into /public and set `media` — no
 * component changes needed.
 */

/** Background used while a slot has no real asset yet. */
export type MediaTone = "white" | "faint" | "green";

export interface MediaSlot {
  media?: ProjectMedia;
  alt?: string;
  tone?: MediaTone;
  /** Render an image at full width with its source aspect ratio instead of cropping it. */
  intrinsicSize?: {
    width: number;
    height: number;
  };
  /** Logo mark rendered centered on top of the media (as on the homepage cards). */
  overlayLogo?: string;
  /** Client message (Slack or X) pinned top right on a full-width slot (under it on mobile). */
  comment?: MediaComment;
  /** Video only: play once from the start each time it scrolls into view
   * (paused when it leaves, no loop) instead of autoplaying on a loop. */
  playOnView?: boolean;
  /** With `playOnView`: keep looping while in view instead of stopping at the end. */
  loop?: boolean;
  /** Image with `intrinsicSize` only: an animated bar chart drawn over it. */
  chart?: MediaChart;
  /** Image with `intrinsicSize` only: layers that slide into it on scroll-in. */
  layers?: MediaLayers;
  /**
   * Image with `intrinsicSize` only: a self-contained HTML animation (a page
   * under /public, drawn at the image's aspect) played over the image, which
   * stays underneath as its still. The page runs its own play-on-view and
   * reduced-motion handling, and stays transparent until its first frame.
   */
  embed?: string;
  /**
   * With `embed`: start once this share of the frame is in view (e.g. 0.1)
   * and keep playing until it's fully out of view. Without it, the embed
   * plays while half of it is in view.
   */
  embedPlayAt?: number;
}

/**
 * Image layers over a slot image exported without them. `moving` layers slide
 * in from `from` and fade up once on scroll-in, inside `clip`; `overlay` sits
 * above them inside the clip (e.g. a soft-light grain) and `front` above
 * everything (e.g. an audience in front of a screen). Boxes are in the slot
 * image's pixels, `at` is seconds from the start of the reveal.
 */
export interface MediaLayers {
  clip: MediaBox;
  /** Offset each moving layer starts at, in image pixels. */
  from: { x: number; y?: number };
  /** Seconds each moving layer takes to settle. */
  duration: number;
  moving: { src: string; box: MediaBox; at: number }[];
  overlay?: { src: string; box: MediaBox; blend?: "soft-light" };
  front?: { src: string; box: MediaBox };
}

/** x, y, width and height in the slot image's own pixels. */
export type MediaBox = [number, number, number, number];

/**
 * Bar-chart columns layered over a mockup exported with its chart hidden,
 * replaying the chart's Figma motion once on scroll-in: each column wipes
 * open top-down and fades in, its bars drop in bottom-up, then its label
 * slides in. Every `at` is seconds from the start of the reveal.
 */
export interface MediaChart {
  /**
   * Dashed "[" and "]" down each column's left and right edges, which stretch
   * with the column as it opens. Lengths in image pixels; `dash` is Figma's
   * dash (and gap) length, drawn with square caps.
   */
  brackets?: { width: number; stroke: number; dash: number; color: string };
  columns: {
    /** The column's clip box. */
    box: MediaBox;
    /** When the column starts opening. */
    at: number;
    label: { src: string; box: MediaBox; at: number };
    caption: { src: string; box: MediaBox };
    bar: { src: string; x: number; width: number; height: number };
    /** Each bar's top edge and start time, top to bottom. */
    bars: { y: number; at: number }[];
  }[];
}

/**
 * A client message pinned to a full-width media slot: a Slack message by
 * default, or a public X post (`variant: "x"`). It types out once on scroll.
 */
export interface MediaComment {
  variant?: "slack" | "x";
  /** Without one, the card shows the sender's initials. */
  avatar?: string;
  name: string;
  /** X only: the sender's handle, without the @. */
  handle?: string;
  /** X only: the post's URL. The X logo and the date link to it. */
  href?: string;
  /** X only: the blue verification check after the name. */
  verified?: boolean;
  /** X only: when it was posted (ISO 8601). Shown in the reader's time zone,
   * as X does, after a UTC first render. */
  datetime?: string;
  /** X only: the counts under the post, as of the date in the entry's comment.
   * Zero or missing counts show the icon alone, as X does. */
  stats?: {
    replies?: number;
    reposts?: number;
    likes?: number;
    bookmarks?: number;
    views?: number;
  };
  /** Sender's org, shown as Slack's badge on the avatar (its first letter). */
  org?: string;
  /** Timestamp as Slack shows it ("Sep 3rd at 3:37 AM") or X does ("Oct 15, 2026"). */
  time?: string;
  /** Slack: a mention chip before the message. X: the "Replying to @…" line. */
  mention?: string;
  /**
   * Blur the @mention chip. The chip keeps its shape, but the name never
   * reaches the browser: CaseMedia sends a same-length placeholder instead.
   */
  blurMention?: boolean;
  quote: string;
  reactions?: { emoji: string; count: number; mine?: boolean }[];
}

/** A row of imagery between sections: one full-bleed slot or a side-by-side pair. */
export type MediaBlock =
  | {
      kind: "full";
      slot: MediaSlot;
      /** Preserve landscape assets instead of using the default full-width crop. */
      aspect?: "standard" | "wide";
    }
  | {
      kind: "pair";
      slots: [MediaSlot, MediaSlot];
      /** Preserve landscape assets instead of using the default near-square crop. */
      aspect?: "standard" | "wide";
    }
  | {
      /** Portrait images drifting left in an endless row across a panel (the
       * "Trusted by" marquee, at poster scale). Every slot needs `media` and
       * `intrinsicSize`. */
      kind: "marquee";
      slots: MediaSlot[];
      /** Image behind the row, cropped to the panel. */
      background?: MediaSlot;
      /** Seconds for one full pass of the set. Defaults to 40. */
      duration?: number;
    };

export interface FocusItem {
  title: string;
  sub: string;
}

export interface ResultRow {
  label: string;
  text: string;
}

/** A closing sentence ending in an inline link, e.g. "Want to talk about
 * your own brand? Book a call." */
export interface InlineCta {
  text: string;
  label: string;
  href: string;
}

export interface CaseSection {
  heading: string;
  /** Reduce long desktop headings so they stay within two lines. */
  headingSize?: "default" | "compact" | "small";
  /** Lead paragraph above the list/rows. Line breaks are preserved. */
  lead?: string;
  /** "Clarity over cleverness / Making complex workflows simple" pairs. */
  focus?: FocusItem[];
  /** "Week 1: …" metric rows. */
  results?: ResultRow[];
  paragraphs?: string[];
  bullets?: string[];
  /** Closing sentence with an inline link, after the copy (last section). */
  cta?: InlineCta;
  /** Imagery rendered after this section. */
  media: MediaBlock[];
}

export interface FaqItem {
  q: string;
  a: string;
  href?: string;
  linkLabel?: string;
}

export interface MoreProjectRef {
  /** Must match a slug in lib/projects.ts — card media + link come from there. */
  slug: string;
  tags: string;
}

export interface CaseMetric {
  value: string;
  label: string;
  /** Optional muted sub-line under the label. */
  detail?: string;
}

export type CaseStoryBlock =
  | {
      kind: "context";
      id: string;
      heading: string;
      items: { label: string; text: string }[];
    }
  | {
      kind: "media";
      id: string;
      media: MediaBlock;
    }
  | {
      kind: "challenge";
      id: string;
      index: string;
      heading: string;
      problem: string;
      whyItMattered: string;
      whatWeDid: string;
      outcome: string;
    }
  | {
      kind: "gallery";
      id: string;
      heading: string;
      intro: string;
      media: MediaBlock[];
    }
  | {
      kind: "results";
      id: string;
      heading: string;
      /** Omit to show the heading alone, so the testimonial row that follows
       * is the result. */
      metrics?: CaseMetric[];
    }
  | {
      kind: "testimonial";
      id: string;
      /** Omit for a quiet row with no section heading, placed right after
       * Results so it closes that block. */
      heading?: string;
      quote: string;
      person: {
        name: string;
        role: string;
        company: string;
        headshot?: string;
      };
      /** Where the quote was said publicly, linked after the company
       * ("Founder & CEO, Replay, on X, 15 October 2026"). */
      source?: { label: string; href: string };
      approvalPending?: boolean;
    }
  | {
      kind: "afterLaunch";
      id: string;
      heading: string;
      paragraphs: string[];
      /** Closing sentence with an inline link, after the paragraphs. */
      cta?: InlineCta;
    };

export interface CaseStudyStory {
  company: string;
  statusBadge?: string;
  headline: string;
  /** Let the h1 fill the full column width instead of wrapping at 20ch. */
  fullWidthHeadline?: boolean;
  /** The desktop sidebar copy. Omit to show the study's `description`. */
  summary?: string;
  /** Hero stat row under the headline. Omit to go straight to the hero media. */
  highlights?: CaseMetric[];
  blocks: CaseStoryBlock[];
  faqHeading: string;
  faqs: FaqItem[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  info: {
    client: string;
    year: string;
    involvement: string[];
    funding?: string;
    links: { label: string; href: string }[];
  };
  /** Long-form intro shown in the desktop sidebar (hidden on mobile, per Figma). */
  description: string[];
  hero: MediaSlot;
  /** Optional visual immediately after the hero, before the first story section. */
  introMedia?: MediaBlock[];
  /** Optional richer editorial structure. Legacy sections remain the fallback. */
  story?: CaseStudyStory;
  /** Explicitly keep the original detail-page renderer while retaining story data elsewhere. */
  detailLayout?: "legacy" | "story";
  sections: CaseSection[];
  closing?: {
    heading: string;
    headingSize?: "default" | "compact" | "small";
    paragraphs: string[];
    media?: MediaBlock[];
  };
  /** Optional page-specific CTA rendered after the closing media and before the FAQ. */
  endCta?: {
    label: string;
    href: string;
  };
  moreProjects: MoreProjectRef[];
  publication: {
    status: "draft" | "published";
    /** First day this study was public on the site (YYYY-MM-DD). */
    publishedDate: string;
    /**
     * Last day this page's visible content changed (YYYY-MM-DD). Drives the
     * Article JSON-LD `dateModified` and the sitemap `<lastmod>` (not shown
     * on the page). Bump it in the same commit as any content change to this
     * study, including the shared FAQ when this page's layout renders it.
     * Don't bump it for CSS-only changes (see lib/site-dates.ts).
     */
    updatedDate: string;
    blockers?: string[];
  };
}

/**
 * Shared FAQ shown on every case study page: about PIXELUP LABS itself, written
 * to resolve the objections prospects most often bring to a first call.
 */
export const faqHeading = "Frequently asked questions";

export const pixelupFaq: FaqItem[] = [
  {
    q: "What does PIXELUP LABS do?",
    a: "We build brands, websites and products for startups that need to command enterprise trust. Brand identity, website design, product design, design systems, motion and sales assets, all designed together as one system.",
  },
  {
    q: "What results have you delivered for clients?",
    a: "Greptile doubled demo requests in week one and raised a $25M Series A within six months of launch. Sully scaled 26x in 11 months after its redesign. Sainapse relaunched ahead of general availability and is now deployed by Fortune 500 companies including Ford and Freshworks.",
  },
  {
    q: "How long does a typical engagement take?",
    a: "We work on startup timelines. Most engagements ship in weeks, not months, and we regularly deliver under hard deadlines like fundraise announcements and launch dates.",
  },
  {
    q: "How much does it cost?",
    a: "Brand sprints are $15,000. Brand plus website projects run $25,000 to $40,000. Retainers start at $6,000 a month.",
    href: "https://contra.com/daksh_aswal_dt5tfn27/services",
    linkLabel: "See current services and pricing on Contra.",
  },
  {
    q: "What is it like to work with you?",
    a: "You work directly with the team on Slack, with fast turnarounds and quick iterations. No account managers, no layers, no surprises.",
  },
  {
    q: "We already have a brand and website. Do we need to start over?",
    a: "Rarely. Most clients come to us with something functional that no longer matches their ambition. We keep what works and rebuild what holds you back.",
  },
  {
    q: "How do we get started?",
    a: "Book a discovery call or message us on Telegram. We will review where you are today and tell you honestly what we would change.",
  },
];

/**
 * FAQPage structured data (schema.org) for the FAQ block above — same
 * questions/answers shown on every case study page, so Google can surface
 * them as an FAQ rich result. Keep in sync with `pixelupFaq`.
 */
export const pixelupFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pixelupFaq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const BASE_URL = "https://www.pixeluplabs.com";

/**
 * Article structured data for one case study page, carrying the same
 * `datePublished` / `dateModified` from its `publication`. The dates stay in
 * the schema even though the page no longer shows them. Same shape as the blog's BlogPosting schema (sanity/lib/blog-schema.ts),
 * with the studio as author since case studies aren't bylined.
 */
export function caseStudySchema(study: CaseStudy) {
  const url = `${BASE_URL}/case-studies/${study.slug}`;
  const organization = {
    "@type": "Organization",
    name: "PIXELUP LABS",
    url: `${BASE_URL}/`,
    logo: { "@type": "ImageObject", url: `${BASE_URL}/media/nav-logo.svg` },
  };
  const heroMedia = study.hero.media;
  const image =
    heroMedia?.type === "image"
      ? `${BASE_URL}${heroMedia.src}`
      : heroMedia?.type === "video" && heroMedia.poster
        ? `${BASE_URL}${heroMedia.poster}`
        : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: study.title,
    description: study.metaDescription,
    ...(image ? { image } : {}),
    datePublished: study.publication.publishedDate,
    dateModified: study.publication.updatedDate,
    author: organization,
    publisher: organization,
  };
}

// The story layout FuseAI and Replay use, filled only with copy Greptile's
// case study already had (Arjun, 2026-10-20): the live page's results,
// sidebar `description`, after-launch paragraphs and FAQ, plus the story copy
// this entry carried for that layout (headline, context and challenges).
// Mockups: Figma jfiQlmF7z1j3cq8BDFhuMT (Project showcase), section "Final
// Set" 2024:4825, frames in order, exported 2026-10-20 at 1x (2920×1642
// full width, 1440×1800 pairs), with the logo construction film second.
const greptile: CaseStudy = {
  slug: "greptile",
  title: "Greptile: YC W24 to $25M Series A in 6 Months",
  metaTitle: "Greptile Case Study - PIXELUP LABS",
  metaDescription:
    "How we evolved Greptile's AI code review platform into an enterprise-ready system, doubling demo requests in week one and helping set up a $25M Series A.",
  info: {
    client: "Greptile (AI code review platform)",
    year: "2025",
    involvement: ["Brand Identity", "Product Design", "Website", "Sales Decks"],
    links: [{ label: "greptile.com", href: "https://greptile.com" }],
  },
  description: [
    "We partnered with Greptile to evolve their **AI code review platform into an enterprise-ready system**.",
    "Greptile had YC backing and strong technology, but **gaps in product clarity and brand maturity** surfaced as they moved upmarket, where trust is non-negotiable.",
    "We treated the work as **a system design problem**: brand, product, website, and sales assets designed together, prioritizing clarity and trust at every touchpoint.",
    "The impact was immediate. **Demo requests doubled in week one**, and within six months Greptile raised **a $25M Series A at a $180M valuation** led by Benchmark.",
  ],
  // Frame 1.
  hero: {
    media: { type: "image", src: "/media/greptile/hero.avif" },
    alt: "Glowing green Greptile logo mark on a dark background",
    intrinsicSize: { width: 2920, height: 1642 },
  },
  story: {
    company: "Greptile",
    statusBadge: "YC W24 · Series B",
    // Non-breaking spaces keep "Six months" and "$25M Series A." whole, so
    // the full-width lines break at phrases.
    headline:
      "We rebuilt Greptile for enterprise. Six\u00a0months later, it raised a $25M\u00a0Series\u00a0A.",
    fullWidthHeadline: true,
    // Two of the legacy page's results rows, as the stat row at the top, with
    // the figure pulled out as the value (Arjun, 2026-10-20). The bugs row
    // is left out.
    highlights: [
      { value: "2×", label: "Demo requests immediately after launch" },
      {
        value: "$25M",
        label: "Series A raised at $180M valuation, led by Benchmark",
      },
    ],
    blocks: [
      {
        kind: "context",
        id: "context",
        heading:
          "Greptile had the technology enterprise teams needed, but not the trust signals.",
        items: [
          {
            label: "Where Greptile was",
            text: "Greptile had **YC backing, real technical depth and a product that could review complex codebases.**",
          },
          {
            label: "What it needed",
            text: "A system that could **explain the product quickly and feel credible to larger engineering teams.**",
          },
          {
            label: "What was not working",
            text: "The brand, website and product story felt fragmented. **Buyers had to connect the value for themselves.**",
          },
          {
            label: "Why it mattered",
            text: "As Greptile moved upmarket, **every unclear touchpoint added friction to a sale built on trust.**",
          },
        ],
      },
      // Second: the logo construction film (Dhruv, 2026-10-20). Each Motion
      // film on this page runs as its own HTML page (public/media/greptile,
      // built from the film's scenes), over its first frame or Figma still:
      // vector and far lighter than a video export. Every animation on this
      // page starts when it reaches the screen.
      {
        kind: "media",
        id: "snapshot-logo-construction",
        media: {
          kind: "full",
          slot: {
            media: {
              type: "image",
              src: "/media/greptile/logo-construction-poster.jpg",
            },
            alt: "Greptile's mark and wordmark drawn as vector outlines, each detail cut into its final shape",
            intrinsicSize: { width: 1920, height: 1080 },
            embed: "/media/greptile/logo-construction.html",
          },
        },
      },
      // Frame 2 (the wordmark animation) is hidden for now (Dhruv, 2026-10-20).
      // Restore it by uncommenting the block; its files stay in /public.
      // {
      //   kind: "media",
      //   id: "snapshot-wordmark",
      //   media: {
      //     kind: "full",
      //     slot: {
      //       media: { type: "image", src: "/media/greptile/wordmark.avif" },
      //       alt: "The greptile wordmark filled with code, beside a Greptile review comment flagging a check-then-set race",
      //       intrinsicSize: { width: 2920, height: 1642 },
      //       // Code drifting through the letters while Greptile flags lines:
      //       // the wordmark source animation (Dhruv, 2026-10-20), redrawn with
      //       // the frame's own wordmark outline, textures and colours.
      //       embed: "/media/greptile/wordmark.html",
      //     },
      //   },
      // },
      // Frame 3: the type and colour posters as their HTML animations, each
      // played over its Figma still. The pages add the greptile lockup the
      // stills carry and play from the start on each scroll-in.
      {
        kind: "media",
        id: "snapshot-type-colour",
        media: {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/greptile/review-poster.avif" },
              alt: "Greptile type poster reading 'review.', with review notes in Geist Mono down a line-numbered gutter",
              intrinsicSize: { width: 1440, height: 1800 },
              embed: "/media/greptile/review-poster.html",
            },
            {
              media: { type: "image", src: "/media/greptile/color-system.avif" },
              alt: "Greptile's colour system as blocks that resize into each other: #107A4D, #06281B, #3E5D50, #42C583, #AEECC6 and #C5D5CE",
              intrinsicSize: { width: 1440, height: 1800 },
              embed: "/media/greptile/color-system.html",
            },
          ],
        },
      },
      {
        kind: "challenge",
        id: "challenge-one",
        index: "01",
        heading: "Every touchpoint told a different Greptile story.",
        problem:
          "Greptile's technology had moved faster than the way the company presented itself. **Brand, website and sales materials each told a slightly different story.**",
        whyItMattered:
          "Enterprise buyers do not separate the product from the company behind it. **An inconsistent signal makes a capable platform feel like a risk.**",
        whatWeDid:
          "We rebuilt **the identity, positioning, website and sales system together.** Clarity, durability and trust became the filter for every decision.",
        outcome:
          "Greptile had **one coherent system for product, sales and investor conversations** instead of a set of disconnected deliverables.",
      },
      // Frame 4, with its own Figma motion: the dot-matrix strips drift and
      // flicker behind the card (Figma's keyframes, 6 s loop).
      {
        kind: "media",
        id: "snapshot-vibe-check",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/greptile/vibe-check.avif" },
            alt: "Greptile banner answering 'vibe coding?' with 'vibe check greptile.' over a dot-matrix lizard",
            intrinsicSize: { width: 2920, height: 1643 },
            embed: "/media/greptile/vibe-check.html",
          },
        },
      },
      // Frame 5, both posters with their own Figma motion (6 s loops), rebuilt
      // from their layers.
      {
        kind: "media",
        id: "snapshot-posters",
        media: {
          kind: "pair",
          slots: [
            {
              media: {
                type: "image",
                src: "/media/greptile/watches-every-line.avif",
              },
              alt: "Greptile poster reading 'watches every line.' above a lizard, with a review card: 'No line left unread. Safe to merge.'",
              intrinsicSize: { width: 1440, height: 1800 },
              embed: "/media/greptile/watches-every-line.html",
            },
            {
              media: { type: "image", src: "/media/greptile/grep-trust.avif" },
              alt: "Greptile terminal poster: '$ grep -r trust .' over a file list with a race condition flagged",
              intrinsicSize: { width: 1440, height: 1800 },
              embed: "/media/greptile/grep-trust.html",
            },
          ],
        },
      },
      {
        kind: "challenge",
        id: "challenge-two",
        index: "02",
        heading: "Buyers saw the complexity before they saw the value.",
        problem:
          "AI code review crosses repositories, code context and review workflows. **Showing all that complexity at once made the value harder to see.**",
        whyItMattered:
          "If a buyer could not understand the workflow quickly, **the demo had to explain the interface before it could prove the outcome.**",
        whatWeDid:
          "We **simplified the hierarchy, clarified key paths** and carried the same visual logic from the website into the product experience.",
        outcome:
          "After launch, **demo requests doubled in the first week** and the product story gave sales a clearer starting point.",
      },
      // Frame 6, played as the stats loop film.
      {
        kind: "media",
        id: "snapshot-results-eye",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/greptile/stats-eye.avif" },
            alt: "Greptile's results around a dot-matrix eye: 200% demo requests in week one, 180k+ bugs caught in month one, $25M Series A in month six",
            intrinsicSize: { width: 2920, height: 1643 },
            embed: "/media/greptile/stats-eye.html",
          },
        },
      },
      // Frame 7, its SDS cover played as the SDS film.
      {
        kind: "media",
        id: "snapshot-app-icon-sds",
        media: {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/greptile/app-icon.avif" },
              alt: "Greptile app icon: the white mark on a green tile",
              intrinsicSize: { width: 1440, height: 1800 },
            },
            {
              media: { type: "image", src: "/media/greptile/design-system.avif" },
              alt: "Cover of the Greptile SDS, its design system, over columns of code",
              intrinsicSize: { width: 1440, height: 1800 },
              // The SDS film: code rows scrolling behind the claw cut-out.
              embed: "/media/greptile/design-system.html",
            },
          ],
        },
      },
      // Frame 8.
      {
        kind: "media",
        id: "snapshot-subway",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/greptile/subway-poster.avif" },
            alt: "Greptile poster in a subway car: a halftone lizard above a sign-up strip with a QR code",
            intrinsicSize: { width: 2920, height: 1643 },
          },
        },
      },
      {
        kind: "results",
        id: "results",
        heading: "In their own words.",
      },
      // Daksh's Contra review, shared with the /call slider through
      // lib/testimonials.ts so the quote has one source. No heading: it sits
      // under the results block's heading as the result itself.
      {
        kind: "testimonial",
        id: "testimonial",
        quote: testimonials.greptile.quote,
        person: {
          name: testimonials.greptile.name,
          role: testimonials.greptile.role,
          company: testimonials.greptile.company,
          headshot: "/media/greptile/daksh-gupta.png",
        },
      },
      // Frame 9, played as the dashboard film: the UI builds on the tablet,
      // then keeps updating.
      {
        kind: "media",
        id: "snapshot-dashboard",
        media: {
          kind: "full",
          slot: {
            media: {
              type: "image",
              src: "/media/greptile/dashboard-tablet.avif",
            },
            alt: "Greptile dashboard on a tablet held in two hands: highlight of the week, comments per day, credit summary and monthly usage",
            intrinsicSize: { width: 2920, height: 1642 },
            embed: "/media/greptile/dashboard.html",
          },
        },
      },
      // Frames 2145 and 2179 (added 2026-10-20), stills: the mobile site and a
      // dashboard close-up.
      {
        kind: "media",
        id: "snapshot-phone-dashboard",
        media: {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/greptile/phone.avif" },
              alt: "Greptile's mobile site on a phone: a dot-matrix '</>' above its purpose line and a 'Try for free' button",
              intrinsicSize: { width: 1440, height: 1800 },
            },
            {
              media: { type: "image", src: "/media/greptile/dashboard-detail.avif" },
              alt: "Close-up of the Greptile dashboard: repositories with week-on-week change, and monthly usage as rows of green dots",
              intrinsicSize: { width: 1440, height: 1800 },
            },
          ],
        },
      },
      {
        kind: "afterLaunch",
        id: "after-launch",
        heading: "Then Greptile started sending other YC founders our way.",
        paragraphs: [
          "Beyond metrics, our work became **Greptile's internal standard** for how they present themselves across product, sales, and investor touchpoints.",
          "Greptile began **referring us to other YC founders**. One introduction turned into several, and this collaboration became the foundation for our long-term partnerships across the YC ecosystem.",
          "Today, we work closely with **multiple YC-backed teams**, helping them translate strong technology into clear, credible systems.",
        ],
        cta: {
          text: "Want to talk about your own brand?",
          label: "Book a call",
          href: "/call",
        },
      },
    ],
    faqHeading,
    faqs: pixelupFaq,
  },
  sections: [],
  endCta: {
    label: "Book a call",
    href: links.discoveryCall,
  },
  moreProjects: [
    { slug: "sainapse", tags: "Branding, Website & Motion Design" },
    { slug: "sully", tags: "Website & Motion Design" },
  ],
  publication: {
    status: "published",
    publishedDate: "2026-07-03",
    updatedDate: "2026-10-20",
  },
};

const sainapse: CaseStudy = {
  slug: "sainapse",
  title: "Sainapse: From Technical Product to Enterprise Standard",
  metaTitle: "Sainapse Case Study - PIXELUP LABS",
  metaDescription:
    "A full system rebuild for Sainapse's agentic AI support platform: brand voice, visual identity and web presence, designed together ahead of its GA launch.",
  info: {
    client: "Sainapse (AI Customer Support Platform)",
    year: "2025",
    involvement: ["Brand Identity", "Website Design", "Webflow Development"],
    links: [{ label: "sainapse.ai", href: "https://sainapse-staging.webflow.io/" }],
  },
  description: [
    "After seven years and 2M+ production tickets, Sainapse had proven technology, but a brand that couldn't keep pace. Their identity felt fragmented, technical, and hard to explain.",
    "As Sainapse neared general availability, enterprise buyers needed clarity and confidence that the platform was built to scale.",
    "We approached this as a complete system rebuild: brand voice, visual identity, and web presence designed together to communicate one truth, proof over promise. Every decision reinforced precision, traceability, and calm confidence.",
    "The result was a brand that finally matched the sophistication of the platform underneath.",
  ],
  hero: {
    media: { type: "video", src: "/media/sainapse.mp4" },
    alt: "Sainapse brand reveal motion loop",
    overlayLogo: "/media/sainapse.svg",
  },
  sections: [
    {
      heading: "How Did We Approach the Project?",
      lead: "We treated this as a credibility problem, not a cosmetics one.\nOur focus:",
      focus: [
        {
          title: "Proof over promise",
          sub: "Leading with outcomes and evidence, never novelty or hype",
        },
        {
          title: "Precision in language",
          sub: "Clear voice that speaks like a systems engineer, not marketer",
        },
        {
          title: "Trust at every touchpoint",
          sub: "Calm, evidence-first tone that balances momentum with reliability",
        },
        {
          title: "Unified system design",
          sub: "Brand, positioning, and web presence aligned into one coherent signal",
        },
      ],
      media: [
        {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/sainapse/img-1.png" },
              alt: "Sainapse brand color palette swatches from dark to lavender",
              tone: "white",
            },
            {
              media: { type: "image", src: "/media/sainapse/img-2.png" },
              alt: "Sainapse Ronzino type specimen with agentic explainable AI tagline",
              tone: "white",
            },
          ],
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/sainapse/img-3.png" },
            alt: "Sainapse Rethink Enterprise Intelligence brand film on a cinema screen",
          },
        },
      ],
    },
    {
      heading: "What Results Did Sainapse Achieve?",
      results: [
        {
          label: "Month 1:",
          text: "Supported 2M+ tickets in production post-launch",
        },
        {
          label: "Projection:",
          text: "On track to power 10M+ tickets by March 2026",
        },
        {
          label: "Impact:",
          text: "Up to 93% deflection achieved across enterprise deployments",
        },
        {
          label: "Adoption:",
          text: "Deployed by Fortune 500 companies including Ford, Avery Dennison, and Freshworks",
        },
      ],
      paragraphs: [
        "Beyond metrics, the rebrand became Sainapse's internal standard for how they present themselves across sales, product, and customer touchpoints.",
      ],
      media: [
        {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/sainapse/img-4.png" },
              alt: "Sainapse mobile website hero on a phone against red fabric",
            },
            {
              media: { type: "image", src: "/media/sainapse/img-5.png" },
              alt: "Sainapse AI customer support whitepaper booklets lying on sand",
            },
          ],
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/sainapse/img-6.png" },
            alt: "Sainapse website homepage on a laptop in tall grass",
          },
        },
      ],
    },
    {
      heading: "What Happened After Launch?",
      paragraphs: [
        "The website shifted from explaining what the product does to demonstrating why it works. Sales conversations moved from technical justification to strategic value.",
        "The brand system became the foundation for all customer-facing materials, from pitch decks to product documentation.",
      ],
      cta: {
        text: "Want to talk about your own brand?",
        label: "Book a call",
        href: "/call",
      },
      media: [
        {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/sainapse/img-7.png" },
              alt: "Sainapse enterprise customer support poster with moody surfer imagery",
            },
            {
              media: { type: "image", src: "/media/sainapse/img-8.png" },
              alt: "Sainapse Rethink Enterprise Intelligence tablet screen on a leather sofa",
            },
          ],
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/sainapse/img-9.png" },
            alt: "Sainapse Rethink Enterprise Intelligence framed billboard poster mockup",
          },
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/sainapse/img-10.png" },
            alt: "Sainapse dark product page on a tablet held in hands",
          },
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/sainapse/img-11.png" },
            alt: "Sainapse dark dashboard UI displayed on a desktop monitor",
          },
        },
      ],
    },
  ],
  moreProjects: [
    { slug: "sully", tags: "Website & Motion Design" },
    { slug: "greptile", tags: "Branding & Product Design" },
  ],
  publication: {
    status: "published",
    publishedDate: "2026-07-03",
    updatedDate: "2026-09-25",
  },
};

const sully: CaseStudy = {
  slug: "sully",
  title: "Sully: From Liability to Deal Closer in 11 Months",
  metaTitle: "Sully Case Study - PIXELUP LABS",
  metaDescription:
    "How we turned Sully's website into a deal closer with motion-driven explainers, alongside 26x scale and a $32M+ raise at a $150M valuation.",
  info: {
    client: "Sully (AI Healthcare Platform)",
    year: "2025",
    involvement: [
      "Website Design",
      "Product Pages",
      "Motion Design",
      "Framer Development",
    ],
    links: [{ label: "sully.ai", href: "https://sully.ai" }],
  },
  description: [
    "Sully grew from $0.5M to $5M ARR in 9 months, but their website wasn't keeping up.",
    "Enterprise buyers found an outdated site that didn't match the product, a liability when closing $15M+ hospital contracts.",
    "Every page, motion sequence, and explainer was built to help hospital executives grasp complex AI workflows before the demo.",
    "One explainer page helped close a major enterprise contract. Within 11 months, Sully scaled 26x and raised $32M+ at a $150M valuation.",
  ],
  hero: {
    media: { type: "image", src: "/media/sully.jpg" },
    alt: "Sully.ai homepage hero on a laptop mockup, website design by PIXELUP LABS",
  },
  sections: [
    {
      heading: "How Did We Approach the Project?",
      lead: "We treated this as a sales enablement problem, not a website redesign.\nOur focus:",
      focus: [
        {
          title: "Show, don't tell",
          sub: "Motion-driven explainers that demonstrate how AI agents work in real workflows",
        },
        {
          title: "Enterprise clarity",
          sub: "Hospital executives don't read walls of text; they need visual stories",
        },
        {
          title: "Consistent brand system",
          sub: "Unified design language across all touchpoints",
        },
      ],
      media: [
        {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/sully/img-1.png" },
              alt: "Sully.ai autonomous care network diagram on a floating tablet",
            },
            {
              media: { type: "image", src: "/media/sully/img-2.png" },
              alt: "Sully.ai AI Receptionist features page on a laptop",
            },
          ],
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/sully/img-3.png" },
            alt: "Sully.ai homepage hero projected on stage before an audience",
          },
        },
      ],
    },
    {
      heading: "What Results Did Sully Achieve?",
      results: [
        {
          label: "Immediate:",
          text: "Website became a sales asset, deals that stalled started moving",
        },
        {
          label: "Month 1:",
          text: "One concept explainer page directly closed a major enterprise contract",
        },
        {
          label: "Month 11:",
          text: "Scaled 26x, adding 20M+ minutes to healthcare workforce capacity",
        },
        { label: "Funding:", text: "Raised $32M+ total at $150M valuation" },
      ],
      paragraphs: [
        "Beyond metrics, the website became Sully's standard for how they present complex AI workflows to enterprise buyers.",
      ],
      media: [
        {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/sully/img-4.png" },
              alt: "Sully.ai mobile homepage held in a hand against blue sky",
            },
            {
              media: { type: "image", src: "/media/sully/img-5.png" },
              alt: "Sully.ai appointments booking product page on a dark laptop",
            },
          ],
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/sully/img-6.png" },
            alt: "Sully.ai scribes-versus-dictation comparison page on a laptop",
          },
        },
      ],
    },
    {
      heading: "What Happened After Launch?",
      paragraphs: [
        "Enterprise buyers began understanding the product before demos started. Sales conversations shifted from explaining workflows to discussing implementation.",
        "The motion-driven pages became internal references for how Sully communicates product value across all channels.",
      ],
      cta: {
        text: "Want to talk about your own brand?",
        label: "Book a call",
        href: "/call",
      },
      media: [
        {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/sully/img-7.png" },
              alt: "Sully.ai hospital impact stats page on a laptop",
            },
            {
              media: { type: "image", src: "/media/sully/img-8.png" },
              alt: "Sully.ai clinical co-pilot mobile screen on a leather chair",
            },
          ],
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/sully/img-9.png" },
            alt: "Sully.ai Partner with Sully Labs page on a phone",
          },
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/sully/img-10.png" },
            alt: "Sully.ai EPIC and EHR integrations explainer page on a laptop",
            tone: "white",
          },
        },
      ],
    },
  ],
  moreProjects: [
    { slug: "greptile", tags: "Branding & Product Design" },
    { slug: "sainapse", tags: "Branding, Website & Motion Design" },
  ],
  publication: {
    status: "published",
    publishedDate: "2026-07-03",
    updatedDate: "2026-09-25",
  },
};

// Shared by the hero highlights and the Results block so the two never drift.
const streamlineMetrics: CaseMetric[] = [
  { value: "40+", label: "Unique page designs" },
  { value: "200+", label: "Pages on one system" },
  { value: "100+", label: "Touchpoints" },
  { value: "F500", label: "Enterprise conversations" },
];

const streamline: CaseStudy = {
  slug: "streamline",
  title:
    "We repositioned Streamline for enterprise, then scaled the brand across 200 pages.",
  metaTitle: "Streamline Case Study - PIXELUP LABS",
  metaDescription:
    "PIXELUP LABS repositioned Streamline for enterprise legal teams and built a brand, website and design system that scaled across more than 200 pages.",
  info: {
    client: "Streamline (AI Platform for Legal Operations)",
    year: "2026",
    involvement: [
      "Brand Identity",
      "Positioning",
      "Website Design",
      "Design System",
      "Webflow Development",
    ],
    links: [{ label: "streamline.ai", href: "https://www.streamline.ai/" }],
  },
  description: [
    "Streamline AI had built a product capable of serving enterprise legal teams, but its brand and website reflected an earlier stage of the company.",
    "The product had evolved significantly, but the website had not. Newer competitors with less capable products appeared more credible simply because they presented themselves better online.",
    "As they prepared to expand into larger enterprise accounts and launch a new PR initiative, we partnered with them to reposition the business as the modern AI platform for legal operations.",
    "This project was about aligning the company's digital presence with the quality of the product they had already built.",
  ],
  hero: {
    media: { type: "image", src: "/media/streamline.png" },
    alt: "Streamline serif wordmark over a collage of legal AI product cards with a woman working at a desk",
  },
  story: {
    company: "Streamline",
    statusBadge: "Series A · Legal AI",
    headline:
      "We repositioned Streamline for enterprise, then scaled the brand across 200 pages.",
    summary:
      "Streamline was growing fast. The product was getting better, the company was moving into bigger accounts, and the old brand no longer fit. So we rebuilt it and made sure it could work across 100+ marketing, GTM and product touchpoints.",
    highlights: streamlineMetrics,
    blocks: [
      {
        kind: "context",
        id: "context",
        heading: "Why the old brand was no longer a good fit.",
        items: [
          {
            label: "Where Streamline was",
            text: "Streamline had a mature AI platform built for enterprise legal teams. The product was getting better and the company was moving into bigger accounts.",
          },
          {
            label: "What the market looked like",
            text: "When we looked at the competition, some newer competitors simply looked more modern, more credible and more enterprise-ready.",
          },
          {
            label: "How we found the gap",
            text: "We went deep into the business: a brand workshop with the team, a study of the competitive landscape, a map of their buyers, and time spent understanding the product.",
          },
          {
            label: "Why it mattered",
            text: "The gap became obvious. Their brand system was holding them back, and that mattered even more because Streamline was selling to Chief Legal Officers, General Counsels, legal ops teams and legal teams inside large companies.",
          },
        ],
      },
      {
        kind: "media",
        id: "snapshot-collage",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/streamline/img-5.png" },
            alt: "Streamline website collage with desktop homepage, mobile mockup, and integration tiles",
          },
        },
      },
      {
        kind: "media",
        id: "snapshot-modern-legal",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/streamline/img-2.png" },
            alt: "Streamline 'Built for how modern legal teams work' website section on a green textured background",
          },
        },
      },
      {
        kind: "challenge",
        id: "challenge-one",
        index: "01",
        heading: "Our first instinct was to make Streamline much bolder.",
        problem:
          "If the old brand was underselling the product, the new one needed to make a much stronger statement. So we explored three creative directions: more colour, more gradients, more conceptual imagery, more personality.",
        whyItMattered:
          "After the first round of feedback, we realised we had pushed too far. The new directions felt modern, but they no longer looked like a company built for enterprise legal teams. They were not lawyer-like.",
        whatWeDid:
          "The answer was not to make Streamline as different as possible. It was to make them feel modern without losing the trust their buyers expected. The question changed from how bold we could make Streamline to how modern we could make it without losing the maturity the product already had. The brief became: legal-tech serious, modern flavour.",
        outcome:
          "That principle guided every decision from there. Royal blue became the primary colour and leaf green the secondary. Neutrals did a lot of the work. Product and illustration supported the copy instead of overpowering it, and gradients and textures stayed but became more subtle.",
      },
      {
        kind: "media",
        id: "snapshot-brand",
        media: {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/streamline/img-3.png" },
              alt: "Streamline document knowledge graph and Slack AI conversation cards on a green glass background",
            },
            {
              media: { type: "image", src: "/media/streamline/img-4.png" },
              alt: "Streamline mobile integrations screen 'We work where your team already works'",
            },
          ],
        },
      },
      {
        kind: "media",
        id: "snapshot-integrations",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/streamline/img-6.png" },
            alt: "Streamline integrations strip with Ironclad, Microsoft Teams, Slack, Salesforce, Jira, and DocuSign",
            tone: "white",
          },
        },
      },
      {
        kind: "challenge",
        id: "challenge-two",
        index: "02",
        heading: "Getting the brand right was only half the job.",
        problem:
          "Finding the right visual direction solved the perception problem. The next challenge was making it work across the entire website and every marketing touchpoint.",
        whyItMattered:
          "Streamline did not need a five-page marketing site. The project grew to 40+ unique page designs, with the system extending across 200+ pages. A page written for a General Counsel had to tell a completely different story from an AI Contract Review page.",
        whatWeDid:
          "We turned the brand into a design system: reusable components, page structures, product templates, design rules and an illustration system that could stretch across the whole website. The illustrations had to support dozens of different ideas without making every page feel disconnected.",
        outcome:
          "By this point we were not just designing a new brand. We were building a system Streamline could keep using as the company grew.",
      },
      {
        kind: "gallery",
        id: "gallery-system",
        heading: "One system, 200+ pages.",
        intro:
          "Product, feature, industry, team and resource pages all run on the same components, so a General Counsel page and an AI Contract Review page can tell different stories without looking like different companies.",
        media: [
          {
            kind: "full",
            slot: {
              media: { type: "image", src: "/media/streamline/img-7.png" },
              alt: "Streamline 'Built for how modern legal teams work' team page on a tablet held in hands",
            },
          },
          {
            kind: "full",
            slot: {
              media: { type: "image", src: "/media/streamline/img-8.png" },
              alt: "Streamline resources section 'Insight for legal operations leaders' on a green background",
            },
          },
        ],
      },
      {
        kind: "results",
        id: "results",
        heading: "Results",
        metrics: streamlineMetrics,
      },
      {
        kind: "media",
        id: "snapshot-homepage",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/streamline/img-1.png" },
            alt: "Streamline homepage hero 'In-house legal runs on Streamline' on a tablet held in hands",
          },
        },
      },
      {
        kind: "afterLaunch",
        id: "after-launch",
        heading: "And this is where Streamline ended up.",
        paragraphs: [
          "Streamline had much more than a new homepage. They had a brand that finally matched the maturity of the product behind it, a design system that could extend across all the touchpoints, and a website built around the perception they needed with enterprise legal buyers.",
          "After launch, the team also reported positive customer feedback and stronger enterprise conversations, including with Fortune 500 companies. You can see the live site at streamline.ai.",
          "We work with AI and B2B SaaS teams on brand, web and product design, helping them move upmarket.",
        ],
        cta: {
          text: "If you recognised Streamline's problem in your own company,",
          label: "book a call",
          href: "/call",
        },
      },
      {
        kind: "media",
        id: "snapshot-laptop",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/streamline/img-9.png" },
            alt: "Streamline resources page on a laptop resting on a stone slab",
          },
        },
      },
    ],
    faqHeading,
    faqs: pixelupFaq,
  },
  endCta: {
    label: "Book a call",
    href: links.discoveryCall,
  },
  sections: [
    {
      heading: "How Did We Approach the Project?",
      lead: "We focused on understanding the business before the visuals.\nOur focus:",
      focus: [
        {
          title: "Aligning on the future",
          sub: "Brand strategy anchored to the long-term vision",
        },
        {
          title: "Understanding the competitive landscape",
          sub: "Finding where competitors won on perception alone",
        },
        {
          title: "Building the positioning",
          sub: "Clear messaging, differentiators, and buyer personas",
        },
        {
          title: "Designing a scalable system",
          sub: "One brand system powering hundreds of pages",
        },
      ],
      media: [
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/streamline/img-5.png" },
            alt: "Streamline website collage with desktop homepage, mobile mockup, and integration tiles",
          },
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/streamline/img-2.png" },
            alt: "Streamline 'Built for how modern legal teams work' website section on a green textured background",
          },
        },
      ],
    },
    {
      heading: "What Results Did Streamline Achieve?",
      results: [
        {
          label: "Launch:",
          text: "Refreshed brand shipped with the PR initiative",
        },
        {
          label: "Customers:",
          text: "Positive feedback on the new experience",
        },
        {
          label: "Pipeline:",
          text: "Stronger enterprise and Fortune 500 conversations",
        },
        {
          label: "Scale:",
          text: "One design system across 200+ pages",
        },
      ],
      paragraphs: [
        "The redesign was not just a visual update. It gave Streamline a digital presence that reflected the maturity of its product and supported its move toward larger enterprise customers.",
      ],
      media: [
        {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/streamline/img-3.png" },
              alt: "Streamline document knowledge graph and Slack AI conversation cards on a green glass background",
            },
            {
              media: { type: "image", src: "/media/streamline/img-4.png" },
              alt: "Streamline mobile integrations screen 'We work where your team already works'",
            },
          ],
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/streamline/img-1.png" },
            alt: "Streamline homepage hero 'In-house legal runs on Streamline' on a tablet held in hands",
          },
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/streamline/img-6.png" },
            alt: "Streamline integrations strip with Ironclad, Microsoft Teams, Slack, Salesforce, Jira, and DocuSign",
            tone: "white",
          },
        },
      ],
    },
    {
      heading: "What Happened After Launch?",
      paragraphs: [
        "The website became more than a marketing asset. Using a shared design system, we rebuilt over 200 pages across product, feature, industry, team, and resource sections while maintaining consistency throughout the experience.",
        "As the product continues to evolve, the team now has a scalable foundation that supports future launches, new messaging, and ongoing growth without needing to redesign the website from scratch.",
      ],
      media: [
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/streamline/img-7.png" },
            alt: "Streamline 'Built for how modern legal teams work' team page on a tablet held in hands",
          },
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/streamline/img-8.png" },
            alt: "Streamline resources section 'Insight for legal operations leaders' on a green background",
          },
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/streamline/img-9.png" },
            alt: "Streamline resources page on a laptop resting on a stone slab",
          },
        },
      ],
    },
  ],
  moreProjects: [
    { slug: "greptile", tags: "Branding & Product Design" },
    { slug: "sully", tags: "Website & Motion Design" },
  ],
  publication: {
    status: "published",
    publishedDate: "2026-08-07",
    updatedDate: "2026-09-25",
  },
};

const henryLabs: CaseStudy = {
  slug: "henrylabs",
  title:
    "We built the Henry Labs brand, then carried it across every touchpoint.",
  metaTitle: "Henry Labs Case Study - PIXELUP LABS",
  metaDescription:
    "PIXELUP LABS built the brand, website, partner dashboard and checkout for Henry Labs, a founding member of the Agentic Commerce Consortium.",
  info: {
    client: "Henry Labs",
    year: "2026",
    involvement: [
      "Positioning",
      "Brand",
      "Website",
      "Product",
      "Webflow Development",
    ],
    funding: "Private",
    links: [
      { label: "henrylabs.ai", href: "https://www.henrylabs.ai/" },
      { label: "@henrylabs on X", href: "https://x.com/henrylabs" },
    ],
  },
  description: [
    "Henry Labs is building the checkout layer for agentic commerce.",
    "They brought us in for the brand. Then we got into the product and the job got bigger.",
    "We ended up designing the website, partner dashboard, consumer checkout and the design system used across them.",
    "Here is the work.",
  ],
  hero: {
    media: {
      type: "video",
      src: "/media/henry-labs/hero.mp4",
      poster: "/media/henry-labs/hero-poster.jpg",
    },
    alt: "Henry Labs brand film showing the new identity across posters and brand applications",
  },
  story: {
    company: "Henry Labs",
    statusBadge: "Agentic commerce · Checkout",
    headline:
      "We built the Henry Labs brand, then carried it across every touchpoint.",
    summary:
      "Henry Labs builds the checkout layer for agentic commerce, used by AI shopping apps like Price.com and Aesthetic. Its one-click checkout was **cited by Visa** in December 2025, and it is a **founding member of the Agentic Commerce Consortium**, alongside Rye, Crossmint and Lithic.",
    blocks: [
      {
        kind: "context",
        id: "context",
        heading: "Why the brand was behind the company.",
        items: [
          {
            label: "Where Henry Labs was",
            text: "Henry Labs builds checkout for AI shopping apps. **Visa had already cited their one-click checkout**, and they were a **founding member of the Agentic Commerce Consortium**.",
          },
          {
            label: "What the market looked like",
            text: "Agentic commerce was filling up fast with startups that all sounded the same. Platforms choosing a checkout partner **could not tell them apart**.",
          },
          {
            label: "How we found the gap",
            text: "A competitor analysis and a product deep dive showed what Henry Labs really sells: **an SDK platforms build on, not a shopping app**.",
          },
          {
            label: "Why it mattered",
            text: "Platforms trust Henry Labs with their transactions and revenue. The company had earned that trust. **The brand still looked early-stage.**",
          },
        ],
      },
      {
        kind: "media",
        id: "snapshot-landscape",
        media: {
          kind: "full",
          aspect: "wide",
          slot: {
            media: { type: "image", src: "/media/henry-labs/64.avif" },
            alt: "Henry Labs wordmark over a blue and orange mountain landscape",
          },
        },
      },
      {
        kind: "media",
        id: "snapshot-posters",
        media: {
          kind: "full",
          aspect: "wide",
          slot: {
            media: { type: "image", src: "/media/henry-labs/65.avif" },
            alt: "Henry Labs positioning posters using the mountain imagery and angular brand mark",
          },
        },
      },
      {
        kind: "challenge",
        id: "challenge-one",
        index: "01",
        heading: "Shoppers see the Henry button. Platforms sign the contract.",
        problem:
          "Shoppers meet Henry Labs as a checkout button. Platforms meet it as infrastructure they trust with revenue. A shopper-first brand would look **forgettable to the actual buyer**.",
        whyItMattered:
          "The founders wanted **ethereal and technical, not consumer**. Too soft reads like a shopping app. Too cold looks like every payments API.",
        whatWeDid:
          "We designed **for the platform buyer first**. Landscape imagery and a sunset palette carried the ethereal. Precise type, grids and real product UI carried the technical.",
        outcome:
          "One identity **quiet enough to sit inside another company's checkout**, and **serious enough for a partner pitch**.",
      },
      {
        kind: "media",
        id: "snapshot-execution-layer",
        media: {
          kind: "full",
          aspect: "wide",
          slot: {
            media: { type: "image", src: "/media/henry-labs/66.avif" },
            alt: "Henry Labs execution layer positioning beside an illuminated shopping cart",
          },
        },
      },
      {
        kind: "media",
        id: "snapshot-conference",
        media: {
          kind: "full",
          aspect: "wide",
          slot: {
            media: { type: "image", src: "/media/henry-labs/58.avif" },
            alt: "Henry Labs identity and positioning presented on a large conference screen",
          },
        },
      },
      {
        kind: "challenge",
        id: "challenge-two",
        index: "02",
        heading: "Then the brand project turned into a product project.",
        problem:
          "A month into the brand work, Henry Labs **asked us to design the product too**: checkout and the partner dashboard, in a four-week sprint.",
        whyItMattered:
          "Partners wanted sales, traffic and referrals at a glance. **The old dashboard buried all three.** Shoppers just wanted to buy.",
        whatWeDid:
          "We mapped both personas, audited the checkout flow and **designed checkout first, handing it to their engineers mid-sprint**.",
        outcome:
          "**One design system, two hierarchies.** Partners see revenue first. Shoppers see their cart.",
      },
      {
        kind: "media",
        id: "snapshot-personas",
        media: {
          kind: "full",
          slot: {
            media: {
              type: "image",
              src: "/media/henry-labs/figjam-user-personas.png",
            },
            alt: "Henry Labs FigJam research board mapping partner and shopper personas",
            intrinsicSize: { width: 5594, height: 3062 },
          },
        },
      },
      {
        kind: "media",
        id: "snapshot-checkout-flow",
        media: {
          kind: "full",
          slot: {
            media: {
              type: "image",
              src: "/media/henry-labs/figjam-checkout-flow.png",
            },
            alt: "Henry Labs FigJam board mapping the audited checkout and shopper flows",
            intrinsicSize: { width: 5594, height: 3062 },
          },
        },
      },
      {
        kind: "gallery",
        id: "gallery-system",
        heading: "One brand, three products.",
        intro:
          "The website, partner dashboard and consumer checkout all run on **the same design system**, so a shopper at checkout and a partner checking revenue are looking at the same company. The website tells the story in the order a buyer needs it: product data, universal cart, embedded checkout, then the analytics that come after.",
        media: [
          {
            kind: "full",
            aspect: "wide",
            slot: {
              media: { type: "image", src: "/media/henry-labs/asset-2.avif" },
              alt: "Henry Labs website hero 'Own your checkout.' over a glowing mountain landscape",
            },
          },
          {
            kind: "full",
            aspect: "wide",
            slot: {
              media: {
                type: "image",
                src: "/media/henry-labs/frame-2147244046.avif",
              },
              alt: "Henry Labs website displayed on a laptop against a black and silver landscape",
            },
          },
          {
            kind: "full",
            aspect: "wide",
            slot: {
              media: {
                type: "image",
                src: "/media/henry-labs/frame-2147244048.avif",
              },
              alt: "Henry Labs mobile features section on a phone framed by a torn chain-link fence",
            },
          },
          {
            kind: "full",
            slot: {
              media: { type: "image", src: "/media/henry-labs/70.avif" },
              alt: "Henry Labs website feature section for building, monetizing and optimizing agentic commerce",
            },
          },
        ],
      },
      {
        kind: "results",
        id: "results",
        heading: "In their own words.",
      },
      // Faaris's public Contra review, shared with the /call slider through
      // lib/testimonials.ts so the quote has one source. No heading: it sits
      // under the results block's heading as the result itself.
      {
        kind: "testimonial",
        id: "testimonial",
        quote: testimonials.henrylabs.quote,
        person: {
          name: testimonials.henrylabs.name,
          role: testimonials.henrylabs.role,
          company: testimonials.henrylabs.company,
          headshot: "/media/henry-labs/faaris-hussain.jpg",
        },
      },
      {
        kind: "media",
        id: "snapshot-work-wall",
        media: {
          kind: "full",
          aspect: "wide",
          slot: {
            media: { type: "image", src: "/media/henry-labs/68.avif" },
            alt: "Henry Labs brand posters, positioning and website screens shown as one work wall",
          },
        },
      },
      // Allowance figures: Philip Qiu's public LinkedIn posts.
      {
        kind: "afterLaunch",
        id: "after-launch",
        heading: "And this is where Henry Labs ended up.",
        paragraphs: [
          "Henry Labs now has a brand that **looks as serious as the infrastructure behind it**, a website that explains the product in the order buyers need it, and a design system its engineers build on directly.",
          "The website went live in May 2026, and the checkout and dashboard were built in-house from our designs. Henry Labs CEO Phil Qiu shared it with one line: \"**We wanted a landing page that actually feels like that future rather than explaining it.**\" By September, Henry Labs was powering Allowance (YC P26), which went from **9 to 90 stores in two weeks**. You can see the live site at henrylabs.ai.",
          "We work with AI and B2B SaaS teams on brand, web and product design, helping them look as credible as the product they have built.",
        ],
        cta: {
          text: "If you recognised Henry Labs' problem in your own company,",
          label: "book a call",
          href: "/call",
        },
      },
      {
        kind: "media",
        id: "snapshot-closing",
        media: {
          kind: "pair",
          aspect: "wide",
          slots: [
            {
              media: { type: "image", src: "/media/henry-labs/asset-1.avif" },
              alt: "Henry Labs mobile website and brand mark over the launch landscape",
            },
            {
              media: {
                type: "image",
                src: "/media/henry-labs/frame-2147244047.avif",
              },
              alt: "Henry Labs website use cases displayed on a laptop against an orange landscape",
            },
          ],
        },
      },
    ],
    faqHeading,
    faqs: pixelupFaq,
  },
  introMedia: [
    {
      kind: "full",
      aspect: "wide",
      slot: {
        media: { type: "image", src: "/media/henry-labs/64.avif" },
        alt: "Henry Labs wordmark over a blue and orange mountain landscape",
      },
    },
  ],
  sections: [
    {
      heading: "You do not hand checkout to a company you do not trust.",
      paragraphs: [
        "That is the real design problem with Henry Labs.",
        "A platform is trusting Henrylabs with the transaction, the customer data and a piece of its revenue. A nice logo was not going to be enough.",
        "The company needed to look as serious as the infrastructure it was building. So we learnt the product, mapped the category and built the identity from there.",
      ],
      media: [
        {
          kind: "full",
          aspect: "wide",
          slot: {
            media: { type: "image", src: "/media/henry-labs/65.avif" },
            alt: "Henry Labs positioning posters using the mountain imagery and angular brand mark",
          },
        },
        {
          kind: "full",
          aspect: "wide",
          slot: {
            media: { type: "image", src: "/media/henry-labs/66.avif" },
            alt: "Henry Labs execution layer positioning beside an illuminated shopping cart",
          },
        },
      ],
    },
    {
      heading: "Kill the redirect. Own the checkout.",
      paragraphs: [
        "Henry Labs takes a shopper from discovery to cart to payment without sending them to another website.",
        "That was the website story. Not a long explanation of commerce infrastructure.",
        "We wrote and designed the page around the actual flow: product data, universal cart, embedded checkout and the analytics that come after. The product is technical. The pitch did not need to be.",
      ],
      media: [
        {
          kind: "full",
          aspect: "wide",
          slot: {
            media: { type: "image", src: "/media/henry-labs/58.avif" },
            alt: "Henry Labs identity and positioning presented on a large conference screen",
          },
        },
        {
          kind: "full",
          aspect: "wide",
          slot: {
            media: {
              type: "image",
              src: "/media/henry-labs/frame-2147244046.avif",
            },
            alt: "Henry Labs website displayed on a laptop against a black and silver landscape",
          },
        },
      ],
    },
    {
      heading: "Nobody opens a dashboard to hunt for data.",
      paragraphs: [
        "Henrylabs' partners opened the product to answer three questions.",
        "How much did we sell? How much traffic came through? Who sent it?",
        "The old dashboard buried sales, traffic and referrals. We helped plan the roadmap and designed V1 around putting those answers first.",
      ],
      media: [
        {
          kind: "full",
          slot: {
            media: {
              type: "image",
              src: "/media/henry-labs/figjam-user-personas.png",
            },
            alt: "Henry Labs FigJam research board mapping partner and shopper personas",
            intrinsicSize: { width: 5594, height: 3062 },
          },
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/henry-labs/70.avif" },
            alt: "Henry Labs website feature section for building, monetizing and optimizing agentic commerce",
          },
        },
      ],
    },
    {
      heading: "The partner was not the shopper.",
      paragraphs: [
        "Partners wanted to know if Henrylabs was making them money.",
        "Shoppers wanted to buy something without thinking about the infrastructure making it possible.",
        "So we designed the dashboard for one job and the checkout for the other. The type, components and interaction rules stayed consistent, but the hierarchy changed with the user.",
      ],
      media: [
        {
          kind: "full",
          slot: {
            media: {
              type: "image",
              src: "/media/henry-labs/figjam-checkout-flow.png",
            },
            alt: "Henry Labs FigJam board mapping the audited checkout and shopper flows",
            intrinsicSize: { width: 5594, height: 3062 },
          },
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/henry-labs/69.avif" },
            alt: "Henry Labs website call to action asking visitors to own their checkout",
          },
        },
      ],
    },
    {
      heading: "What we shipped",
      bullets: [
        "Brand identity and positioning",
        "Website copy, design and build",
        "GTM and brand assets",
        "Partner dashboard",
        "Consumer checkout",
        "Product roadmap and design system",
        "Motion and showcase video",
      ],
      media: [
        {
          kind: "full",
          aspect: "wide",
          slot: {
            media: { type: "image", src: "/media/henry-labs/68.avif" },
            alt: "Henry Labs brand posters, positioning and website screens shown as one work wall",
          },
        },
      ],
    },
  ],
  closing: {
    heading:
      "The brand got us in the door. The product became most of the job.",
    paragraphs: [
      "By the end, the website, dashboard and checkout finally looked like they came from the same company.",
      "Brand, website and product by PIXELUP LABS. 2026.",
    ],
    media: [
      {
        kind: "pair",
        aspect: "wide",
        slots: [
          {
            media: { type: "image", src: "/media/henry-labs/asset-1.avif" },
            alt: "Henry Labs mobile website and brand mark over the launch landscape",
          },
          {
            media: {
              type: "image",
              src: "/media/henry-labs/frame-2147244047.avif",
            },
            alt: "Henry Labs website use cases displayed on a laptop against an orange landscape",
          },
        ],
      },
    ],
  },
  endCta: {
    label: "Book a call",
    href: links.discoveryCall,
  },
  moreProjects: [
    { slug: "streamline", tags: "Branding, positioning & website design" },
    { slug: "fuseai", tags: "Branding, website & product design" },
  ],
  publication: {
    status: "published",
    publishedDate: "2026-08-17",
    updatedDate: "2026-10-07",
    blockers: [
      'Funding reads "Private": confirm a figure directly with Henry Labs before publishing one.',
      "Add two approved Slack reactions with names and roles.",
      "Confirm which dashboard and checkout screens can be public.",
      "Add a measurable result only if Henry Labs approves the claim.",
    ],
  },
};

// Answers the page's target prompt ("who designed FuseAI's brand"), so it
// leads the FuseAI FAQ ahead of the shared questions.
const fuseaiFaq: FaqItem = {
  q: "Who designed FuseAI's brand, website and product?",
  a: "PIXELUP LABS designed FuseAI's brand refresh, website and product UI in 2026. The brand was ready for FuseAI's August launch 17 days after kickoff. The website (10+ pages) went live six weeks after the first design round, with the product UI days behind it. FuseAI's own team built the website in Framer and the product in code, and FuseAI reports free-to-paid trial conversion 20% higher since the redesign.",
};

// Copy: Growth/SEO-AEO/Article Writing Workspace/pipeline/drafts/fuseai-case-study.md
// (approved 2026-10-16). Saurav's quotes, the 20% and the customer-feedback
// line are his answers to our case-study questions in #fuseai-pixelup (10 and
// 12 Oct 2026), OK'd for use with his name.
const fuseai: CaseStudy = {
  slug: "fuseai",
  title: "We rebranded FuseAI for their next stage of growth.",
  metaTitle: "FuseAI Brand, Website and Product Design | PIXELUP LABS",
  metaDescription:
    "PIXELUP LABS designed FuseAI's brand, website and product UI in 2026. The brand was launch-ready in 17 days. FuseAI reports 20% higher trial conversion.",
  info: {
    client: "FuseAI",
    year: "2026",
    // FuseAI's team built the site (Framer) and product (code), so design
    // disciplines only.
    involvement: [
      "Brand Identity",
      "Website Design",
      "Product Design",
      "Motion Design",
    ],
    links: [{ label: "fuseai.com", href: "https://fuseai.com/" }],
  },
  description: [
    "PIXELUP LABS designed FuseAI's brand, website and product UI in 2026.",
    "FuseAI, a YC W25 AI sales platform, had one launch date and three things to redesign.",
    "The brand was ready on launch day, 17 days after kickoff. The website went live six weeks after the first design round, with the product UI days behind it.",
    "FuseAI now reports free-to-paid trial conversion 20% higher.",
  ],
  hero: {
    media: { type: "image", src: "/media/fuseai/logo-wall.avif" },
    alt: "FuseAI's two-stripe mark on a concrete wall",
  },
  story: {
    company: "FuseAI",
    statusBadge: "YC W25 · AI sales",
    headline: "We rebranded FuseAI for their next stage of growth.",
    // Founder backgrounds: FuseAI's YC company page, read 2026-10-16.
    summary:
      "FuseAI builds an **AI-native sales platform for modern revenue teams**, backed by Y Combinator (W25). Co-founder and CEO Saurav Bubber worked on GTM strategy and operations at Deel while it grew from $50M to $600M+ ARR. Co-founder and CTO Imogen Low co-founded Nwo.ai, later acquired by Growth Protocol.",
    // The 20% is Saurav's figure (12 Oct 2026). 6 weeks runs from the first
    // design round (27 Jul) to the website going live (9 Sep), as the sidebar
    // says; from kickoff (24 Jul) it's closer to seven, so never pair the two.
    highlights: [
      { value: "20%", label: "Higher free-to-paid trial conversion" },
      { value: "6 weeks", label: "Brand, website and product redesign" },
    ],
    blocks: [
      {
        kind: "context",
        id: "context",
        heading: "Why did FuseAI need a brand refresh?",
        items: [
          {
            label: "Where FuseAI was",
            text: "FuseAI was heading into an August launch with a brand that wasn't ready for it. In Saurav Bubber's words: **\"We didn't have a design we liked.\"**",
          },
          {
            // 21 = the -vs-fuse pages in fuseai.com/sitemap.xml, 2026-10-16.
            label: "What FuseAI asks its buyers to do",
            text: "Switch. FuseAI wants revenue teams to replace the data, enrichment and outreach tools they already pay for with **one platform run by AI agents**. Its site runs head-to-head pages against 21 sales tools, Apollo and ZoomInfo among them.",
          },
          {
            label: "What they asked us for",
            text: "A brand refresh that could keep up with their growth, plus a website and the product restyled before launch. The brief came down to three references: **F1 feel, Granola warmth, Superhuman speed.**",
          },
          {
            label: "Why it mattered",
            text: "A sales team that switches platforms bets its quota on the new one. **Nobody makes that bet on a product that looks unfinished.**",
          },
        ],
      },
      // Mockups: Growth/Case studies/Fuse/visuals (Figma: Project showcase).
      // Logo first, then branding, then website and product. Each pair shares
      // one aspect ratio so the heights match.
      // The mark drawing itself on its construction grid: Arjun's refined
      // HTML/SVG loop (2026-10-20), embedded over its finished frame as the
      // still. It starts once 10% of it is in view, loops, and resets to its
      // first frame once it's fully out of view (Arjun, 2026-10-20).
      {
        kind: "media",
        id: "snapshot-logo",
        media: {
          kind: "full",
          slot: {
            media: {
              type: "image",
              src: "/media/fuseai/logo-grid-poster.png",
            },
            alt: "FuseAI's two-stripe mark drawing itself on its construction grid",
            intrinsicSize: { width: 1920, height: 1080 },
            embed: "/media/fuseai/logo-grid.html",
            embedPlayAt: 0.1,
          },
        },
      },
      {
        kind: "media",
        id: "snapshot-stationery",
        media: {
          kind: "pair",
          slots: [
            {
              media: {
                type: "image",
                src: "/media/fuseai/business-cards.avif",
              },
              alt: "FuseAI business cards in mint and white",
              intrinsicSize: { width: 1080, height: 1350 },
            },
            {
              media: { type: "image", src: "/media/fuseai/tote.avif" },
              alt: "FuseAI tote bag reading 'Agentic AI for modern sales teams'",
              intrinsicSize: { width: 1074, height: 1342 },
            },
          ],
        },
      },
      {
        kind: "challenge",
        id: "challenge-touchpoints",
        index: "01",
        heading: "The brand system had to work across every touchpoint.",
        problem:
          "FuseAI's buyers meet the brand on the website, in sales and social assets, and then every day inside the product. **A refresh that stops at the homepage** leaves everything else looking like the old company.",
        whyItMattered:
          "A rep who signs up from the new website and lands in an old-looking product meets two different companies. **And the free trial is where FuseAI turns a signup into a customer.**",
        whatWeDid:
          "We built one system and carried it everywhere: **the logo system and app icon, colour tokens and type**, sales and social assets, and 10+ website pages. In the product, we restyled the existing flows, reworked onboarding with autofill and skippable steps, and designed the empty states and a dark mode. FuseAI's engineer built it in code from the product tokens we handed over.",
        outcome:
          "Since the redesign, Saurav reports better customer feedback and **free-to-paid trial conversion 20% higher**. New screens start from the same tokens, so the brand holds as FuseAI keeps shipping.",
      },
      {
        kind: "media",
        id: "snapshot-billboard",
        media: {
          kind: "full",
          aspect: "wide",
          slot: {
            media: { type: "image", src: "/media/fuseai/billboard.avif" },
            alt: "FuseAI 'Unified Revenue Engine' billboard",
          },
        },
      },
      {
        kind: "media",
        id: "snapshot-posters",
        media: {
          kind: "pair",
          slots: [
            // Arjun's replacements (2026-10-20). #13 is trimmed 12px a side
            // to 1171x1548 so both posters share one shape and the pair's
            // heights match.
            {
              media: {
                type: "image",
                src: "/media/fuseai/poster-agentic.avif",
              },
              alt: "FuseAI 'Agentic' poster and a prospecting product poster on a subway platform",
              intrinsicSize: { width: 1171, height: 1548 },
            },
            {
              media: {
                type: "image",
                src: "/media/fuseai/poster-buying-signals.avif",
              },
              alt: "FuseAI 'Identify Buying Signals' poster",
              intrinsicSize: { width: 1171, height: 1548 },
            },
          ],
        },
      },
      {
        kind: "challenge",
        id: "challenge-adapt",
        index: "02",
        heading: "We adapted as the scope grew, and shipped it all in 6 weeks.",
        problem:
          "FuseAI needed a brand, a website and product UI, with a launch date already set. **Then the scope kept growing.** The website went from FuseAI's existing structure to 10+ pages, and the product picked up an onboarding rework, empty states and a dark mode.",
        whyItMattered:
          "Six weeks for a fixed scope is not the flex. **Six weeks while the scope keeps growing is.** FuseAI's own team was building the site and the product alongside us, so design couldn't be the thing they waited on.",
        whatWeDid:
          "We ran brand, website and product as overlapping tracks, with **the brand first, for launch day**. Pages went to FuseAI's Framer builder in batches, and new scope slotted into the next one.",
        outcome:
          "**The brand was ready on launch day**, 17 days after kickoff. The website went live six weeks after the first design round, the product UI a few days later.",
      },
      {
        kind: "media",
        id: "snapshot-signup",
        media: {
          kind: "pair",
          slots: [
            {
              media: {
                type: "image",
                src: "/media/fuseai/phone-homepage.avif",
              },
              alt: "FuseAI website hero on a phone",
              intrinsicSize: { width: 1238, height: 1548 },
            },
            {
              media: { type: "image", src: "/media/fuseai/laptop-login.avif" },
              alt: "FuseAI login screen on a laptop",
              intrinsicSize: { width: 1349, height: 1686 },
            },
          ],
        },
      },
      {
        kind: "results",
        id: "results",
        heading: "In their own words.",
      },
      // Saurav's answers to our three case-study questions, in order, from
      // one message (#fuseai-pixelup, 10 Oct 2026), minus the "before" answer
      // the context row quotes. "[PIXELUP LABS]" replaces his "pixel labs"
      // and "[higher]" his "hire". OK'd for use with his name on 12 Oct.
      {
        kind: "testimonial",
        id: "testimonial",
        quote:
          "[PIXELUP LABS] came and supported us building a high quality logo + brand + giving character to our website. Improved customer feedback and [higher] free to paid trial conversions on the product. Good creative judgement as a team with strong branding expertise.",
        person: {
          name: "Saurav Bubber",
          role: "Co-founder & CEO",
          company: "FuseAI",
          // The photo from his pinned Slack message on this page (Arjun, 2026-10-20).
          headshot: "/media/fuseai/saurav-bubber.png",
        },
      },
      // The subway billboard (#14) as a video mockup: Arjun's 2026-10-20
      // render, cropped to the scene (white border and shadow removed) and
      // re-encoded to H.264 with no audio; poster = first frame. The pinned
      // message is Saurav's 3 Sep 2026 Slack message about the animation
      // (#fuseai-pixelup), verbatim, with its real reactions; avatar cropped
      // from Arjun's capture.
      {
        kind: "media",
        id: "snapshot-closing",
        media: {
          kind: "full",
          slot: {
            media: {
              type: "video",
              src: "/media/fuseai/subway-billboard.mp4",
              poster: "/media/fuseai/subway-billboard-poster.jpg",
            },
            alt: "FuseAI's brand animation playing on a billboard above a subway escalator",
            intrinsicSize: { width: 1628, height: 916 },
            comment: {
              avatar: "/media/fuseai/saurav-bubber.png",
              name: "Saurav Bubber",
              org: "FuseAI",
              time: "Sep 3rd at 3:37 AM",
              mention: "Fahad",
              // Arjun, 2026-10-16: blur the mention on the page.
              blurMention: true,
              quote:
                "This is AMAZING - my favorite thing so far; Great work on this animation 🥳🥳🥳🥳",
              reactions: [
                { emoji: "🔥", count: 2 },
                { emoji: "❤️", count: 1 },
                { emoji: "🙌", count: 2, mine: true },
              ],
            },
          },
        },
      },
      {
        kind: "afterLaunch",
        id: "after-launch",
        heading: "And this is where FuseAI ended up.",
        paragraphs: [
          "FuseAI launched with the new brand, then shipped a website and a product that look like the same company. **FuseAI's own team built both**: the website in Framer, the product in code. We handed over the Figma files, product tokens and animation exports.",
          "**The 20% trial-conversion lift is FuseAI's own figure**, shared in October 2026.",
          "One thing we changed after FuseAI: when a client's team builds, **we agree build QA and export formats for each platform at kickoff**. Framer, the browser and the product each want animation in a different format, and that's cheaper to settle at kickoff than after the first export.",
          "If you need brand, website and product in four weeks with nothing traded off, nobody does that well, us included. We'll tell you on day one what ships for launch and what follows it. If your brand is already locked and you only need throughput, **a design subscription is cheaper**.",
          "PIXELUP LABS has shipped 35 projects for funded B2B and AI-native startups, rated 5.0 on every review.",
          "Brand, website and product design by PIXELUP LABS, 2026.",
        ],
        cta: {
          text: "If you have a launch date and a brand that isn't ready for it,",
          label: "book a call",
          href: "/call",
        },
      },
    ],
    faqHeading,
    faqs: [fuseaiFaq, ...pixelupFaq],
  },
  sections: [],
  endCta: {
    label: "Book a call",
    href: links.discoveryCall,
  },
  moreProjects: [
    { slug: "henrylabs", tags: "Branding, website & product design" },
    { slug: "replay", tags: "Branding, web design & product design" },
  ],
  publication: {
    status: "published",
    publishedDate: "2026-10-16",
    updatedDate: "2026-10-16",
  },
};

// Answers the page's target prompt ("who designed Replay's brand"), so it
// leads the Replay FAQ ahead of the shared questions.
const replayFaq: FaqItem = {
  q: "Who designed Replay's brand and website?",
  a: "PIXELUP LABS designed Replay's brand and website from scratch in 2026, then built the site. Companies license their work data to Replay (replay.ai) and get paid, and Replay licenses the cleaned data to AI labs. After launch, Replay asked PIXELUP LABS to design its product too, and Replay's own team now runs the site. Founder and CEO Brendan Mahony, on X: \"Best agency I've ever worked with.\"",
};

// Copy: Replay (Sunsethq)/Case Study/Final/replay-case-study.md (draft,
// 2026-10-19), sources listed there. Brendan's quote is his public X reply to
// @dakshpixelup (15 Oct 2026). Media slots without `media` are placeholders
// until the mockups and videos land; each one's plan is in the comment above it.
const replay: CaseStudy = {
  slug: "replay",
  title: "We built Replay a brand that can be trusted at first glance.",
  metaTitle: "Replay Brand, Website and Product Design | PIXELUP LABS",
  metaDescription:
    "PIXELUP LABS built Replay's brand and website from scratch, then designed its product. Replay's founder: \"Best agency I've ever worked with.\"",
  info: {
    client: "Replay",
    year: "2026",
    // No funding row (FuseAI precedent): the investors sit in the sidebar summary.
    // Arjun's list (2026-10-20). "Next.js", as on the homepage card.
    involvement: [
      "Branding",
      "Web Design",
      "Motion Design",
      "Next.js Development",
      "Product Design",
    ],
    // replay.ai 308s to www.replay.ai, as on the homepage card.
    links: [{ label: "replay.ai", href: "https://www.replay.ai/" }],
  },
  description: [
    "PIXELUP LABS designed Replay's brand and website from scratch in 2026, then built the site.",
    "Companies license their work data to Replay (replay.ai) and get paid. Replay removes the personal details and licenses the data to AI labs. Companies have to trust Replay with that data, so it had to look established, not like another AI startup.",
    "After launch, Replay asked PIXELUP LABS to design its product too.",
    "Replay's founder, Brendan Mahony, on X: \"Best agency I've ever worked with.\"",
  ],
  // Mockups: Figma jfiQlmF7z1j3cq8BDFhuMT (Project showcase), section "Full
  // set" 1907:13435, frames 1-11 top to bottom, exported 2026-10-20 at 1x
  // (2920×1643 full width, 1440×1800 pairs). Videos: the four MP4s in
  // Replay (Sunsethq)/Case Study/Final, re-encoded H.264 CRF 25 (the 16:9
  // pair at 2560×1440 from their 4K masters).
  hero: {
    media: { type: "image", src: "/media/replay/billboard.avif" },
    alt: "Replay billboard on an office tower reading 'Fund growth by licensing the data you already have.', brand identity by PIXELUP LABS",
    intrinsicSize: { width: 2920, height: 1643 },
  },
  story: {
    company: "Replay",
    statusBadge: "AI data licensing",
    headline: "We built Replay a brand that can be trusted at first glance.",
    // Investors and run rate: Replay's Ashby postings (from 2026-07-20). The
    // run rate is Replay's claim and predates our kickoff (2026-07-28), so it's
    // attributed ("says") and never tied to our work. Founder line:
    // replay.ai/about, signed Founder & CEO.
    summary:
      "Replay turns companies' work data into **AI training data**, and pays the companies for it. It's backed by Floodgate, Afore, Ludlow and Hustle Fund, and says it went from $0 to a multi-eight-figure run rate in months. Founder and CEO Brendan Mahony is a repeat founder who sold one company and built Sunset, which has helped thousands of founders wind down their companies.",
    // No stat row: Arjun removed the two hero stats (2026-10-20).
    blocks: [
      {
        kind: "context",
        id: "context",
        heading: "Why did Replay need a new brand?",
        items: [
          {
            label: "Where Replay was",
            text: "Replay was just launching, with a new idea: get paid for data your company already has. **Nobody shares years of company data with a brand they don't trust.**",
          },
          {
            label: "What Replay asks companies to do",
            text: "Share years of emails, chats, tickets and code. Replay removes the personal details and licenses the cleaned data to AI labs. The company usually **gets paid up front, plus a cut of every license.**",
          },
          {
            label: "What they asked us for",
            text: "**A brand from scratch and a new website.** The site had to be built so Replay's own engineers could take it over.",
          },
          {
            label: "Why it mattered",
            text: "**When someone offers to pay you for your data, your first thought is \"what's the catch?\"** The brand had to make Replay look trustworthy at first glance.",
          },
        ],
      },
      // Frame 2: the wordmark constructed from its vector outline.
      {
        kind: "media",
        id: "snapshot-logo-loop",
        media: {
          kind: "full",
          aspect: "wide",
          slot: {
            media: {
              type: "video",
              src: "/media/replay/logo-loop.mp4",
              poster: "/media/replay/logo-loop-poster.jpg",
            },
            alt: "Replay's arch mark and serif wordmark drawn as vector outlines",
            // Every animation on this page starts when it reaches the screen.
            playOnView: true,
            loop: true,
          },
        },
      },
      // Frames 3 and 4. The phone was exported with its payout chart hidden;
      // the chart is redrawn over it from Figma layers 1907:10313/10323/10338
      // and replays their motion (2s timeline) on scroll-in.
      {
        kind: "media",
        id: "snapshot-engraving-payout",
        media: {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/replay/engraving.avif" },
              alt: "Replay poster pairing a Pegasus engraving with spreadsheet records, framed on a stone wall",
              intrinsicSize: { width: 1440, height: 1800 },
            },
            {
              media: { type: "image", src: "/media/replay/payout-phone.avif" },
              alt: "Replay homepage on a phone: what companies get paid, from $10K+ for under 25 people to $1M+ for 100+ people",
              intrinsicSize: { width: 1440, height: 1800 },
              chart: {
                // Figma 1907:10314/10322 and siblings: 19.1-wide frames with a
                // 3.05 white/30% inside stroke, dashed 12.19, square caps.
                brackets: { width: 19.14, stroke: 3.048, dash: 12.19, color: "rgb(255 255 255 / 0.3)" },
                columns: [
                  {
                    box: [311, 744.3, 256.3, 707.9],
                    at: 0.05,
                    label: { src: "/media/replay/payout-chart/label-1.png", box: [333.6, 769.5, 136, 43], at: 0.5572 },
                    caption: { src: "/media/replay/payout-chart/caption-1.png", box: [332, 1410.7, 160, 18] },
                    bar: { src: "/media/replay/payout-chart/bar-1.png", x: 330.2, width: 219, height: 34 },
                    bars: [
                      { y: 1301.9, at: 0.4378 },
                      { y: 1344.9, at: 0.3602 },
                    ],
                  },
                  {
                    box: [591.3, 744.3, 256.3, 707.9],
                    at: 0.297,
                    label: { src: "/media/replay/payout-chart/label-2.png", box: [614.1, 769.5, 167, 43], at: 1.0866 },
                    caption: { src: "/media/replay/payout-chart/caption-2.png", box: [611.9, 1410.7, 210, 18] },
                    bar: { src: "/media/replay/payout-chart/bar-2.png", x: 610.5, width: 219, height: 34 },
                    bars: [
                      { y: 1086.7, at: 0.9676 },
                      { y: 1129.7, at: 0.9142 },
                      { y: 1172.8, at: 0.8642 },
                      { y: 1215.8, at: 0.8146 },
                      { y: 1258.8, at: 0.7692 },
                      { y: 1301.9, at: 0.7264 },
                      { y: 1344.9, at: 0.6848 },
                    ],
                  },
                  {
                    box: [871.6, 744.3, 256.3, 707.9],
                    at: 0.5474,
                    label: { src: "/media/replay/payout-chart/label-3.png", box: [894.5, 769.5, 119, 43], at: 1.4362 },
                    caption: { src: "/media/replay/payout-chart/caption-3.png", box: [892.4, 1410.7, 177, 18] },
                    bar: { src: "/media/replay/payout-chart/bar-3.png", x: 890.7, width: 219, height: 34 },
                    bars: [
                      { y: 914.5, at: 1.3168 },
                      { y: 957.6, at: 1.2668 },
                      { y: 1000.6, at: 1.2222 },
                      { y: 1043.6, at: 1.1722 },
                      { y: 1086.7, at: 1.1226 },
                      { y: 1129.7, at: 1.0774 },
                      { y: 1172.8, at: 1.0278 },
                      { y: 1215.8, at: 0.984 },
                      { y: 1258.8, at: 0.9396 },
                      { y: 1301.9, at: 0.8962 },
                      { y: 1344.9, at: 0.8576 },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
      {
        kind: "challenge",
        id: "challenge-established",
        index: "01",
        heading: "Replay had to look established, not like another AI startup.",
        problem:
          "We showed Replay three different looks. It picked the one that felt like a bank: paper textures, calm and serious. **Then it asked us to make it about data, not money.**",
        whyItMattered:
          "Replay asks companies to trust it with years of their records. **When you're asking a company to license its data, looking like another AI startup works against you. Looking established works for you.**",
        whatWeDid:
          "We gave Replay a **classic serif logo**, the kind banks and archives use, and a **symbol of data passing through a frame**, like an official seal. The pages stay **paper-white, with one blue used sparingly** and a soft paper texture. Each font has one job: **STK Bureau Serif for headlines, Geist for reading, Geist Mono for labels.**",
        outcome:
          "The same look now runs across **the website, social banners, email templates and the product designs** in progress. Every rule is written down in **a brand guide we handed over.**",
      },
      // Frame 5, cropped in to a 2000-unit-wide window (x 444, y 207) so the
      // screen leads. Its blocks were exported as their own layers (each over
      // black and white, alpha recovered from the pair) and slide in up-left
      // along the 30° isometric axis (dy = dx·tan 30°), as if extending out of
      // the grid, inside the screen's right panel; the grain soft-lights over
      // them as in Figma, and the audience stays in front.
      {
        kind: "media",
        id: "snapshot-stage",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/replay/stage/base.avif" },
            alt: "Replay keynote stage reading 'We're setting the standard' beside a 3D Replay mark",
            intrinsicSize: { width: 2920, height: 1643 },
            layers: {
              clip: [1410, 217, 1131, 1214],
              from: { x: 300, y: 173 },
              duration: 0.7,
              moving: [
                { src: "/media/replay/stage/top-right.avif", box: [2218, 254, 323, 426], at: 0.08 },
                { src: "/media/replay/stage/cube.avif", box: [1472, 349, 1069, 1082], at: 0 },
                { src: "/media/replay/stage/bottom.avif", box: [1696, 1089, 780, 342], at: 0.16 },
                { src: "/media/replay/stage/bottom-right.avif", box: [2330, 1038, 211, 363], at: 0.24 },
              ],
              overlay: { src: "/media/replay/stage/grain.avif", box: [1465, 217, 1076, 1214], blend: "soft-light" },
              // Figma 1968:40, the updated people cut-out (2026-10-20).
              front: { src: "/media/replay/stage/audience.avif", box: [0, 1215, 2920, 428] },
            },
          },
        },
      },
      // Frames 6 and 7.
      {
        kind: "media",
        id: "snapshot-records-yield",
        media: {
          kind: "pair",
          slots: [
            {
              media: {
                type: "video",
                src: "/media/replay/records-illustration.mp4",
                poster: "/media/replay/records-illustration-poster.jpg",
              },
              alt: "Isometric stack of a company's records, code, documents, tickets and messages, totalling 25M+ records",
              intrinsicSize: { width: 1440, height: 1800 },
              playOnView: true,
              loop: true,
            },
            {
              media: { type: "image", src: "/media/replay/yield-poster.avif" },
              alt: "Replay street poster reading 'Yield on what you've already built.'",
              intrinsicSize: { width: 1440, height: 1800 },
            },
          ],
        },
      },
      {
        kind: "challenge",
        id: "challenge-website",
        index: "02",
        heading:
          "The website had to convince the whole C-suite on its own.",
        problem:
          "The person who finds Replay can't say yes alone. **They send the link around the leadership team, and each executive decides in seconds whether to trust it.**",
        whyItMattered:
          "The CFO wants to know **what Replay pays.** The lawyer wants to know **what data leaves the company, who's liable and who owns it afterward.**",
        whatWeDid:
          "The homepage builds up to the money: **what a company your size gets paid.** On the Data & Privacy page, we gave **each legal question its own tab.** Each tab shows a clear example, like an invoice email with the account number crossed out.",
        outcome:
          "**Replay's own team now runs the site and adds to it.** We built it and handed it over at launch. The homepage animation shows the kind of data Replay cleans: Slack threads, an inbox, code files, meeting transcripts and a contract PDF.",
      },
      // Frame 8: the homepage hero on a laptop. Brendan's public X reply is
      // pinned over its top right and types out on scroll. "PIXELUP LABS"
      // replaces his "Pixel" (Arjun, 2026-10-20).
      {
        kind: "media",
        id: "snapshot-laptop-hero",
        media: {
          kind: "full",
          aspect: "wide",
          slot: {
            media: {
              type: "video",
              src: "/media/replay/laptop-hero.mp4",
              poster: "/media/replay/laptop-hero-poster.jpg",
            },
            alt: "Replay homepage on a laptop: 'Fund growth by licensing the data you already have.'",
            playOnView: true,
            loop: true,
            // Avatar: Brendan's X profile photo, supplied by Arjun (2026-10-20).
            // Verified, posted 2026-10-15 13:12:47 UTC; views as of 2026-10-20
            // (api.fxtwitter.com). Refresh at publish. No action row (Arjun).
            comment: {
              variant: "x",
              avatar: "/media/replay/brendan-mahony-x.jpg",
              name: "Brendan Mahony",
              handle: "bmaho2211",
              verified: true,
              time: "Oct 15, 2026",
              datetime: "2026-10-15T13:12:47Z",
              stats: { views: 2947 },
              mention: "dakshpixelup",
              quote:
                "PIXELUP LABS nailed our brand + website + component library. Best agency I've ever worked with",
              href: "https://x.com/bmaho2211/status/2110720543313768555",
            },
          },
        },
      },
      // Frames 9 and 10. The signature plays once per scroll-in and rests
      // signed.
      {
        kind: "media",
        id: "snapshot-signature-valuation",
        media: {
          kind: "pair",
          slots: [
            {
              media: {
                type: "video",
                src: "/media/replay/signature.mp4",
                poster: "/media/replay/signature-poster.jpg",
              },
              alt: "Brendan Mahony's signature being written above 'Founder & CEO'",
              intrinsicSize: { width: 1440, height: 1800 },
              playOnView: true,
            },
            {
              media: { type: "image", src: "/media/replay/laptop-valuation.avif" },
              alt: "Replay on a laptop: 'Find out what your data is worth before you decide anything.'",
              intrinsicSize: { width: 1440, height: 1800 },
            },
          ],
        },
      },
      {
        kind: "results",
        id: "results",
        heading: "In their own words.",
      },
      // "PIXELUP LABS" replaces his "Pixel", without brackets (Arjun,
      // 2026-10-20). Title per replay.ai/about.
      {
        kind: "testimonial",
        id: "testimonial",
        quote:
          "PIXELUP LABS nailed our brand + website + component library. Best agency I've ever worked with.",
        person: {
          name: "Brendan Mahony",
          role: "Founder & CEO",
          company: "Replay",
          // Brendan's X profile photo, as on the pinned post.
          headshot: "/media/replay/brendan-mahony-x.jpg",
        },
        source: {
          label: "on X, 15 October 2026",
          href: "https://x.com/bmaho2211/status/2110720543313768555",
        },
      },
      // Frame 11: its ten posters, left to right, drifting across its paper
      // background (exported with the posters hidden). Posters re-exported
      // at 2x with their frame strokes off, then cropped 4px a side: the
      // 574.9×821.3 frames left a half-covered edge row that Figma filled
      // with canvas grey, which read as a stroke.
      {
        kind: "media",
        id: "snapshot-posters",
        media: {
          kind: "marquee",
          duration: 60,
          background: {
            media: { type: "image", src: "/media/replay/carousel-bg.avif" },
          },
          slots: [
            "Replay billboard reading 'Yield on what you've already built.'",
            "Replay mark poster: 'Real data, verified'",
            "Replay sign in a dark lobby",
            "Replay mark pressed into a blue wax seal",
            "Station poster reading 'Data has quietly become an asset.'",
            "Replay business cards",
            "Replay binders labelled for code, sales conversations and product logs",
            "Replay data license agreement in a folder and envelope",
            "Replay app icon on a phone lock screen",
            "Replay postage stamp",
          ].map((alt, index) => ({
            media: {
              type: "image" as const,
              src: `/media/replay/poster-${String(index + 1).padStart(2, "0")}.avif`,
            },
            alt,
            intrinsicSize: { width: 1142, height: 1635 },
          })),
        },
      },
      {
        kind: "afterLaunch",
        id: "after-launch",
        heading: "And this is where Replay ended up.",
        // Concise, no sales pitch, one Book a call at the end (Arjun, 2026-10-20).
        paragraphs: [
          "Replay's brand rules live on **a simple website, not a PDF**: logos, colours, fonts, email templates, and **files that AI coding tools can read.**",
          "After launch, Replay asked us to **design its product too**, starting with **a component library.** Replay's engineers build it, and the work is ongoing.",
          "Replay chose its name and wrote its own copy. We **designed the brand, built the site, and are now designing the product.**",
          "Branding, web design, motion design, Next.js development and product design by PIXELUP LABS, 2026.",
        ],
        // An inline link to the /call page, no email field (Arjun, 2026-10-20).
        cta: {
          text: "Want to talk about your own brand?",
          label: "Book a call",
          href: "/call",
        },
      },
    ],
    faqHeading,
    // "How long does a typical engagement take?" is left off this page only
    // (approved in the brief, Varick precedent).
    faqs: [
      replayFaq,
      ...pixelupFaq.filter(
        (item) => item.q !== "How long does a typical engagement take?",
      ),
    ],
  },
  sections: [],
  moreProjects: [
    { slug: "fuseai", tags: "Branding, website & product design" },
    { slug: "henrylabs", tags: "Branding, website & product design" },
  ],
  // Published 2026-10-20 on Arjun's call, ahead of Brendan's review. Still
  // open: Brendan's OK on poster 6 (his email and phone number), his review of
  // the page, Replay's STK Bureau Serif licence, and refreshing the X views.
  publication: {
    status: "published",
    publishedDate: "2026-10-20",
    updatedDate: "2026-10-20",
  },
};

export const caseStudies = {
  greptile,
  sainapse,
  sully,
  streamline,
  henryLabs,
  fuseai,
  replay,
};
