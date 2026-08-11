/**
 * Confirmed client roster for /clients.
 *
 * Copy is supplied by the PIXELUP LABS team. Logo paths point to approved
 * vector exports; Grovio is the only current entry awaiting its final SVG.
 *
 * Order is by general brand recognition (public/media fame in the AI and
 * startup world), most recognizable first — not strictly by funding size.
 * A few names carry outsized public buzz relative to their round (Bland.ai,
 * Greptile), while others raised large amounts but stay recognized mostly
 * within their own niche (e.g. Umbra within crypto). This is a judgment
 * call, not a hard metric — revisit if the roster's makeup changes.
 */
export interface Client {
  slug: string;
  name: string;
  logo?: string;
  niche: string;
  engagement: string;
  /**
   * Short funding/stat line rendered under the client's logo in the roster
   * (e.g. "$25M Series A", "YC-backed (W24)", "Bootstrapped"). Sourced from
   * public reporting (Crunchbase, TechCrunch, YC's own directory, the
   * client's own funding announcement) as of Aug 2026 — same no-unsourced-
   * claims bar as lib/projects.ts taglines. Left undefined where no public
   * figure/round could be confirmed, or where the company name was too
   * generic to confirm a match with confidence — no line renders in that
   * case rather than guessing.
   */
  fundingNote?: string;
}

