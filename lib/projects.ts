/**
 * Showcase projects for the homepage.
 *
 * This is intentionally shaped like a CMS collection so it can later be swapped
 * for a real data source (see pixeluplabs-design-spec.md §7 for the field model).
 * `internal` projects link to a detail page on this site; `external` ones link
 * out to the live client site and open in a new tab.
 */
export type ProjectMedia =
  | { type: "image"; src: string }
  | { type: "video"; src: string; poster?: string };

export interface Project {
  slug: string;
  label: string;
  href: string;
  external: boolean;
  media: ProjectMedia;
  /** Describes the card media, alt text for images, aria-label for videos. */
  alt: string;
  /** Square high-res crop used by the "More projects" cards on case pages. */
  cardImage?: string;
  /** Optional logo mark rendered centered on top of the card media (e.g. Sainapse). */
  overlayLogo?: string;
  /**
   * One-line client descriptor under the card title in the homepage info block
   * ("AI Native dev tool startup, Series A 25M"). Keep it to a single line —
   * it truncates rather than wraps on desktop to protect the row rhythm.
   */
  tagline?: string;
  /** Disciplines we shipped. Rendered uppercase, comma-joined, in the info block. */
  services?: string[];
  /** Year the work shipped, right-hand column of the info block. */
  year?: string;
}

/**
 * `tagline` / `services` / `year` feed the homepage card info block.
 *
 * Greptile's three values are verbatim from the approved design. Every other
 * tagline is written from that client's own live site positioning (H1 + meta
 * description, read Aug 2025) and carries no funding or valuation claim we
 * can't source. `services` follow the discipline list Arjun supplied, mapped to
 * the design's full names: Brand → "Branding", Web → "Website Design",
 * Product → "Product Design".
 */
