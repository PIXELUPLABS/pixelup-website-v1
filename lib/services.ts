import type { CaseMetric, FaqItem, MediaSlot } from "./case-studies";
import type { ProjectMedia } from "./projects";

/**
 * /services page content. One entry per service, rendered as a row by
 * components/services/ServiceSection.tsx in this order. Adding or cutting a
 * service is one entry here: the page, both section navs, the footer's
 * Services column and the JSON-LD all read from this list.
 *
 * The index only shows name, headline, proof, scope and gallery. The longer
 * fields (intro, deliverables, snapshot, note, timeline, bestWhen) are kept
 * for the /services/<id> detail pages.
 */

/** One carousel slide: real delivered work, from any client. An image, or
 * for Motion Design a muted looping video (CaseMediaSlot plays it). */
export interface ServiceSlide extends MediaSlot {
  media: ProjectMedia;
  alt: string;
}

/** A service's detail page. The id is both its slug and its anchor on /services. */
export const serviceHref = (id: string) => `/services/${id}`;

/** One paragraph of a work snapshot. `client` renders emphasised and leads
 * the sentence; `context` scopes the claim, e.g. Greptile is always dated to
 * the 2025 rebrand and design system. */
export interface SnapshotEntry {
  client?: string;
  context?: string;
  text: string;
}

export interface ServiceSnapshot {
  entries: SnapshotEntry[];
  caseStudy?: { label: string; href: string };
}

export interface Service {
  /** Slug for /services/<id> and the section anchor on /services. Keep stable:
   * the footer links here. */
  id: string;
  name: string;
  /** Shorter label for the section navs and the footer, where it differs from name. */
  navLabel: string;
  headline: string;
  intro: string[];
  /** Short punch line under the intro. */
  pullLine?: string;
  deliverables: string[];
  /** null = no approved client work to cite yet. The row shows a
   * prototype-only marker in development and is left out in production. */
  snapshot: ServiceSnapshot | null;
  /** Extra labelled row after the deliverables, for the detail pages. */
  note?: { label: string; text: string };
  timeline: string;
  bestWhen: string;
  /** One sourced line for the index row. Left out until there is approved work to cite. */
  proof?: string;
  /** What the service covers, under the index carousel. Title Case, comma
   * separated, the case-study Involvement format. No client names. */
  scope: string;
  /** Carousel slides, lead first. Real work reused from case studies and the
   * homepage. Landscape only (about 3:2 or wider): the slide frame is 1160x696
   * and crops to fill, so a portrait mockup loses its top and bottom. For a
   * website shot, the site itself must sit fully inside the frame. */
  gallery: ServiceSlide[];
}

