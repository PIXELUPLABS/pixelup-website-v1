/**
 * "Featured on" badges for the tool directories Swipe is listed on, shown in
 * the strip directly above the /swipe Footer. Add one entry per directory once
 * the listing is live, using the badge image and link the directory gives you.
 *
 * - `href`: the listing URL from the directory's embed code. Kept dofollow
 *   (rel="noopener" only), since most directories require a followed link back
 *   in exchange for theirs.
 * - `src`: the badge image. Remote URLs from the embed code work as-is; a file
 *   saved under public/swipe/badges/ works too ("/swipe/badges/name.svg").
 * - `width` / `height`: the size the embed code asks for, so the row reserves
 *   its space before the images load.
 *
 * While this list is empty the strip renders nothing in production and a
 * placeholder in development, so it's visible where the badges will go.
 */
export interface DirectoryBadge {
  /** Directory name, used as the image alt text ("Featured on <name>"). */
  name: string;
  href: string;
  src: string;
  width: number;
  height: number;
}

export const directoryBadges: DirectoryBadge[] = [
  {
    name: "Findly.tools",
    href: "https://findly.tools/swipe-by-pixelup-labs?utm_source=swipe-by-pixelup-labs",
    src: "https://findly.tools/badges/findly-tools-badge-dark.svg",
    width: 175,
    height: 55,
  },
  {
    // Free launch, scheduled for Mar 8-14, 2027. The product page 404s until
    // then; dofollow only while this badge stays live (re-checked weekly).
    name: "ScrollLaunch",
    href: "https://www.scrolllaunch.com/products/swipe-by-pixelup-labs?ref=badge",
    src: "https://www.scrolllaunch.com/api/badge/swipe-by-pixelup-labs?variant=launched&theme=dark",
    width: 220,
    height: 48,
  },
  {
    // Free plan: manual review within 2 weeks; the backlink is required.
    // 54px tall per their snippet; width from the 481.56x160.97 SVG viewBox.
    name: "Turbo0",
    href: "https://turbo0.com/item/swipe-by-pixelup-labs",
    src: "https://img.turbo0.com/badge-listed-dark.svg",
    width: 162,
    height: 54,
  },
];