export const projects: Project[] = [
  {
    slug: "greptile",
    label: "Greptile",
    href: "/case-studies/greptile",
    external: false,
    media: { type: "image", src: "/media/greptile.png" },
    alt: "Glowing green Greptile logo mark on a dark background, brand and product design by PIXELUP LABS",
    cardImage: "/media/greptile/card.png",
    tagline: "AI Native dev tool startup, Series A 25M",
    services: ["Product Design", "Branding"],
    year: "2025",
  },
  {
    slug: "henrylabs",
    label: "Henry Labs",
    href: "/case-studies/henrylabs",
    external: false,
    media: { type: "video", src: "/media/henry-labs.mp4" },
    alt: "Henry Labs website motion reel, design by PIXELUP LABS",
    // Kept short on purpose: the three-discipline meta is the widest on the page,
    // so this line has ~46 characters before it truncates at 1200px.
    tagline: "Embedded checkout for agentic commerce",
    services: ["Branding", "Website Design", "Product Design"],
    year: "2026",
  },
  {
    slug: "ctgt",
    label: "CTGT",
    href: "https://www.ctgt.ai/",
    external: true,
    media: { type: "image", src: "/media/ctgt.png" },
    alt: "CTGT website design by PIXELUP LABS",
    tagline: "Applied interpretability lab for regulated industries",
    services: ["Branding", "Website Design"],
    year: "2026",
  },
  {
    slug: "streamline",
    label: "Streamline",
    href: "/case-studies/streamline",
    external: false,
    media: { type: "image", src: "/media/streamline.png" },
    alt: "Streamline website design by PIXELUP LABS",
    tagline: "AI intake and workflow automation for in-house legal",
    services: ["Branding", "Website Design"],
    year: "2026",
  },
  {
    slug: "sainapse",
    label: "Sainapse",
    href: "/case-studies/sainapse",
    external: false,
    media: { type: "video", src: "/media/sainapse.mp4" },
    alt: "Sainapse brand reveal motion loop, brand identity by PIXELUP LABS",
    cardImage: "/media/sainapse/card.png",
    overlayLogo: "/media/sainapse.svg",
    tagline: "AI customer intelligence for enterprise support teams",
    services: ["Branding", "Website Design"],
    year: "2025",
  },
  {
    slug: "reducto",
    label: "Reducto",
    href: "https://reducto.ai/",
    external: true,
    media: { type: "image", src: "/media/reducto.png" },
    alt: "Reducto website design by PIXELUP LABS",
    tagline: "Agentic document platform for enterprise AI teams",
    // Arjun flagged this pair as "ask Daksh" — confirm before it ships.
    services: ["Product Design", "Website Design"],
    year: "2025",
  },
  {
    slug: "valley",
    label: "Valley",
    href: "https://www.joinvalley.co/",
    external: true,
    media: { type: "image", src: "/media/valley.png" },
    alt: "Valley website design by PIXELUP LABS",
    tagline: "AI outbound sales platform for B2B revenue teams",
    services: ["Branding", "Website Design"],
    year: "2025",
  },
  {
    slug: "revyl",
    label: "Revyl",
    // revyl.ai 301s to revyl.com — link the destination directly, no redirect hop.
    href: "https://revyl.com/",
    external: true,
    media: { type: "image", src: "/media/revyl.png" },
    alt: "Revyl website design by PIXELUP LABS",
    // Same ~46-character ceiling as Henry Labs — three disciplines in the meta.
    tagline: "Mobile testing infrastructure for AI agents",
    services: ["Branding", "Website Design", "Product Design"],
    year: "2025",
  },
  {
    slug: "sully",
    label: "Sully.ai",
    href: "/case-studies/sully",
    external: false,
    media: { type: "image", src: "/media/sully.png" },
    alt: "Sully.ai logo mark over a bright hospital corridor, website and motion design by PIXELUP LABS",
    cardImage: "/media/sully/card.png",
    tagline: "AI clinical agents for hospitals and health systems",
    // Arjun's list says Brand + Web; the case study's `involvement` says
    // Website / Product Pages / Motion / SEO with no branding. Following the list.
    services: ["Branding", "Website Design"],
    year: "2025",
  },
  {
    slug: "zenact",
    label: "Zenact",
    href: "https://zenact.ai/",
    external: true,
    media: { type: "image", src: "/media/zenact.jpg" },
    alt: "Zenact website design by PIXELUP LABS",
    // From zenact.ai's live hero: AI agents play out natural-language
    // journeys to test apps like real users.
    tagline: "AI agents that test apps like real users",
    services: ["Branding", "Website Design", "Webflow Development"],
    year: "2026",
  },
  {
    slug: "autumn",
    label: "Autumn",
    href: "https://useautumn.com/",
    external: true,
    media: { type: "image", src: "/media/autumn.png" },
    alt: "Autumn website design by PIXELUP LABS",
    // Verbatim from useautumn.com's live H1.
    tagline: "The drop-in billing layer for AI startups",
    services: ["Branding", "Website Design", "Next.js Development"],
    // Year not confirmed yet — supply it to fill the info block's right column.
  },
  // {
  //   slug: "synthio",
  //   label: "Synthio Labs",
  //   href: "https://synthiolabs.com/",
  //   external: true,
  //   media: { type: "image", src: "/media/synthio.png" },
  //   alt: "Synthio Labs website design by PIXELUP LABS",
  // },
  //
  // NOT YET ADDABLE — Pogo, Bland, and Limelight are on the intended showcase
  // lineup but have no card media in /public/media and no confirmed live URL.
  // Each needs a ~1008x584 image or mp4 plus its site link before it can
  // become a card; the info-block copy can then be written from that site the
  // same way as the entries above.
];

/** Global CTA / social links used across the site. */
export const links = {
  /** Internal booking page with the Cal.com embed (see app/call). */
  bookCall: "/call",
  discoveryCall: "https://cal.com/pixelup/discovery",
  telegram: "https://t.me/dakshpixelup",
};
