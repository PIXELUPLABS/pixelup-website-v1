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
  /** Describes the card media — alt text for images, aria-label for videos. */
  alt: string;
  /** Square high-res crop used by the "More projects" cards on case pages. */
  cardImage?: string;
  /** Optional logo mark rendered centered on top of the card media (e.g. Sainapse). */
  overlayLogo?: string;
}

export const projects: Project[] = [
  {
    slug: "greptile",
    label: "Greptile",
    href: "/case-studies/greptile",
    external: false,
    media: { type: "image", src: "/media/greptile.png" },
    alt: "Glowing green Greptile logo mark on a dark background — brand and product design by PixelUp Labs",
    cardImage: "/media/greptile/card.png",
  },
  {
    slug: "henry-labs",
    label: "Henry Labs",
    href: "https://henrylabs.ai",
    external: true,
    media: { type: "video", src: "/media/henry-labs.mp4" },
    alt: "Henry Labs website motion reel — design by PixelUp Labs",
  },
  {
    slug: "ctgt",
    label: "CTGT",
    href: "https://www.ctgt.ai/",
    external: true,
    media: { type: "image", src: "/media/ctgt.png" },
    alt: "CTGT website design by PixelUp Labs",
  },
  {
    slug: "streamline",
    label: "Streamline",
    href: "https://www.streamline.ai/",
    external: true,
    media: { type: "image", src: "/media/streamline.png" },
    alt: "Streamline website design by PixelUp Labs",
  },
  {
    slug: "sainapse",
    label: "Sainapse",
    href: "/case-studies/sainapse",
    external: false,
    media: { type: "video", src: "/media/sainapse.mp4" },
    alt: "Sainapse brand reveal motion loop — brand identity by PixelUp Labs",
    cardImage: "/media/sainapse/card.png",
    overlayLogo: "/media/sainapse.svg",
  },
  {
    slug: "reducto",
    label: "Reducto",
    href: "https://reducto.ai/",
    external: true,
    media: { type: "image", src: "/media/reducto.png" },
    alt: "Reducto website design by PixelUp Labs",
  },
  {
    slug: "valley",
    label: "Valley",
    href: "https://www.joinvalley.co/",
    external: true,
    media: { type: "image", src: "/media/valley.png" },
    alt: "Valley website design by PixelUp Labs",
  },
  {
    slug: "sully",
    label: "Sully.ai",
    href: "/case-studies/sully",
    external: false,
    media: { type: "image", src: "/media/sully.png" },
    alt: "Sully.ai logo mark over a bright hospital corridor — website and motion design by PixelUp Labs",
    cardImage: "/media/sully/card.png",
  },
  {
    slug: "revyl",
    label: "Revyl",
    href: "https://revyl.ai/",
    external: true,
    media: { type: "image", src: "/media/revyl.png" },
    alt: "Revyl website design by PixelUp Labs",
  },
  {
    slug: "synthio",
    label: "Synthio Labs",
    href: "https://synthiolabs.com/",
    external: true,
    media: { type: "image", src: "/media/synthio.png" },
    alt: "Synthio Labs website design by PixelUp Labs",
  },
  {
    slug: "dayflow",
    label: "Dayflow",
    href: "https://dayflow.so/",
    external: true,
    media: { type: "image", src: "/media/dayflow.png" },
    alt: "Dayflow website design by PixelUp Labs",
  },
];

/** Global CTA / social links used across the site. */
export const links = {
  discoveryCall: "https://cal.com/pixelup/discovery",
  telegram: "https://t.me/dakshpixelup",
};
