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
];
