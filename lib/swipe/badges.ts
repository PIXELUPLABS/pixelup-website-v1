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
  {
    // Free. The listing goes live with a dofollow link once they find this badge.
    name: "EasyDoFollow",
    href: "https://easydofollow.dev/design/swipe-by-pixelup-labs",
    src: "https://easydofollow.dev/badge/easydofollow-badge-dark.svg",
    width: 188,
    height: 56,
  },
  {
    // Free plan: 1 dofollow link, review within 72h; the backlink is required.
    name: "Twelve Tools",
    href: "https://twelve.tools",
    src: "https://twelve.tools/badge2-dark.svg",
    width: 148,
    height: 40,
  },
  {
    // Free (one product). Human review; the dofollow link unlocks once approved with this badge live.
    name: "IndieAscent",
    href: "https://indieascent.com/p/swipe-by-pixelup-labs?ia_badge=1",
    src: "https://indieascent.com/badge/standard-dark.svg",
    width: 200,
    height: 54,
  },
  {
    // Free plan: 1 dofollow link; the badge is required (Verify Badge, then Submit Product).
    name: "TheSaaSDir",
    href: "https://thesaasdir.com/product/swipe-by-pixelup-labs?ref=badge",
    src: "https://thesaasdir.com/badge/swipe-by-pixelup-labs.svg",
    width: 160,
    height: 44,
  },
  {
    // TheSaaSDir sister site. Free plan: 1 dofollow link; the badge is required.
    name: "TheDevToolsDir",
    href: "https://thedevtoolsdir.com/product/swipe-by-pixelup-labs?ref=badge",
    src: "https://thedevtoolsdir.com/badge/swipe-by-pixelup-labs.svg",
    width: 160,
    height: 44,
  },
  {
    // Free plan: dofollow DR 68 link with this badge; ~329-day review queue (filed Oct 22, 2026).
    name: "SaaSCity",
    href: "https://saascity.io",
    src: "https://saascity.io/badges/featured-dark.svg",
    width: 150,
    height: 54,
  },
  {
    // Free with a mutual dofollow backlink; their bot checks for this badge.
    name: "LaunchPaddock",
    href: "https://launchpaddock.com/directory/swipe-by-pixelup-labs",
    src: "https://launchpaddock.com/badge.svg",
    width: 186,
    height: 54,
  },
  {
    // TheSaaSDir sister site. Free plan: 1 dofollow link; the badge is required.
    name: "IndieLineup",
    href: "https://indielineup.com/product/swipe-by-pixelup-labs?ref=badge",
    src: "https://indielineup.com/badge/swipe-by-pixelup-labs.svg",
    width: 160,
    height: 44,
  },
  {
    // Free plan: dofollow link, instant publish once this badge is verified.
    name: "SaasDB",
    href: "https://saasdb.net",
    src: "https://saasdb.net/badge/featured-dark.svg",
    width: 180,
    height: 54,
  },
  {
    // Free plan: listing link turns dofollow once this badge is verified; listing hides if it disappears.
    name: "neeed.directory",
    href: "https://neeed.directory",
    src: "https://neeed.directory/badges/neeed-badge-dark.svg",
    width: 139,
    height: 44,
  },
  {
    // Free plan: dofollow while this badge stays (re-checked every two weeks); live Nov 14, 2026.
    name: "MarketingDB",
    href: "https://marketingdb.live",
    src: "https://marketingdb.live/badge.svg",
    width: 190,
    height: 44,
  },
  {
    // OpenHunts Club badge: skips the ~60-week free launch queue; dofollow only if we place top 3.
    name: "OpenHunts",
    href: "https://openhunts.com",
    src: "https://cdn.openhunts.com/badges/club.webp",
    width: 195,
    height: 42,
  },
  {
    // Free launches require this badge to stay listed.
    name: "Nick Launches",
    href: "https://nicklaunches.com/products/swipe-by-pixelup-labs/",
    src: "https://nicklaunches.com/badges/featured-dark.png",
    width: 192,
    height: 44,
  },
  {
    // Dofollow while this badge stays (re-checked weekly). Their checker needs the exact alt "Featured on MakeItLast" and the root href.
    name: "MakeItLast",
    href: "https://www.makeitla.st/",
    src: "https://www.makeitla.st/badge/makeitlast-badge-dark.svg?v=3",
    width: 146,
    height: 44,
  },
];