export const services: Service[] = [
  {
    id: "branding",
    name: "Brand Sprint",
    navLabel: "Brand Sprint",
    headline: "Look like the safe bet at first glance",
    intro: [
      "Enterprise buyers are not judging your product in the first five seconds. They are judging whether you will still exist in three years. Branding decides that: the persona, the type, the one opinion you hammer ten ways until buyers recognize you before they read the logo.",
    ],
    pullLine: "Recognition is faster than recall.",
    deliverables: [
      "A competitor benchmark and first-perception study, so we fix the actual gap",
      "Positioning and messaging, written down and argued for",
      "A personified identity: mark, type, color, motion principles, art direction",
      "Guidelines your team can apply without calling us",
    ],
    snapshot: {
      entries: [
        {
          client: "Greptile",
          context: "2025 rebrand and design system",
          text: "“we find bugs in your codebase” became a green lizard that kills bugs. One idea, everywhere, in a category shipping the same abstract gradient. YC W24, later a $25M Series A led by Benchmark.",
        },
        {
          client: "Bland",
          text: "wanted a deliberately bland persona. We built it on purpose, and it works because it commits.",
        },
      ],
      caseStudy: { label: "Read the Greptile case study", href: "/case-studies/greptile" },
    },
    timeline: "2 weeks",
    bestWhen:
      "You have a real opinion about your market and you wish your brand said it better",
    proof: "Greptile, 2025 rebrand: demo requests doubled in week one, then a $25M Series A led by Benchmark.",
    scope: "Identity, Guidelines, Campaigns",
    gallery: [
      { media: { type: "image", src: "/media/varick/blade-sign.avif" }, alt: "Varick wordmark on a navy blade sign beside a timber-clad doorway" },
      { media: { type: "image", src: "/media/replay/billboard.avif" }, alt: "Replay billboard on an office tower reading 'Fund growth by licensing the data you already have.', brand identity by PIXELUP LABS" },
      { media: { type: "image", src: "/media/fuseai/billboard.avif" }, alt: "FuseAI 'Unified Revenue Engine' billboard" },
      { media: { type: "image", src: "/media/avantra/l-wallpanel.avif" }, alt: "Avantra 'Real time' sign with the gold coil mark on a sunlit stucco wall" },
      { media: { type: "image", src: "/media/varick/poster-concrete.avif" }, alt: "Varick 'Make Your Organization AI Native' V poster on a concrete wall" },
      { media: { type: "image", src: "/media/replay/stage/base.avif" }, alt: "Replay keynote stage reading 'We're setting the standard' beside a 3D Replay mark" },
      { media: { type: "image", src: "/media/avantra/l-e-trident.avif" }, alt: "Slide: Avantra wordmark beside a gold trident on black" },
    ],
  },
  {
    id: "web-design",
    name: "Website Sprint",
    navLabel: "Website Sprint",
    headline: "Sell before your AE knows the buyer exists",
    intro: [
      "Your website is the six silent minutes after a good demo. A buyer looks for a reason to believe you are safe, then forwards the deal internally or does not. We design sites as sales enablement, built around the objection you keep losing to.",
    ],
    pullLine:
      "The site you shipped in a weekend in 2024 sold seed-stage you. It is now selling that story to a VP at a Fortune 500.",
    deliverables: [
      "A page-by-page argument, mapped to the objections that stall your deals",
      "Full copy, or a rewrite of yours. We take a position on the words",
      "Every page that matters: home, product, pricing, customers, careers",
      "A conversion path that assumes an enterprise buyer, not a self-serve signup",
    ],
    snapshot: {
      entries: [
        {
          client: "Sully",
          text: "came to us for a website redesign. We reframed it as a sales enablement problem and designed against that instead. This was their site through the $0.5M to $5M ARR stretch; they have since raised $32M. Their words: “super quick turnarounds.”",
        },
      ],
      caseStudy: { label: "Read the Sully case study", href: "/case-studies/sully" },
    },
    timeline: "3 weeks, or 4 to 6 weeks with brand",
    bestWhen: "Buyers like the demo and go quiet afterward",
    proof: "Sully: 26x in 11 months after the redesign, then a $32M+ raise.",
    scope: "Site Strategy, Copy, Page Design",
    gallery: [
      { media: { type: "image", src: "/media/sully.jpg" }, alt: "Sully.ai homepage hero on a laptop mockup, website design by PIXELUP LABS" },
      { media: { type: "image", src: "/media/avantra/l-web-hero.avif" }, alt: "Avantra website hero: 'Enabling real-time intelligence'" },
      { media: { type: "image", src: "/media/ctgt.png" }, alt: "CTGT website design by PIXELUP LABS" },
      { media: { type: "image", src: "/media/streamline/img-1.png" }, alt: "Streamline homepage hero 'In-house legal runs on Streamline' on a tablet held in hands" },
      { media: { type: "image", src: "/media/sully/img-9.png" }, alt: "Sully.ai Partner with Sully Labs page on a phone" },
      { media: { type: "image", src: "/media/henry-labs/asset-2.avif" }, alt: "Henry Labs website hero 'Own your checkout.' over a glowing mountain landscape" },
      { media: { type: "image", src: "/media/sully/img-6.png" }, alt: "Sully.ai scribes-versus-dictation comparison page on a laptop" },
    ],
  },
  {
    id: "product-design",
    name: "Product Design",
    navLabel: "Product Design",
    headline: "Look like you already run in production",
    intro: [
      "Winning a bake-off on capability is not the same as looking deployable. Product design is where a buyer decides whether your interface survives contact with their team, their security review, and their least technical stakeholder.",
    ],
    deliverables: [
      "Core flows end to end: onboarding, the daily surface, admin, permissions, the empty states nobody budgets for",
      "Interfaces that make a complex model legible to a non-technical buyer in a demo",
      "Dashboards and agent surfaces that match the brand rather than fighting it",
      "A component library your engineers build from, not a set of screenshots",
    ],
    snapshot: {
      entries: [
        {
          client: "Sainapse",
          text: "sells into Ford and Freshworks. We built the IIRA framework to position the product, then designed the product around it, so the interface argues what the pitch argues.",
        },
        { text: "Also shipped for Reducto and CTGT." },
      ],
      caseStudy: { label: "Read the Sainapse case study", href: "/case-studies/sainapse" },
    },
    timeline: "2 to 4 weeks per surface",
    bestWhen: "The product is strong and the demo does not show it",
    proof: "Sainapse: now deployed at Ford, Avery Dennison and Freshworks.",
    scope: "Product UI, Dashboards, Onboarding",
    gallery: [
      { media: { type: "image", src: "/media/greptile/dashboard-tablet.avif" }, alt: "Greptile dashboard on a tablet held in two hands: highlight of the week, comments per day, credit summary and monthly usage" },
      { media: { type: "image", src: "/media/explorations/img-16.webp" }, alt: "Phone showing an in-app survey screen with a progress bar, a 248-points counter, a burger-meal purchase card, the question 'Did any part of this poster feel personally relevant to you?' and a woman's video bubble, beside floating data-source chips on a purple gradient" },
    ],
  },
  {
    id: "motion-design",
    name: "Motion Design",
    navLabel: "Motion Design",
    headline: "Show what a screenshot cannot",
    intro: [
      "Most AI products do something a static image cannot explain. Motion is how you show it: the model working, the agent acting, the latency you are proud of. Done badly it is decoration. Done properly it is the shortest proof you own.",
    ],
    deliverables: [
      "Product demos and loops that show real output, not a cursor gliding over a mockup",
      "Brand motion principles: how the logo moves, how the site transitions, how a launch feels",
      "Launch assets sized for the surfaces you post on: site hero, LinkedIn, X, YouTube",
      "UI micro-interaction specs your engineers can implement, easing written down",
    ],
    // Pending: needs the project behind "conceptualised, designed and
    // animated in under 3 days" before a client can be named here.
    snapshot: null,
    timeline: "3 days to 1 week per asset",
    bestWhen:
      "You have a launch date and the product is hard to explain in a still",
    proof: "Sully: one explainer page helped close a major enterprise contract.",
    scope: "Brand Films, UI Motion, Kinetic Type",
    gallery: [
      { media: { type: "video", src: "/media/varick/opener-loop.mp4", poster: "/media/varick/opener-loop-poster.jpg" }, alt: "Varick brand film: close-ups of the letterforms under construction, then the wordmark and V on a blue glow" },
      { media: { type: "video", src: "/media/replay/records-illustration.mp4", poster: "/media/replay/records-illustration-poster.jpg" }, alt: "Isometric stack of a company's records, code, documents, tickets and messages, totalling 25M+ records" },
      { media: { type: "video", src: "/media/fuseai/subway-billboard.mp4", poster: "/media/fuseai/subway-billboard-poster.jpg" }, alt: "FuseAI's brand animation playing on a billboard above a subway escalator" },
      { media: { type: "video", src: "/media/replay/logo-loop.mp4", poster: "/media/replay/logo-loop-poster.jpg" }, alt: "Replay's arch mark and serif wordmark drawn as vector outlines" },
      { media: { type: "video", src: "/media/replay/signature.mp4", poster: "/media/replay/signature-poster.jpg" }, alt: "Brendan Mahony's signature being written above 'Founder & CEO'" },
    ],
  },
  {
    id: "website-development",
    name: "Website Development",
    navLabel: "Website Development",
    headline: "Ships in a stack your team can maintain",
    intro: [
      "We build in Webflow, Framer, Astro, and Next.js, chosen by who edits the site in eight months. Marketers get Webflow or Framer. Engineering-owned sites that live next to the app get Astro or Next.js. Nobody should need an agency to change a headline.",
    ],
    pullLine:
      "An expensive rebrand decays in about eight months without a system. That is brand entropy, and it is a build problem more than a design problem.",
    deliverables: [
      "The site built and launched, responsive and fast, not a Figma file with a bill attached",
      "CMS structured so your team ships posts and landing pages without tickets",
      "A component library and dev-first docs, so new pages inherit the brand instead of diluting it",
      "Analytics, SEO basics, and schema wired at launch rather than retrofitted",
      "A working session with your team, so the system survives us leaving",
    ],
    snapshot: {
      entries: [
        {
          client: "Greptile",
          context: "2025 design system",
          text: "200+ components with dev-first documentation. Their reported result was a 40% boost in shipping speed. The system made their own team faster, which is why the brand still holds.",
        },
      ],
      caseStudy: { label: "Read the Greptile case study", href: "/case-studies/greptile" },
    },
    timeline: "1 to 2 weeks after design sign-off",
    bestWhen: "You want to own the site afterward",
    proof: "Henry Labs: brand, website and Webflow build from one team.",
    scope: "Webflow, Framer, Astro, Next.js",
    gallery: [
      { media: { type: "image", src: "/media/sully/img-3.png" }, alt: "Sully.ai homepage hero 'Superhuman team of AI-employees for healthcare' projected on a large stage screen, with a speaker silhouetted in front of a seated audience" },
      { media: { type: "image", src: "/media/monumint.jpg" }, alt: "Monumint homepage 'Conversational AI for finance institutions' with a classical bank illustration, on a laptop resting on a sculpted white surface" },
      { media: { type: "image", src: "/media/pogo.jpg" }, alt: "Pogo mobile site 'Powered by the pogo app' with user stat cards, on a phone held toward the camera by a person in a dark suit against a lavender background" },
      { media: { type: "image", src: "/media/streamline/img-7.png" }, alt: "Streamline 'Built for how modern legal teams work' page with two team portraits, on a tablet held in two hands against a soft blurred background" },
      { media: { type: "image", src: "/media/henry-labs/70.avif" }, alt: "Henry Labs features section 'Everything you need to build, monetize, and optimize' with cards for affiliate links, transaction fees and merchant of record, framed over a dusk landscape" },
      { media: { type: "image", src: "/media/zenact.jpg" }, alt: "Zenact homepage 'Your entire product, tested for you.' with an orange call-to-action and phone preview, on a studio monitor against an orange striped gradient" },
    ],
  },
  {
    // The retainer: the same team, kept on after a sprint. Facts: Greptile's
    // ongoing marketing assets are its engagement line in lib/clients.ts; "no
    // minimum term" and "about 10 of our first 35 projects" are from the
    // AI-agencies article's "What happens after an AI startup hires a design
    // agency?" answer. No price here, as on the rest of the page.
    id: "creative-partner",
    name: "Design Creative Partner",
    navLabel: "Creative Partner",
    headline: "Your design team after the launch",
    intro: [
      "A launch starts the work. Campaigns, decks, social posts, landing pages and event assets keep coming, and each one either builds the brand or dilutes it. On retainer, the team that built your brand keeps making what marketing and sales need, month after month.",
    ],
    pullLine: "A brand is only as strong as the hundredth thing made with it.",
    deliverables: [
      "Campaign and launch assets: social, ads, events and print",
      "Sales material: pitch decks, one-pagers and case study layouts",
      "New landing pages and site updates, built inside your existing system",
      "One queue with senior designers and founder-led creative direction",
    ],
    snapshot: {
      entries: [
        {
          client: "Greptile",
          text: "after the brand refresh and design system, we stayed on for the pitch deck and ongoing marketing assets.",
        },
      ],
      caseStudy: { label: "Read the Greptile case study", href: "/case-studies/greptile" },
    },
    timeline: "Monthly, with no minimum term",
    bestWhen: "Your brand is set and marketing needs more design than your team can make",
    proof: "About 10 of our first 35 projects continued on a retainer.",
    scope: "Campaigns, Decks, Social, Landing Pages",
    gallery: [
      { media: { type: "image", src: "/media/avantra/l-triple.avif" }, alt: "Avantra three lightboxes: 'Production teaches the model', 'Co-designed from the silicon up' and '14x lower first audio latency'" },
      { media: { type: "image", src: "/media/varick/billboard-towers.avif" }, alt: "Varick 'Make Your Organization AI Native' billboard with glass towers" },
      { media: { type: "image", src: "/media/avantra/l-three-ways-deck.avif" }, alt: "Deck slide: 'Three ways to consume Avantra' with three relief medallions on cream" },
      { media: { type: "image", src: "/media/greptile/vibe-check.avif" }, alt: "Greptile banner answering 'vibe coding?' with 'vibe check greptile.' over a dot-matrix lizard" },
      { media: { type: "image", src: "/media/greptile/subway-poster.avif" }, alt: "Greptile poster in a subway car: a halftone lizard above a sign-up strip with a QR code" },
      { media: { type: "image", src: "/media/avantra/l-quote.avif" }, alt: "Avantra deck quote slide: 'For decades technologists have teased us with the dream'" },
    ],
  },
];

