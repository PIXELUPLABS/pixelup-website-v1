/**
 * Confirmed client roster for /clients.
 *
 * Copy is supplied by the PIXELUP LABS team. Logo paths point to approved
 * vector exports; Grovio is the only current entry awaiting its final SVG.
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
    slug: "audrion",
    name: "Audrion's",
    logo: "/media/logos/clients/audrion.svg",
    niche: "Compliance AI",
    engagement:
      "Full brand identity + 7-page marketing website + sales deck, through dev handoff.",
  },
  {
    slug: "autumn-pricing",
    name: "Autumn Pricing",
    logo: "/media/logos/clients/autumn-pricing.svg",
    niche: "AI Billing",
    engagement:
      "Full brand identity + marketing website with dev handoff + social assets.",
    fundingNote: "$7M YC-backed (S25)",
  },
  {
    slug: "bland",
    name: "Bland.ai",
    logo: "/media/logos/bland.svg",
    niche: "Voice AI",
    engagement:
      "Visual direction + landing-page redesign + case-study and blog templates + product UI + positioning deck.",
    fundingNote: "$50M Series C",
  },
  {
    slug: "ctgt",
    name: "CTGT",
    logo: "/media/logos/clients/ctgt.svg",
    niche: "AI Governance",
    engagement:
      "Brand identity + website + Policy Engine storyboards + pitch slides + social assets.",
    fundingNote: "$7.2M Seed",
  },
  // {
  //   slug: "my-wonder",
  //   name: "My Wonder",
  //   logo: "/media/logos/clients/my-wonder.svg",
  //   niche: "Kids Edtech",
  //   engagement:
  //     "E-commerce website spanning landing, catalogue, PDP, and waitlist + full companion app UI.",
  // },
  {
    slug: "conigma",
    name: "Conigma",
    logo: "/media/logos/clients/conigma.svg",
    niche: "GTM Automation",
    engagement:
      "Full brand identity + marketing website, grounded in a competitor teardown.",
  },
  // {
  //   slug: "conscious-engines",
  //   name: "Conscious Engines",
  //   logo: "/media/logos/clients/conscious-engines.svg",
  //   niche: "AI Inference",
  //   engagement:
  //     "Brand strategy + identity + end-to-end Felix assistant app design.",
  // },
  {
    slug: "dayflow",
    name: "DayFlow",
    logo: "/media/logos/clients/dayflow.svg",
    niche: "Developer Productivity",
    engagement:
      "Brand + product UI + website + launch assets, including Product Hunt kit and app icon.",
    fundingNote: "$4.5M YC-backed (S24)",
  },
  {
    slug: "nfa",
    name: "NFA",
    logo: "/media/logos/clients/nfa.svg",
    niche: "Crypto Trading",
    engagement: "Complete Dub Dub-to-NFA rebrand + new landing page.",
  },
  {
    slug: "greptile",
    name: "Greptile",
    logo: "/media/logos/clients/greptile.svg",
    niche: "AI Code Review",
    engagement:
      "2026 brand refresh + design system + website system + pitch deck + ongoing marketing.",
    fundingNote: "$25M Series A",
  },
  // {
  //   slug: "grovio",
  //   name: "Grovio.ai",
  //   niche: "AI Marketing",
  //   engagement: "Engagement scaffolded - no design work delivered yet.",
  //   fundingNote: "$32M Series A",
  // },
  {
    slug: "henrylabs",
    name: "Henrylabs",
    logo: "/media/logos/clients/henrylabs.svg",
    niche: "Agentic Commerce",
    engagement:
      "Brand identity + landing page with handoff + dashboard UI + checkout flow.",
  },
  {
    slug: "lasting-learn",
    name: "Lasting Learn",
    logo: "/media/logos/clients/lasting-learn.svg",
    niche: "AI Tutoring",
    engagement: "Brand guidelines + logo + marketing landing page.",
  },
  {
    slug: "limelight",
    name: "Limelight",
    logo: "/media/logos/clients/limelight.svg",
    niche: "Marketing AI",
    engagement:
      "Full brand + website + illustrations + animation storyboards, through handoff.",
  },
  {
    slug: "monumint",
    name: "Monumint",
    logo: "/media/logos/clients/monumint.svg",
    niche: "Fintech AI",
    engagement:
      "Complete branding package + landing page, from wireframes to final design.",
    fundingNote: "$3.2M YC-backed (W24)",
  },
  {
    slug: "pogo",
    name: "Pogo",
    logo: "/media/logos/pogo.svg",
    niche: "Consumer Research",
    engagement: "Full multi-page website with 9+ pages and developer handoff.",
    fundingNote: "$12.3M Seed",
  },
  {
    slug: "reducto",
    name: "Reducto",
    logo: "/media/logos/clients/reducto.svg",
    niche: "Document AI",
    engagement:
      "Website redesign + brand assets + icon library + product UI + animated handoff.",
    fundingNote: "$24.5M Series A",
  },
  {
    slug: "revyl",
    name: "Revyl",
    logo: "/media/logos/clients/revyl.svg",
    niche: "AI Testing",
    engagement:
      "Brand guidelines + website + product UI redesign + component library.",
    fundingNote: "$1.1M YC-backed (F24)",
  },
  {
    slug: "sainapse",
    name: "Sainapse",
    logo: "/media/logos/sainapse.svg",
    niche: "Customer Support AI",
    engagement: "Complete brand + website sprint through the 2.0 handoff.",
    fundingNote: "$3.5M Seed",
  },
  {
    slug: "streamline",
    name: "Streamline.ai",
    logo: "/media/logos/streamline.svg",
    niche: "Legal AI",
    engagement:
      "Full brand identity, including logo and brandbook + complete website handoff.",
    fundingNote: "$8.6M Series A",
  },
  {
    slug: "sully",
    name: "Sully.ai",
    logo: "/media/logos/clients/sully.svg",
    niche: "Healthcare AI",
    engagement: "2025 rebrand + complete website redesign.",
    fundingNote: "$22M Series A",
  },
  {
    slug: "synthio-labs",
    name: "Synthio Labs",
    logo: "/media/logos/clients/synthio-labs.svg",
    niche: "Pharma Voice AI",
    engagement:
      "Brand + full V2 website + Jarvis product UI + whitepapers + RFP decks.",
    fundingNote: "$5M Seed",
  },
  {
    slug: "umbra",
    name: "Umbra",
    logo: "/media/logos/clients/umbra.svg",
    niche: "Crypto Privacy",
    engagement: "Landing-page design + supporting brand assets.",
    fundingNote: "$155M ICO",
  },
  {
    slug: "valley",
    name: "Valley",
    logo: "/media/logos/clients/valley.svg",
    niche: "AI Sales",
    engagement:
      "Brand identity + website + final sales deck, through handoff.",
    fundingNote: "$2M Pre-Seed",
  },
  {
    slug: "vertera-health",
    name: "Vertera Health",
    logo: "/media/logos/clients/vertera-health.svg",
    niche: "Digital Health",
    engagement:
      "UI audit + app UI + landing page + App Store screenshots + pitch deck.",
  },
  {
    slug: "workers-io",
    name: "Workers.io",
    logo: "/media/logos/clients/workers-io.svg",
    niche: "AI Coding Agents",
    engagement:
      "Brand identity V1 + website + product UI + design system handoff.",
  },
  {
    slug: "zenact",
    name: "Zenact",
    logo: "/media/logos/clients/zenact.svg",
    niche: "AI Testing",
    engagement:
      "Brand identity + full website across landing, pricing, blog, and mobile + handoff.",
    fundingNote: "Bootstrapped",
  },
  {
    slug: "jumbo",
    name: "Jumbo",
    logo: "/media/logos/clients/jumbo.svg",
    niche: "Fantasy Gaming",
    engagement:
      "Ongoing product retainer covering full app UI, brand refresh, design system, landing page, and store creatives.",
  },
];
