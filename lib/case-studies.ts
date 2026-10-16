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
  /** Slack-style client message pinned top right on a full-width slot (under it on mobile). */
  comment?: MediaComment;
  /** Video only: play once from the start each time it scrolls into view
   * (paused when it leaves, no loop) instead of autoplaying on a loop. */
  playOnView?: boolean;
}

/** A Slack-style message pinned to a full-width media slot. It types out once on scroll. */
export interface MediaComment {
  avatar: string;
  name: string;
  /** Sender's org, shown as Slack's badge on the avatar (its first letter). */
  org?: string;
  /** Timestamp as Slack shows it, e.g. "Sep 3rd at 3:37 AM". */
  time?: string;
  /** Leading @mention, shown as a Slack mention chip before the message. */
  mention?: string;
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
    };

export interface FocusItem {
  title: string;
  sub: string;
}

export interface ResultRow {
  label: string;
  text: string;
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
      approvalPending?: boolean;
    }
  | {
      kind: "afterLaunch";
      id: string;
      heading: string;
      paragraphs: string[];
    };

export interface CaseStudyStory {
  company: string;
  statusBadge?: string;
  headline: string;
  summary: string;
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
    blockers?: string[];
  };
}

/**
 * Shared FAQ shown on every case study page: about PixelUp itself, written
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
    "We partnered with Greptile to evolve their AI code review platform into an enterprise-ready system.",
    "Greptile had YC backing and strong technology, but gaps in product clarity and brand maturity surfaced as they moved upmarket, where trust is non-negotiable.",
    "We treated the work as a system design problem: brand, product, website, and sales assets designed together, prioritizing clarity and trust at every touchpoint.",
    "The impact was immediate. Demo requests doubled in week one, and within six months Greptile raised a $25M Series A at a $180M valuation led by Benchmark.",
  ],
  hero: {
    media: { type: "image", src: "/media/greptile/hero.png" },
    alt: "Glowing green Greptile logo mark on a dark background",
  },
  detailLayout: "legacy",
  story: {
    company: "Greptile",
    statusBadge: "YC W24 · Series A",
    headline:
      "We rebuilt Greptile for enterprise. Six months later, it raised a $25M Series A.",
    summary:
      "The product already worked. The brand and website made enterprise buyers work too hard to trust it. We fixed that gap across the product, site and sales story.",
    highlights: [
      { value: "2×", label: "Demo requests", detail: "In the first week" },
      {
        value: "180K+",
        label: "Bugs caught post-ship",
        detail: "By month one",
      },
      { value: "$25M", label: "Series A", detail: "Led by Benchmark" },
      { value: "$180M", label: "Valuation", detail: "Within six months" },
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
            text: "Greptile had YC backing, real technical depth and a product that could review complex codebases.",
          },
          {
            label: "What it needed",
            text: "A system that could explain the product quickly and feel credible to larger engineering teams.",
          },
          {
            label: "What was not working",
            text: "The brand, website and product story felt fragmented. Buyers had to connect the value for themselves.",
          },
          {
            label: "Why it mattered",
            text: "As Greptile moved upmarket, every unclear touchpoint added friction to a sale built on trust.",
          },
        ],
      },
      {
        kind: "media",
        id: "snapshot-billboard",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/greptile/img-3.png" },
            alt: "Greptile Ship Faster billboard mockup on a city street",
          },
        },
      },
      {
        kind: "media",
        id: "snapshot-poster",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/greptile/img-6.png" },
            alt: "Greptile Bridge the gap brand poster",
          },
        },
      },
      {
        kind: "challenge",
        id: "challenge-one",
        index: "01",
        heading: "Every touchpoint told a different Greptile story.",
        problem:
          "Greptile's technology had moved faster than the way the company presented itself. Brand, website and sales materials each told a slightly different story.",
        whyItMattered:
          "Enterprise buyers do not separate the product from the company behind it. An inconsistent signal makes a capable platform feel like a risk.",
        whatWeDid:
          "We rebuilt the identity, positioning, website and sales system together. Clarity, durability and trust became the filter for every decision.",
        outcome:
          "Greptile had one coherent system for product, sales and investor conversations instead of a set of disconnected deliverables.",
      },
      {
        kind: "media",
        id: "snapshot-identity",
        media: {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/greptile/img-1.png" },
              alt: "Greptile brand color palette",
              tone: "white",
            },
            {
              media: { type: "image", src: "/media/greptile/img-2.png" },
              alt: "Greptile brand type specimen",
              tone: "white",
            },
          ],
        },
      },
      {
        kind: "media",
        id: "snapshot-social",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/greptile/img-9.png" },
            alt: "Greptile social campaign series",
            tone: "green",
          },
        },
      },
      {
        kind: "challenge",
        id: "challenge-two",
        index: "02",
        heading: "Buyers saw the complexity before they saw the value.",
        problem:
          "AI code review crosses repositories, code context and review workflows. Showing all that complexity at once made the value harder to see.",
        whyItMattered:
          "If a buyer could not understand the workflow quickly, the demo had to explain the interface before it could prove the outcome.",
        whatWeDid:
          "We simplified the hierarchy, clarified key paths and carried the same visual logic from the website into the product experience.",
        outcome:
          "After launch, demo requests doubled in the first week and the product story gave sales a clearer starting point.",
      },
      {
        kind: "media",
        id: "snapshot-product",
        media: {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/greptile/img-4.png" },
              alt: "Greptile mobile experience mockup held in hand",
            },
            {
              media: { type: "image", src: "/media/greptile/img-5.png" },
              alt: "Greptile sign-up screen on a laptop",
            },
          ],
        },
      },
      {
        kind: "results",
        id: "results",
        heading: "Results",
        metrics: [
          { value: "2×", label: "Demo requests", detail: "In the first week" },
          {
            value: "180K+",
            label: "Bugs caught post-ship",
            detail: "By month one",
          },
          { value: "$25M", label: "Series A", detail: "Led by Benchmark" },
          { value: "$180M", label: "Valuation", detail: "Within six months" },
        ],
      },
      {
        kind: "media",
        id: "snapshot-results",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/greptile/img-10.png" },
            alt: "Greptile product interface on a laptop",
            tone: "green",
          },
        },
      },
      {
        kind: "testimonial",
        id: "testimonial",
        heading: "What Greptile says about working with us.",
        quote:
          "A verified client quote will sit here once Greptile approves it.",
        person: {
          name: "Daksh Gupta",
          role: "Co-founder",
          company: "Greptile",
          headshot: "/media/greptile/daksh-gupta.png",
        },
        approvalPending: true,
      },
      {
        kind: "media",
        id: "snapshot-card",
        media: {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/greptile/card.png" },
            alt: "Greptile brand mark on a green project card",
          },
        },
      },
      {
        kind: "afterLaunch",
        id: "after-launch",
        heading: "Then Greptile started sending other YC founders our way.",
        paragraphs: [
          "Greptile began referring us to other YC founders. One introduction turned into several, and the project became the foundation for longer-term work across the YC ecosystem.",
          "Today, we work with multiple YC-backed teams to turn strong technology into clear, credible systems.",
        ],
      },
      {
        kind: "media",
        id: "snapshot-after-launch",
        media: {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/greptile/img-7.png" },
              alt: "Greptile analytics dashboard on a studio display",
            },
            {
              media: { type: "image", src: "/media/greptile/img-8.png" },
              alt: "Greptile subway poster mockup",
            },
          ],
        },
      },
    ],
    faqHeading: "Frequently asked questions.",
    faqs: [
      {
        q: "Do you start with strategy or visual design?",
        a: "Strategy first. We align the audience, positioning and sales story before deciding what the visual system needs to do.",
      },
      {
        q: "How involved does the client team need to be?",
        a: "We need direct access to the people closest to the product and customer. Short, focused reviews keep decisions fast without turning the project into a full-time job for your team.",
      },
      {
        q: "How do feedback and revisions work?",
        a: "We work in tight review loops, explain the reason behind each direction and collect feedback in one place. That keeps revisions decisive instead of subjective.",
      },
      {
        q: "Can you work with an existing brand system?",
        a: "Yes. We keep what is useful, fix what is limiting the company and extend the system only where the project needs it.",
      },
      {
        q: "Can you handle a large website project?",
        a: "Yes. We break the site into repeatable page types and shared components, then ship in stages so scale does not create inconsistency.",
      },
      {
        q: "Do you handle development and handoff?",
        a: "We can design and build the site, or work with your engineering team. Either way, the handoff includes the system, responsive behavior and implementation guidance.",
      },
      {
        q: "How does the work align with go-to-market?",
        a: "We design the website, product story and sales assets as one system, so launch, demos and investor conversations reinforce the same position.",
      },
    ],
  },
  sections: [
    {
      heading: "How Did We Approach the Project?",
      lead: "We treated this as a system design problem, not surface polish.\nOur focus:",
      focus: [
        {
          title: "Clarity over cleverness",
          sub: "Making complex workflows simple",
        },
        {
          title: "Durability over novelty",
          sub: "Designs that scale without fragmentation",
        },
        {
          title: "Trust signals",
          sub: "Every decision reinforced reliability and maturity",
        },
        {
          title: "Unified experience",
          sub: "Aligned product, brand, and narrative into one coherent signal",
        },
      ],
      media: [
        {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/greptile/img-1.png" },
              alt: "Greptile brand color palette",
              tone: "white",
            },
            {
              media: { type: "image", src: "/media/greptile/img-2.png" },
              alt: "Greptile brand type specimen",
              tone: "white",
            },
          ],
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/greptile/img-3.png" },
            alt: "Greptile 'Ship Faster' billboard mockup on a city street",
          },
        },
      ],
    },
    {
      heading: "What Results Did Greptile Achieve?",
      results: [
        {
          label: "Week 1:",
          text: "Demo requests doubled immediately after launch",
        },
        { label: "Month 1:", text: "180,000+ bugs caught post-ship" },
        {
          label: "Month 6:",
          text: "$25M Series A raised at $180M valuation, led by Benchmark",
        },
      ],
      paragraphs: [
        "Beyond metrics, our work became Greptile's internal standard for how they present themselves across product, sales, and investor touchpoints.",
      ],
      media: [
        {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/greptile/img-4.png" },
              alt: "Greptile mobile experience mockup held in hand",
            },
            {
              media: { type: "image", src: "/media/greptile/img-5.png" },
              alt: "Greptile sign-up screen on a laptop",
            },
          ],
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/greptile/img-6.png" },
            alt: "Greptile 'Bridge the gap' brand poster",
          },
        },
      ],
    },
    {
      heading: "What Happened After Launch?",
      paragraphs: [
        "Greptile began referring us to other YC founders. One introduction turned into several, and this collaboration became the foundation for our long-term partnerships across the YC ecosystem.",
        "Today, we work closely with multiple YC-backed teams, helping them translate strong technology into clear, credible systems.",
      ],
      media: [
        {
          kind: "pair",
          slots: [
            {
              media: { type: "image", src: "/media/greptile/img-7.png" },
              alt: "Greptile analytics dashboard on a studio display",
            },
            {
              media: { type: "image", src: "/media/greptile/img-8.png" },
              alt: "Greptile subway poster mockup",
            },
          ],
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/greptile/img-9.png" },
            alt: "Greptile Instagram post series",
            tone: "green",
          },
        },
        {
          kind: "full",
          slot: {
            media: { type: "image", src: "/media/greptile/img-10.png" },
            alt: "Greptile product interface on a laptop",
            tone: "green",
          },
        },
      ],
    },
  ],
  moreProjects: [
    { slug: "sainapse", tags: "Branding, Website & Motion Design" },
    { slug: "sully", tags: "Website & Motion Design" },
  ],
  publication: { status: "published" },
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
    involvement: ["Brand Identity", "Website Design"],
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
  publication: { status: "published" },
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
    involvement: ["Website Design", "Product Pages", "Motion Design", "SEO"],
    links: [{ label: "sully.ai", href: "https://sully.ai" }],
  },
  description: [
    "Sully was scaling fast, $0.5M to $5M ARR in 9 months, but their website wasn't keeping up.",
    "Enterprise buyers were landing on an outdated, inconsistent site that didn't match the product they were being sold. For a company closing $15M+ contracts with hospital executives, the website had become a liability.",
    "We treated this as an enterprise credibility problem. Every page, motion sequence, and explainer was designed to help hospital executives understand complex AI workflows before the demo even started.",
    "The impact was immediate. One explainer page directly contributed to closing a major enterprise contract, and within 11 months Sully scaled 26x, raising $32M+ at a $150M valuation.",
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
        {
          title: "Strategic SEO",
          sub: "Fixed structure and performance to support enterprise discovery",
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
  publication: { status: "published" },
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
          "If you recognised Streamline's problem in your own company, we should talk. We work with AI and B2B SaaS teams on brand, web and product design, helping them move upmarket.",
        ],
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
  publication: { status: "published" },
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
          "If you recognised Henry Labs' problem in your own company, **we should talk**. We work with AI and B2B SaaS teams on brand, web and product design, helping them look as credible as the product they have built.",
        ],
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
    { slug: "greptile", tags: "Branding & product design" },
  ],
  publication: {
    status: "published",
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
      // The mark drawing itself on its construction grid: WebM (VP9, no
      // audio) with an MP4 fallback, replaying from the start on each scroll-in.
      {
        kind: "media",
        id: "snapshot-logo",
        media: {
          kind: "full",
          aspect: "wide",
          slot: {
            media: {
              type: "video",
              src: "/media/fuseai/logo-grid.webm",
              fallbackSrc: "/media/fuseai/logo-grid.mp4",
              poster: "/media/fuseai/logo-grid-poster.jpg",
            },
            alt: "FuseAI's two-stripe mark drawing itself on its construction grid",
            playOnView: true,
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
            {
              media: {
                type: "image",
                src: "/media/fuseai/subway-posters.avif",
              },
              alt: "FuseAI 'Prospect. Enrich. Engage. Fuse.' posters in a subway station",
              intrinsicSize: { width: 1238, height: 1548 },
            },
            {
              media: {
                type: "image",
                src: "/media/fuseai/poster-pipeline.avif",
              },
              alt: "FuseAI 'Less complexity, More pipeline.' poster",
              intrinsicSize: { width: 1201, height: 1501 },
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
      // FuseAI's website footer animation (exported 2026-10-16; MP4 for
      // Safari, poster = first frame). The pinned message is Saurav's 3 Sep
      // 2026 Slack message about it (#fuseai-pixelup), verbatim, with its
      // real reactions; avatar cropped from Arjun's capture.
      {
        kind: "media",
        id: "snapshot-footer-animation",
        media: {
          kind: "full",
          slot: {
            media: {
              type: "video",
              src: "/media/fuseai/footer-animation.mp4",
              poster: "/media/fuseai/footer-animation-poster.jpg",
            },
            alt: "FuseAI website footer animation cutting between F1 imagery, checkered flags and the Fuse wordmark",
            intrinsicSize: { width: 1920, height: 550 },
            comment: {
              avatar: "/media/fuseai/saurav-bubber.png",
              name: "Saurav Bubber",
              org: "FuseAI",
              time: "Sep 3rd at 3:37 AM",
              mention: "Fahad",
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
        },
      },
      {
        kind: "media",
        id: "snapshot-closing",
        media: {
          kind: "full",
          aspect: "wide",
          slot: {
            media: {
              type: "image",
              src: "/media/fuseai/subway-billboard.avif",
            },
            alt: "FuseAI '(FUSE*)' billboard above a subway escalator",
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
          "If you have a launch date and a brand that isn't ready for it, **we should talk**. PIXELUP LABS has shipped 35 projects for funded B2B and AI-native startups, rated 5.0 on every review. Our prices are public, and retainers start at $6k/mo.",
          "Brand, website and product design by PIXELUP LABS, 2026.",
        ],
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
    { slug: "streamline", tags: "Branding, positioning & website design" },
  ],
  publication: {
    status: "draft",
    blockers: [
      "Confirm with Saurav which product screens can be public.",
      "Get Saurav's OK to quote his 3 Sep Slack message with his photo (the floating comment).",
      "At publish: set both dates to the publish day, add the FuseAI card to lib/projects.ts and lib/case-studies-showcase.ts, and swap one Henry Labs 'More case studies' card to FuseAI.",
    ],
  },
};

export const caseStudies = {
  greptile,
  sainapse,
  sully,
  streamline,
  henryLabs,
  fuseai,
};
