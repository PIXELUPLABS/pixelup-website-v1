import { links, type ProjectMedia } from "./projects";

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
    funding?: string;
    links: { label: string; href: string }[];
  };
  /** Long-form intro shown in the desktop sidebar (hidden on mobile, per Figma). */
  description: string[];
  hero: MediaSlot;
  /** Optional visual immediately after the hero, before the first story section. */
  introMedia?: MediaBlock[];
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
    a: "Scope drives pricing, so we quote per engagement. Book a discovery call and you will leave with a clear recommendation and a straightforward quote.",
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
    links: [{ label: "sainapse.ai", href: "https://sainapse.ai" }],
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
  publication: { status: "published" },
};

const streamline: CaseStudy = {
  slug: "streamline",
  title: "We repositioned Streamline for enterprise, then scaled the brand across 200 pages.",
  metaTitle: "Streamline Case Study - PIXELUP LABS",
  metaDescription:
    "PIXELUP LABS repositioned Streamline for enterprise legal teams and built a brand, website and design system that scaled across more than 200 pages.",
  info: {
    client: "Streamline (AI Platform for Legal Operations)",
    year: "2026",
    involvement: ["Brand Identity", "Positioning", "Website Design", "Design System"],
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
  title: "We built the Henry Labs brand, then carried it across every touchpoint.",
  metaTitle: "Henry Labs Case Study - PIXELUP LABS",
  metaDescription:
    "See how PIXELUP LABS designed Henry Labs' brand, website, dashboard and checkout experience for a startup building agentic commerce infrastructure.",
  info: {
    client: "Henry Labs",
    year: "2026",
    involvement: [
      "Brand identity",
      "Positioning",
      "Website design and build",
      "Product design",
      "Design system",
      "Motion",
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
      src: "/media/henry-labs.mp4",
      poster: "/media/henry-labs/64.avif",
    },
    alt: "Henry Labs animated brand reveal",
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
    heading: "The brand got us in the door. The product became most of the job.",
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
            media: { type: "image", src: "/media/henry-labs/frame-2147244047.avif" },
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
      "Funding reads \"Private\": confirm a figure directly with Henry Labs before publishing one.",
      "Add two approved Slack reactions with names and roles.",
      "Confirm which dashboard and checkout screens can be public.",
      "Add a measurable result only if Henry Labs approves the claim.",
    ],
  },
};

export const caseStudies = { greptile, sainapse, sully, streamline, henryLabs };
