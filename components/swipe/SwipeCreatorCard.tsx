import type { SwipeCreator } from "@/lib/swipe/creators";
import { platformLabel } from "@/lib/swipe/format";
import { CreatorMonogram } from "./SwipeGlyphs";

/**
 * One row of the creator directory: monogram, name, and "{N} posts · handle".
 * The whole row (the name button's stretched ::after) toggles that creator's
 * filter. id="creator-<slug>" is a plain anchor, so /swipe#creator-<slug>
 * lands on the row. Profile links live in the creator profile header and the
 * viewer, and as sameAs in the page's JSON-LD.
 */
export function SwipeCreatorCard({
  creator,
  postCount,
  selected,
  onSelect,
}: {
  creator: SwipeCreator;
  postCount: number;
  selected: boolean;
  onSelect: (creatorId: string) => void;
}) {
  const handle = creator.x ? `@${creator.x}` : creator.role ?? platformLabel.linkedin;

  return (
    <article
      id={`creator-${creator.id}`}
      className={`relative flex h-full scroll-mt-28 items-center gap-3 px-4 py-3.5 transition-colors hover:bg-button-dark has-[:focus-visible]:bg-button-dark desk:scroll-mt-16 desk:px-5 desk:py-4 ${
        selected ? "bg-button-dark" : ""
      }`}
    >
      <CreatorMonogram creator={creator} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="text-[14px] font-medium leading-[1.2] text-white">
          <button
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(creator.id)}
            className="block w-full cursor-pointer truncate text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:-outline-offset-1 focus-visible:after:outline-white/60"
          >
            {creator.name}
          </button>
        </h3>
        <p className="truncate text-[12px] leading-[1.2] text-label-grey">
          {postCount === 1 ? "1 post" : `${postCount} posts`} · {handle}
        </p>
      </div>
    </article>
  );
}
