import type { SwipeCreator } from "@/lib/swipe/creators";
import type { SwipePlatform } from "@/lib/swipe/posts";

// Same X and LinkedIn marks as SocialLinks, inlined with currentColor so they
// follow the surrounding text's opacity.
const platformPaths: Record<SwipePlatform, string> = {
  x: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

export function PlatformIcon({
  platform,
  size = 12,
}: {
  platform: SwipePlatform;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={platformPaths[platform]}
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Initials in place of a profile photo. A full circle, which DESIGN.md allows
 * for circular elements, on the button-dark fill with a hairline edge, so the
 * page stays monochrome however many creators are on screen.
 */
export function CreatorMonogram({
  creator,
  size = "md",
}: {
  creator: Pick<SwipeCreator, "initials">;
  size?: "md" | "lg";
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 select-none items-center justify-center rounded-full border-[0.5px] border-hairline bg-button-dark font-mono uppercase leading-none text-white/80 ${
        size === "lg" ? "h-12 w-12 text-[14px]" : "h-9 w-9 text-[12px]"
      }`}
    >
      {creator.initials}
    </span>
  );
}
