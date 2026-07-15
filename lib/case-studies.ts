import type { ProjectMedia } from "./projects";

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
  /** Logo mark rendered centered on top of the media (as on the homepage cards). */
  overlayLogo?: string;
}

/** A row of imagery between sections: one full-bleed slot or a side-by-side pair. */
export type MediaBlock =
  | { kind: "full"; slot: MediaSlot }
  | { kind: "pair"; slots: [MediaSlot, MediaSlot] };

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
  /** Lead paragraph above the list/rows. Line breaks are preserved. */
  lead?: string;
  /** "Clarity over cleverness / Making complex workflows simple" pairs. */
  focus?: FocusItem[];
  /** "Week 1: …" metric rows. */
  results?: ResultRow[];
  paragraphs?: string[];
  /** Imagery rendered after this section. */
  media: MediaBlock[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface MoreProjectRef {
  /** Must match a slug in lib/projects.ts — card media + link come from there. */
  slug: string;
  tags: string;
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
    link: { label: string; href: string };
  };
  /** Long-form intro shown in the desktop sidebar (hidden on mobile, per Figma). */
  description: string[];
  hero: MediaSlot;
  sections: CaseSection[];
  moreProjects: MoreProjectRef[];
}

/**
 * Shared FAQ shown on every case study page: about PixelUp itself, written
 * to resolve the objections prospects most often bring to a first call.
 */
export const faqHeading = "Frequently Answered Question";

export const pixelupFaq: FaqItem[] = [
  {
    q: "What does PixelUp Labs do?",
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
    a: "Scope drives pricing, so we quote per engagement. Book a discovery call and you will leave with a clear recommendation and a straightforward quote.",
  },
  {
    q: "What is it like to work with you?",
    a: "You work directly with the team on Telegram, with fast turnarounds and quick iterations. No account managers, no layers, no surprises.",
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
    "How we partnered with Greptile to evolve their AI code review platform into an enterprise-ready system, doubling demo requests in week one and helping set up a $25M Series A.",
  info: {
    client: "Greptile (AI code review platform)",
    year: "2025",
    involvement: ["Brand Identity", "Product Design", "Website", "Sales Decks"],
    link: { label: "greptile.com", href: "https://greptile.com" },
  },
  description: [
    "Under intense timelines, we partnered with Greptile to evolve their AI code review platform into an enterprise-ready system.",
    "Greptile had YC backing and strong technology, but gaps in product clarity and brand maturity surfaced as they moved upmarket, where trust is non-negotiable.",
    "We treated the work as a system design problem: brand, product, website, and sales assets designed together, prioritizing clarity and trust at every touchpoint.",
    "The impact was immediate. Demo requests doubled in week one, and within six months Greptile raised a $25M Series A at a $180M valuation led by Benchmark.",
  ],
  hero: {
    media: { type: "image", src: "/media/greptile/hero.png" },
    alt: "Glowing green Greptile logo mark on a dark background",
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
        { label: "Week 1:", text: "Demo requests doubled immediately after launch" },
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
};

const sainapse: CaseStudy = {
  slug: "sainapse",
  title: "Sainapse: From Technical Product to Enterprise Standard",
  metaTitle: "Sainapse Case Study - PIXELUP LABS",
  metaDescription:
    "A complete system rebuild for Sainapse's agentic AI support platform: brand voice, visual identity, and web presence designed together ahead of their general availability launch.",
  info: {
    client: "Sainapse (AI Customer Support Platform)",
    year: "2025",
    involvement: ["Brand Identity", "Website Design"],
    link: { label: "sainapse.ai", href: "https://sainapse.ai" },
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
            { media: { type: "image", src: "/media/sainapse/img-1.png" }, alt: "Sainapse brand color palette swatches from dark to lavender", tone: "white" },
            { media: { type: "image", src: "/media/sainapse/img-2.png" }, alt: "Sainapse Ronzino type specimen with agentic explainable AI tagline", tone: "white" },
          ],
        },
        {
          kind: "full",
          slot: { media: { type: "image", src: "/media/sainapse/img-3.png" }, alt: "Sainapse Rethink Enterprise Intelligence brand film on a cinema screen" },
        },
      ],
    },
    {
      heading: "What Results Did Sainapse Achieve?",
      results: [
        { label: "Month 1:", text: "Supported 2M+ tickets in production post-launch" },
        { label: "Projection:", text: "On track to power 10M+ tickets by March 2026" },
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
            { media: { type: "image", src: "/media/sainapse/img-4.png" }, alt: "Sainapse mobile website hero on a phone against red fabric" },
            { media: { type: "image", src: "/media/sainapse/img-5.png" }, alt: "Sainapse AI customer support whitepaper booklets lying on sand" },
          ],
        },
        {
          kind: "full",
          slot: { media: { type: "image", src: "/media/sainapse/img-6.png" }, alt: "Sainapse website homepage on a laptop in tall grass" },
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
            { media: { type: "image", src: "/media/sainapse/img-7.png" }, alt: "Sainapse enterprise customer support poster with moody surfer imagery" },
            { media: { type: "image", src: "/media/sainapse/img-8.png" }, alt: "Sainapse Rethink Enterprise Intelligence tablet screen on a leather sofa" },
          ],
        },
        {
          kind: "full",
          slot: { media: { type: "image", src: "/media/sainapse/img-9.png" }, alt: "Sainapse Rethink Enterprise Intelligence framed billboard poster mockup" },
        },
        {
          kind: "full",
          slot: { media: { type: "image", src: "/media/sainapse/img-10.png" }, alt: "Sainapse dark product page on a tablet held in hands" },
        },
        {
          kind: "full",
          slot: { media: { type: "image", src: "/media/sainapse/img-11.png" }, alt: "Sainapse dark dashboard UI displayed on a desktop monitor" },
        },
      ],
    },
  ],
  moreProjects: [
    { slug: "sully", tags: "Website & Motion Design" },
    { slug: "greptile", tags: "Branding & Product Design" },
  ],
};

