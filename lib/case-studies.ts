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
  quote: {
    heading: string;
    text: string;
    name: string;
    role: string;
    image: MediaSlot;
  };
  faqHeading: string;
  /* NOTE: only the answers marked verbatim existed in Figma; the rest were
     drafted from the case study copy — review before launch. */
  faq: FaqItem[];
  moreProjects: MoreProjectRef[];
}

const greptile: CaseStudy = {
  slug: "greptile-design-system",
  title: "Greptile: YC W24 to $25M Series A in 6 Months",
  metaTitle: "Greptile Case Study — PIXELUP LABS",
  metaDescription:
    "How we partnered with Greptile to evolve their AI code review platform into an enterprise-ready system — doubling demo requests in week one and helping set up a $25M Series A.",
  info: {
    client: "Greptile (AI code review platform)",
    year: "2025",
    involvement: ["Brand Identity", "Product Design", "Website", "Sales Decks"],
    link: { label: "greptile.com", href: "https://greptile.com" },
  },
  description: [
    "Under intense timelines, we partnered with Greptile to evolve their AI code review platform from a functional product into an enterprise-ready system.",
    "With YC backing and strong technology, Greptile was gaining traction, but gaps in product clarity, brand maturity, and overall experience surfaced as they moved upmarket, where trust and reliability are non-negotiable.",
    "We treated the work as a system design problem. Brand, product, website, and sales assets were designed together, prioritizing clarity, durability, and trust at every touchpoint.",
    "The impact was immediate. Demo requests doubled in week one, 180,000+ bugs were caught in the first month, and within six months Greptile raised a $25M Series A at a $180M valuation led by Benchmark.",
    "And yeah, it didn’t just work. It scaled.",
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
  quote: {
    heading: "What Did Greptile’s CEO Say?",
    text: "We constantly hear from customers that the web app feels unusually well designed.",
    name: "Daksh Gupta",
    role: "Founder",
    image: {
      media: { type: "image", src: "/media/greptile/daksh-gupta.png" },
      alt: "Daksh Gupta, founder of Greptile",
    },
  },
  faqHeading: "Frequently Answered Question",
  faq: [
    {
      q: "How much funding did Greptile raise?",
      a: "Greptile raised a $25M Series A at a $180M valuation, led by Benchmark, within six months of the redesign launching.",
    },
    {
      // Verbatim from Figma.
      q: "What does Greptile do?",
      a: "Greptile is an AI code review platform that automatically catches bugs in pull requests for engineering teams.",
    },
    {
      q: "How long did the design project take?",
      a: "The engagement ran on an intense startup timeline — brand, product, website, and sales assets were designed together as one system.",
    },
    {
      q: "What results did the redesign achieve?",
      a: "Demo requests doubled in the first week, 180,000+ bugs were caught in the first month, and Greptile raised a $25M Series A within six months.",
    },
    {
      q: "Who invested in Greptile?",
      a: "Greptile is backed by Y Combinator, and its $25M Series A was led by Benchmark.",
    },
    {
      q: "When was Greptile in Y Combinator?",
      a: "Greptile went through Y Combinator in the Winter 2024 (W24) batch.",
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
  metaTitle: "Sainapse Case Study — PIXELUP LABS",
  metaDescription:
    "A complete system rebuild for Sainapse's agentic AI support platform — brand voice, visual identity, and web presence designed together ahead of their general availability launch.",
  info: {
    client: "Sainapse (AI Customer Support Platform)",
    year: "2025",
    involvement: ["Brand Identity", "Website Design"],
    link: { label: "sainapse.ai", href: "https://sainapse.ai" },
  },
  description: [
    "After seven years and 2M+ production tickets, Sainapse had proven technology, but a brand that couldn't keep pace. Founded in 2017 with backing from Accel, the platform had evolved from basic automation to a full agentic AI system, yet their identity still felt fragmented, technical, and hard to explain.",
    "As they prepared to launch general availability in December 2024, the gaps became critical. Enterprise buyers needed clarity. Sales teams needed confidence. The market needed a signal that Sainapse was built to scale.",
    "We approached this as a complete system rebuild. Brand voice, visual identity, and web presence were designed together to communicate one truth: proof over promise. Every word, interaction, and design decision reinforced precision, traceability, and calm confidence—the exact qualities enterprises demand from mission-critical infrastructure.",
    "The result was a brand that finally matched the sophistication of the platform underneath.",
  ],
  hero: {
    media: { type: "video", src: "/media/sainapse.mp4" },
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
  quote: {
    heading: "What Did Sainapse’s CEO Say?",
    text: "The brand established a new standard for how Sainapse communicates, clear, evidence-driven, and built to scale alongside the platform itself.",
    name: "Abhirup Ghosh",
    role: "Co-founder, Head of Innovation",
    image: {
      media: { type: "image", src: "/media/sainapse/abhirup-ghosh.png" },
      alt: "Abhirup Ghosh, co-founder of Sainapse",
    },
  },
  faqHeading: "Frequently Answered Question",
  faq: [
    {
      // Verbatim from Figma.
      q: "What did the Sainapse rebrand include?",
      a: "The rebrand included complete brand identity, logo design, brand voice guidelines, and website design.",
    },
    {
      q: "When did Sainapse launch their new website?",
      a: "The new brand and website launched as Sainapse prepared for general availability in December 2024.",
    },
    {
      q: "What was the design approach for Sainapse?",
      a: "We treated it as a credibility problem, not a cosmetics one — proof over promise, precision in language, and trust at every touchpoint.",
    },
    {
      q: "How long did the Sainapse design project take?",
      a: "Brand voice, visual identity, and web presence were designed together as a single system rebuild in one focused engagement.",
    },
    {
      q: "What companies has Sainapse worked with since the rebrand?",
      a: "Sainapse is deployed by Fortune 500 companies including Ford, Avery Dennison, and Freshworks.",
    },
  ],
  moreProjects: [
    { slug: "sully", tags: "Website & Motion Design" },
    { slug: "greptile-design-system", tags: "Branding & Product Design" },
  ],
};

const sully: CaseStudy = {
  slug: "sully",
  title: "Sully: From Liability to Deal Closer in 11 Months",
  metaTitle: "Sully Case Study — PIXELUP LABS",
  metaDescription:
    "How we turned Sully's website from an enterprise liability into a deal closer — motion-driven explainers that helped scale 26x and support a $32M+ raise at a $150M valuation.",
  info: {
    client: "Sully (AI Healthcare Platform)",
    year: "2025",
    involvement: ["Website Design", "Product Pages", "Motion Design", "SEO"],
    link: { label: "sully.ai", href: "https://sully.ai" },
  },
  description: [
    "Sully was scaling fast, $0.5M to $5M ARR in 9 months, but their website wasn't keeping up.",
    "With YC backing and breakthrough AI technology automating clinical workflows for major hospital systems, Sully was closing enterprise deals. But enterprise buyers were landing on an outdated, inconsistent site that didn't match the product they were being sold. The brand was fragmented. SEO was broken. For a company closing $15M+ contracts with hospital executives, the website had become a liability.",
    "We treated this as an enterprise credibility problem. The website needed to become a deal closer, not a blocker. Every page, motion sequence, and explainer was designed to help hospital executives understand complex AI workflows before the demo even started.",
    "The impact was immediate. One concept explainer page directly contributed to closing a major enterprise contract. Within 11 months, Sully scaled 26x, adding 20M+ minutes to healthcare workforce capacity and raising $32M+ at a $150M valuation.",
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
  quote: {
    heading: "What Did Sully’s CEO Say?",
    text: "Thanks for the super quick turnarounds and working with us to keep refining on the brand direction. We and our customers are really happy with the new website!",
    name: "Ahmed Omar",
    role: "Co-founder & CEO",
    image: {
      media: { type: "image", src: "/media/sully/ahmed-omar.png" },
      alt: "Ahmed Omar, co-founder and CEO of Sully.ai",
    },
  },
  faqHeading: "Frequently Answered Question",
  faq: [
    {
      q: "What did the Sully website redesign include?",
      a: "The redesign covered the full website — product pages, motion-driven concept explainers, a unified brand system, and a structural SEO overhaul.",
    },
    {
      // Verbatim from Figma.
      q: "How much funding has Sully raised?",
      a: "Sully has raised $32M+ at a $150M valuation and is backed by Y Combinator.",
    },
    {
      q: "What is Sully's valuation?",
      a: "Sully's most recent raise valued the company at $150M.",
    },
    {
      // TODO: confirm the batch with the client before launch.
      q: "When was Sully in Y Combinator?",
      a: "Sully is a Y Combinator-backed company.",
    },
    {
      q: "What design approach worked for Sully?",
      a: "We treated it as a sales enablement problem — motion-driven explainers, enterprise clarity, a consistent brand system, and strategic SEO.",
    },
  ],
  moreProjects: [
    { slug: "greptile-design-system", tags: "Branding & Product Design" },
    { slug: "sainapse", tags: "Branding, Website & Motion Design" },
  ],
};

export const caseStudies = { greptile, sainapse, sully };
