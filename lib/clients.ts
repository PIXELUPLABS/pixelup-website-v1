/**
 * Working client roster for /clients.
 *
 * This first pass is intentionally sourced from client information already
 * present in lib/projects.ts, lib/case-studies.ts, and TrustedStrip. Entries
 * marked `placeholder` need their niche and/or engagement scope confirmed
 * before this page is treated as the complete historical roster.
 */
export interface Client {
  slug: string;
  name: string;
  logo?: string;
  niche: string;
  engagement: string;
  caseStudySlug?: string;
  website?: string;
  placeholder?: boolean;
}

export const clients: Client[] = [
  {
    slug: "bland",
    name: "Bland",
    logo: "/media/logos/bland.svg",
    niche: "AI voice infrastructure",
    engagement: "Brand identity and digital experience design for an AI communications platform.",
    website: "https://www.bland.ai/",
    placeholder: true,
  },
  {
    slug: "ctgt",
    name: "CTGT",
    niche: "Enterprise AI",
    engagement: "Brand identity and website design for an enterprise AI interpretability platform.",
    website: "https://www.ctgt.ai/",
  },
  {
    slug: "greptile",
    name: "Greptile",
    niche: "AI developer tools",
    engagement: "Brand identity, product design, website design, and sales enablement assets.",
    caseStudySlug: "greptile",
  },
  {
    slug: "henry-labs",
    name: "Henry Labs",
    niche: "Agentic commerce",
    engagement: "Brand identity, website design, and product design for an agentic commerce platform.",
    website: "https://henrylabs.ai/",
  },
  {
    slug: "pogo",
    name: "Pogo",
    logo: "/media/logos/pogo.svg",
    niche: "Consumer technology",
    engagement: "Brand and product experience design for a consumer rewards platform.",
    website: "https://www.joinpogo.com/",
    placeholder: true,
  },
  {
    slug: "razorpay",
    name: "Razorpay",
    niche: "Fintech and payments",
    engagement: "Digital experience design for a modern payments and financial technology platform.",
    website: "https://razorpay.com/",
    placeholder: true,
  },
  {
    slug: "reducto",
    name: "Reducto",
    niche: "Document AI",
    engagement: "Product and website design for an enterprise document intelligence platform.",
    website: "https://reducto.ai/",
  },
  {
    slug: "revyl",
    name: "Revyl",
    niche: "AI developer tools",
    engagement: "Brand identity, website design, and product design for mobile testing infrastructure.",
    website: "https://revyl.com/",
  },
  {
    slug: "sainapse",
    name: "Sainapse",
    logo: "/media/logos/sainapse.svg",
    niche: "Customer support AI",
    engagement: "Brand identity and website design for an enterprise customer intelligence platform.",
    caseStudySlug: "sainapse",
  },
  {
    slug: "streamline",
    name: "Streamline",
    logo: "/media/logos/streamline.svg",
    niche: "Legal AI",
    engagement: "Brand identity, positioning, website design, and a reusable digital design system.",
    caseStudySlug: "streamline",
  },
  {
    slug: "sully",
    name: "Sully.ai",
    niche: "Healthcare AI",
    engagement: "Website design, product pages, motion design, and SEO for a healthcare platform.",
    caseStudySlug: "sully",
  },
  {
    slug: "valley",
    name: "Valley",
    niche: "Sales AI",
    engagement: "Brand identity and website design for an AI outbound sales platform.",
    website: "https://www.joinvalley.co/",
  },
];
