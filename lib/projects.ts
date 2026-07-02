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
}

export const projects: Project[] = [
  {
    slug: "greptile-design-system",
    label: "Greptile",
    href: "/greptile-design-system",
    external: false,
    media: { type: "image", src: "/media/greptile.png" },
  },
  {
    slug: "sainapse",
    label: "Sainapse",
    href: "https://sainapse-staging.webflow.io/",
    external: true,
    media: { type: "video", src: "/media/sainapse.mp4" },
  },
  {
    slug: "reducto",
    label: "Reducto",
    href: "https://reducto.ai/",
    external: true,
    media: { type: "image", src: "/media/reducto.png" },
  },
  {
    slug: "valley",
    label: "Valley",
    href: "https://www.joinvalley.co/",
    external: true,
    media: { type: "image", src: "/media/valley.png" },
  },
  {
    slug: "sully",
    label: "Sully.ai",
    href: "https://sully.ai/",
    external: true,
    media: { type: "image", src: "/media/sully.png" },
  },
  {
    slug: "revyl",
    label: "Revyl",
    href: "https://revyl.ai/",
    external: true,
    media: { type: "image", src: "/media/revyl.png" },
  },
  {
    slug: "synthio",
    label: "Synthio Labs",
    href: "https://synthiolabs.com/",
    external: true,
    media: { type: "image", src: "/media/synthio.png" },
  },
  {
    slug: "dayflow",
    label: "Dayflow",
    href: "https://dayflow.so/",
    external: true,
    media: { type: "image", src: "/media/dayflow.png" },
  },
  {
    slug: "jumbo-top-up",
    label: "Jumbo Top-up",
    href: "/jumbo-top-up",
    external: false,
    media: { type: "image", src: "/media/jumbo-top-up.png" },
  },
];

/** Global CTA / social links used across the site. */
export const links = {
  discoveryCall: "https://cal.com/pixelup/discovery",
  telegram: "https://t.me/dakshpixelup",
};
