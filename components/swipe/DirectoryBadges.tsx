import { directoryBadges } from "@/lib/swipe/badges";

/**
 * "Featured on" strip directly above the /swipe Footer, in the Footer's own
 * frame (pb-5, desk:px-5, hairline box) so the two read as one footer. Badges
 * come from lib/swipe/badges.ts. Plain <img> on purpose: directory badges are
 * remote SVGs whose hosts change, and next/image would need every host added
 * to images.remotePatterns before a new badge could render.
 */
export function DirectoryBadges() {
  const showPlaceholder =
    directoryBadges.length === 0 && process.env.NODE_ENV === "development";
  if (directoryBadges.length === 0 && !showPlaceholder) return null;

  return (
    <div className="relative w-full pt-6 pb-5 desk:px-5">
      <div className="flex flex-col gap-5 border-[0.5px] border-hairline p-6 desk:flex-row desk:items-center desk:gap-8">
        <p className="shrink-0 text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey">
          Featured on
        </p>
        {showPlaceholder ? (
          <p className="border border-dashed border-hairline px-3 py-2 text-[12px] text-white/40">
            Directory badges go here once listings are live. Add them in lib/swipe/badges.ts. (Dev only,
            hidden in production while the list is empty.)
          </p>
        ) : (
          <ul className="flex flex-wrap items-center gap-4">
            {directoryBadges.map((badge) => (
              <li key={badge.href}>
                <a href={badge.href} target="_blank" rel="noopener" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote directory badges, see above */}
                  <img
                    src={badge.src}
                    alt={`Featured on ${badge.name}`}
                    width={badge.width}
                    height={badge.height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto max-w-full"
                  />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