/** Anchors for the sidebar and mobile section navs, in page order. */
export const servicesPageNav: { id: string; label: string; index?: string }[] = [
  ...services.map((service, i) => ({
    id: service.id,
    label: service.navLabel,
    index: String(i + 1).padStart(2, "0"),
  })),
];

export const servicesTrust: CaseMetric[] = [
  { value: "+31", label: "Projects" },
  { value: "5.0★", label: "On every review" },
  { value: "YC", label: "Hired" },
  { value: "$250k+", label: "Earned on Contra" },
];

export const idealClient = {
  heading: "We work with B2B and AI-native tech companies going upmarket",
  line: "Funded B2B software adding a sales-led tier, 31 times so far. Mostly AI, not only: Monumint is fintech, Sully is healthcare.",
  rightFit: [
    { label: "Category", text: "B2B and AI-native tech companies" },
    { label: "Stage", text: "Seed to Series B" },
    { label: "Team", text: "10 to 80 people" },
    { label: "Motion", text: "PLG to sales-led, first AE hired" },
    {
      label: "Trigger",
      text: "You have product-market fit and are going upmarket, selling to enterprise, or have outgrown your brand",
    },
  ],
};

export const servicesFaq: FaqItem[] = [
  {
    q: "How long does it take?",
    a: "Brand: 2 weeks. Website: 3 weeks. Both: 4 to 6 weeks. Motion: 3 days to a week per asset. Anyone promising your metrics move in two weeks? Run.",
  },
  {
    q: "Can we hire you for one service?",
    a: "Yes. Most start with brand or website and add product or motion later, often on retainer. We won’t execute a locked Figma file with no say in the strategy.",
  },
  {
    q: "Do you do positioning, or just design?",
    a: "Positioning first: the IIRA framework for Sainapse, “agents” to “workers” for Workers.io, all before any pixels. If your strategy is locked, a freelancer is cheaper.",
  },
  {
    q: "What do you build websites in?",
    a: "Webflow or Framer when marketing edits the site. Astro or Next.js when engineering owns it. You should never need us to change a headline.",
  },
  {
    q: "Who owns the design system afterward?",
    a: "You do: components, dev-first docs and a working session with your team. Greptile’s 2025 system: 200+ components and a reported 40% boost in shipping speed.",
  },
  {
    q: "Who does the work?",
    a: "A seven-person senior studio with founder-led creative direction. No junior hand-off, no account manager in between.",
  },
  {
    q: "Why should we not hire you?",
    a: "You’re pre-PMF, with nothing to amplify. Your rebrand needs a committee: hire a bigger firm. Your strategy is locked: hire a freelancer. You expect design to generate leads: that’s a growth team’s job.",
  },
];

/** FAQPage structured data for the /services FAQ. Keep in sync with `servicesFaq`. */
export const servicesFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: servicesFaq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};