const sully: CaseStudy = {
  slug: "sully",
  title: "Sully: From Liability to Deal Closer in 11 Months",
  metaTitle: "Sully Case Study - PIXELUP LABS",
  metaDescription:
    "How we turned Sully's website from an enterprise liability into a deal closer, with motion-driven explainers that helped scale 26x and support a $32M+ raise at a $150M valuation.",
  info: {
    client: "Sully (AI Healthcare Platform)",
    year: "2025",
    involvement: ["Website Design", "Product Pages", "Motion Design", "SEO"],
    link: { label: "sully.ai", href: "https://sully.ai" },
  },
  description: [
    "Sully was scaling fast, $0.5M to $5M ARR in 9 months, but their website wasn't keeping up.",
    "Enterprise buyers were landing on an outdated, inconsistent site that didn't match the product they were being sold. For a company closing $15M+ contracts with hospital executives, the website had become a liability.",
    "We treated this as an enterprise credibility problem. Every page, motion sequence, and explainer was designed to help hospital executives understand complex AI workflows before the demo even started.",
    "The impact was immediate. One explainer page directly contributed to closing a major enterprise contract, and within 11 months Sully scaled 26x, raising $32M+ at a $150M valuation.",
  ],
  hero: {
    media: { type: "image", src: "/media/sully/hero.png" },
    alt: "Sully.ai logo mark over a bright hospital corridor with clinicians",
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
            { media: { type: "image", src: "/media/sully/img-1.png" }, alt: "Sully.ai autonomous care network diagram on a floating tablet" },
            { media: { type: "image", src: "/media/sully/img-2.png" }, alt: "Sully.ai AI Receptionist features page on a laptop" },
          ],
        },
        {
          kind: "full",
          slot: { media: { type: "image", src: "/media/sully/img-3.png" }, alt: "Sully.ai homepage hero projected on stage before an audience" },
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
            { media: { type: "image", src: "/media/sully/img-4.png" }, alt: "Sully.ai mobile homepage held in a hand against blue sky" },
            { media: { type: "image", src: "/media/sully/img-5.png" }, alt: "Sully.ai appointments booking product page on a dark laptop" },
          ],
        },
        {
          kind: "full",
          slot: { media: { type: "image", src: "/media/sully/img-6.png" }, alt: "Sully.ai scribes-versus-dictation comparison page on a laptop" },
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
            { media: { type: "image", src: "/media/sully/img-7.png" }, alt: "Sully.ai hospital impact stats page on a laptop" },
            { media: { type: "image", src: "/media/sully/img-8.png" }, alt: "Sully.ai clinical co-pilot mobile screen on a leather chair" },
          ],
        },
        {
          kind: "full",
          slot: { media: { type: "image", src: "/media/sully/img-9.png" }, alt: "Sully.ai Partner with Sully Labs page on a phone" },
        },
        {
          kind: "full",
          slot: { media: { type: "image", src: "/media/sully/img-10.png" }, alt: "Sully.ai EPIC and EHR integrations explainer page on a laptop", tone: "white" },
        },
      ],
    },
  ],
  moreProjects: [
    { slug: "greptile", tags: "Branding & Product Design" },
    { slug: "sainapse", tags: "Branding, Website & Motion Design" },
  ],
};

export const caseStudies = { greptile, sainapse, sully };
