/**
 * Client testimonials, pulled from the Contra reviews page
 * (https://contra.com/daksh_aswal_dt5tfn27/reviews) on 2026-10-01. These are
 * all six written reviews; Contra counts seven because Greptile also left an
 * earlier rating-only review with no text.
 *
 * Quotes are verbatim with two exceptions: the two reviews that shorten the
 * brand name are normalized to PIXELUP LABS, per the repo-wide naming rule,
 * and Greptile's is adapted to name the team (original kept beside it). Roles
 * are the title on each reviewer's own Contra profile. Newest first.
 */
export interface Testimonial {
  slug: string;
  quote: string;
  name: string;
  role?: string;
  company?: string;
  /** Approved client wordmark from public/media/logos/clients. Width and
      height are the SVG's viewBox, so next/image keeps its aspect ratio. */
  logo?: { src: string; width: number; height: number };
  /** Date the review was posted on Contra. */
  date: string;
}

export const testimonials = {
  henrylabs: {
    slug: "henrylabs",
    quote:
      "PIXELUP LABS has been a great partner for us at Henry Labs. They handled our landing page redesign and core product design, and the output speaks for itself. Fast, thoughtful, and easy to work with — highly recommend!",
    name: "Faaris Hussain",
    role: "COO",
    company: "Henry Labs",
    logo: { src: "/media/logos/clients/henrylabs.svg", width: 1453, height: 208 },
    date: "2026-04-28",
  },
  "contra-labs": {
    slug: "contra-labs",
    quote:
      "Great collaboration with Daksh! Great experience with reliable communication, fast iteration, and implementing feedback quickly. Thank you for the hard work dedicated to our project!",
    name: "Alli Minetti",
    role: "Human Data Research",
    company: "Contra Labs",
    date: "2026-02-09",
  },
  "jerry-liu": {
    slug: "jerry-liu",
    quote:
      "Daksh has top tier design sense. Would recommend working with him on branding.",
    name: "Jerry Liu",
    date: "2025-08-26",
  },
  "synthio-labs": {
    slug: "synthio-labs",
    quote:
      "We've had a great experience working with Daksh and team. They not only get timelines (a rarity!) but truly understand the vision and story we, as founders, want to tell. Their brand and design aesthetic is modern, and deeply aligned with product thinking it never feels like design for design’s sake. Looking forward to continuing the collaboration as we build out our product further.",
    name: "Sahitya S",
    role: "Co-founder",
    company: "Synthio Labs",
    logo: { src: "/media/logos/clients/synthio-labs.svg", width: 1217, height: 212 },
    date: "2025-07-25",
  },
  jumbo: {
    slug: "jumbo",
    quote:
      "Daksh (w/ PIXELUP LABS) has been a key design partner in our journey at Jumbo. They've helped us rethink core product flows and craft new game experiences with clarity and speed. The team brings sharp thinking, great taste, and a bias for execution, highly recommended for fast-moving product teams.",
    name: "Devansh Agarwal",
    role: "Co-founder",
    company: "Jumbo",
    logo: { src: "/media/logos/clients/jumbo.svg", width: 870, height: 180 },
    date: "2025-06-03",
  },
  greptile: {
    slug: "greptile",
    // Adapted to name the team. Contra original: "Daksh is a tier-1 designer,
    // with great taste, attention-to-detail, and strong product intuition. I
    // highly recommend working with him."
    quote:
      "PIXELUP LABS is a tier-1 design team, with great taste, attention-to-detail, and strong product intuition. I highly recommend working with them.",
    name: "Daksh Gupta",
    role: "CEO",
    company: "Greptile",
    logo: { src: "/media/logos/clients/greptile.svg", width: 256, height: 62 },
    date: "2025-05-26",
  },
} satisfies Record<string, Testimonial>;

/** The /call sidebar slider, in display order. Greptile leads; Henry Labs and
    Jumbo follow because both quotes speak to the team, not just one designer. */
export const callPageTestimonials: Testimonial[] = [
  testimonials.greptile,
  testimonials.henrylabs,
  testimonials.jumbo,
];