export const clients: Client[] = [
  {
    slug: "greptile",
    name: "Greptile",
    logo: "/media/logos/clients/greptile.svg",
    niche: "AI Code Review",
    engagement:
      "2026 brand refresh, design system, pitch deck, and ongoing marketing assets",
    fundingNote: "$25M Series A",
  },
  {
    slug: "bland",
    name: "Bland.ai",
    logo: "/media/logos/bland.svg",
    niche: "Voice AI",
    engagement:
      "New visual direction, landing page redesign, and positioning deck",
    fundingNote: "$50M Series C",
  },
  {
    slug: "reducto",
    name: "Reducto",
    logo: "/media/logos/clients/reducto.svg",
    niche: "Document AI",
    engagement:
      "Website redesign, brand assets, icon library, and product UI with motion specs, dev-ready",
    fundingNote: "$75M Series B",
  },
  {
    slug: "streamline",
    name: "Streamline.ai",
    logo: "/media/logos/streamline.svg",
    niche: "Legal AI",
    engagement:
      "Full brand identity, brandbook, and marketing website, with Webflow development",
    fundingNote: "$8.6M Series A",
  },
  // {
  //   slug: "umbra",
  //   name: "Umbra",
  //   logo: "/media/logos/clients/umbra.svg",
  //   niche: "Crypto Privacy",
  //   engagement: "Landing-page design + supporting brand assets.",
  //   fundingNote: "$155M ICO",
  // },
  {
    slug: "sully",
    name: "Sully.ai",
    logo: "/media/logos/clients/sully.svg",
    niche: "Healthcare AI",
    engagement: "Complete 2025 rebrand covering new identity, guidelines, and website redesign, with Framer development",
    fundingNote: "$22M Series A",
  },
  {
    slug: "pogo",
    name: "Pogo",
    logo: "/media/logos/pogo.svg",
    niche: "Consumer Research",
    engagement: "Full multi-page marketing website, with Webflow development",
    fundingNote: "$32M",
  },
  {
    slug: "valley",
    name: "Valley",
    logo: "/media/logos/clients/valley.svg",
    niche: "AI Sales",
    engagement:
      "Brand identity, marketing website, and final sales deck, with Framer development",
    fundingNote: "$3.1M Pre-Seed",
  },
  {
    slug: "ctgt",
    name: "CTGT",
    logo: "/media/logos/clients/ctgt.svg",
    niche: "AI Governance",
    engagement:
      "Brand identity, marketing website, product storyboards, and pitch deck, with Webflow development",
    fundingNote: "$7.2M Seed",
  },
  {
    slug: "autumn-pricing",
    name: "Autumn Pricing",
    logo: "/media/logos/clients/autumn-pricing.svg",
    niche: "AI Billing",
    engagement:
      "Full brand identity, marketing website, and social brand assets, with Next.js development",
    fundingNote: "$7M YC-backed (S25)",
  },
  {
    slug: "monumint",
    name: "Monumint",
    logo: "/media/logos/clients/monumint.svg",
    niche: "Fintech AI",
    engagement:
      "Complete brand identity and landing page, with Framer development",
    fundingNote: "$3.2M YC-backed (W24)",
  },
  {
    slug: "sainapse",
    name: "Sainapse",
    logo: "/media/logos/sainapse.svg",
    niche: "Customer Support AI",
    engagement: "Full brand identity and marketing website across two sprints, with Webflow development",
    fundingNote: "Private",
  },
  {
    slug: "limelight",
    name: "Limelight",
    logo: "/media/logos/clients/limelight.svg",
    niche: "Marketing AI",
    engagement:
      "Brand identity, marketing website, custom illustrations, and animation storyboards, with Webflow development",
    fundingNote: "$2M Seed",
  },
  {
    slug: "revyl",
    name: "Revyl",
    logo: "/media/logos/clients/revyl.svg",
    niche: "AI Testing",
    engagement:
      "Brand guidelines, marketing website, product UI redesign, and component library, dev-ready",
    fundingNote: "$1.5M YC-backed (F24)",
  },
  {
    slug: "zenact",
    name: "Zenact",
    logo: "/media/logos/clients/zenact.svg",
    niche: "AI Testing",
    engagement:
      "Brand identity, marketing website, and finalized copy, with Webflow development",
    fundingNote: "Private",
  },
  {
    slug: "henrylabs",
    name: "Henrylabs",
    logo: "/media/logos/clients/henrylabs.svg",
    niche: "Agentic Commerce",
    engagement:
      "Brand identity, landing page, and product reskin (dashboard + checkout), with Webflow development",
    fundingNote: "Private",
  },
  {
    slug: "jumbo",
    name: "Jumbo",
    logo: "/media/logos/clients/jumbo.svg",
    niche: "Fantasy Gaming",
    engagement:
      "Ongoing product retainer: full app UI, brand refresh, design system, and marketing creatives",
    fundingNote: "$1.5M Pre-Seed",
  },
  {
    slug: "dayflow",
    name: "DayFlow",
    logo: "/media/logos/clients/dayflow.svg",
    niche: "Developer Productivity",
    engagement:
      "Brand identity, product UI, marketing website, and full launch asset kit, with Webflow development",
    fundingNote: "Private",
  },
  {
    slug: "synthio-labs",
    name: "Synthio Labs",
    logo: "/media/logos/clients/synthio-labs.svg",
    niche: "Pharma Voice AI",
    engagement:
      "Brand direction, marketing website, product UI, whitepapers, and sales decks, with Webflow development",
    fundingNote: "$5M Seed",
  },
  {
    slug: "workers-io",
    name: "Workers.io",
    logo: "/media/logos/clients/workers-io.svg",
    niche: "AI Coding Agents",
    engagement:
      "Brand identity, marketing website, product UI, and design system, with Webflow development",
    fundingNote: "Private",
  },
  {
    slug: "audrion",
    name: "Audrion's",
    logo: "/media/logos/clients/audrion.svg",
    niche: "Compliance AI",
    engagement:
      "Full brand identity, 7-page marketing website, and sales deck, with Webflow development",
    fundingNote: "$500K YC-backed (F25) · Acquired",
  },
  // {
  //   slug: "my-wonder",
  //   name: "My Wonder",
  //   logo: "/media/logos/clients/my-wonder.svg",
  //   niche: "Kids Edtech",
  //   engagement:
  //     "E-commerce website spanning landing, catalogue, PDP, and waitlist + full companion app UI.",
  // },
  // {
  //   slug: "conigma",
  //   name: "Conigma",
  //   logo: "/media/logos/clients/conigma.svg",
  //   niche: "GTM Automation",
  //   engagement:
  //     "Full brand identity + marketing website, grounded in a competitor teardown.",
  // },
  // {
  //   slug: "conscious-engines",
  //   name: "Conscious Engines",
  //   logo: "/media/logos/clients/conscious-engines.svg",
  //   niche: "AI Inference",
  //   engagement:
  //     "Brand strategy + identity + end-to-end Felix assistant app design.",
  // },
  // {
  //   slug: "nfa",
  //   name: "NFA",
  //   logo: "/media/logos/clients/nfa.svg",
  //   niche: "Crypto Trading",
  //   engagement: "Complete Dub Dub-to-NFA rebrand + new landing page.",
  // },
  // {
  //   slug: "grovio",
  //   name: "Grovio.ai",
  //   niche: "AI Marketing",
  //   engagement: "Engagement scaffolded - no design work delivered yet.",
  //   fundingNote: "$32M Series A",
  // },
  // {
  //   slug: "vertera-health",
  //   name: "Vertera Health",
  //   logo: "/media/logos/clients/vertera-health.svg",
  //   niche: "Digital Health",
  //   engagement:
  //     "UI audit + app UI + landing page + App Store screenshots + pitch deck.",
  // },
];
