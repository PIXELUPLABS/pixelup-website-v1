import type { SwipeCreator } from "@/lib/swipe/creators";
import { compactNumber, platformLabel, shortDate } from "@/lib/swipe/format";
import type { SwipePost } from "@/lib/swipe/posts";
import { CreatorMonogram, PlatformIcon } from "./SwipeGlyphs";

/**
 * One cell of the post grid; the grid draws the hairlines. The whole cell
 * opens the viewer (the title button's stretched ::after); the creator name
 * sits above it at z-10 and filters to that creator instead, so no
 * interactive element is nested in another.
 */
export function SwipePostCard({
  post,
  creator,
  isNew,
  currentYear,
  onOpen,
  onSelectCreator,
}: {
  post: SwipePost;
  creator: SwipeCreator;
  /** Within the latest two weeks of picks. Shown as white text, never accent. */
  isNew: boolean;
  /** Year of the newest pick: dates in it drop the year ("Oct 19"). */
  currentYear: string;
  onOpen: (postId: string) => void;
  onSelectCreator: (creatorId: string) => void;
}) {
  const handle =
    post.platform === "x" && creator.x ? `@${creator.x}` : creator.role ?? platformLabel[post.platform];
  const structure = [...new Set([post.format, post.hook])].join(" / ");
  const platform = platformLabel[post.platform];

  return (
    <article
      aria-labelledby={`t-${post.id}`}
      className="group relative flex h-full flex-col gap-3 p-5 transition-colors hover:bg-button-dark has-[:focus-visible]:bg-button-dark"
    >
      <div className="flex items-center gap-3">
        <CreatorMonogram creator={creator} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <button
            type="button"
            onClick={() => onSelectCreator(creator.id)}
            title={`Show every post by ${creator.name}`}
            className="relative z-10 w-fit max-w-full cursor-pointer truncate text-left text-[14px] font-medium leading-[1.2] text-white hover:underline"
          >
            {creator.name}
            <span className="sr-only">, see all their posts</span>
          </button>
          <p className="truncate text-[12px] leading-[1.2] text-label-grey">{handle}</p>
        </div>
      </div>

      <p className="flex items-baseline justify-between gap-3 font-mono text-[12px] uppercase leading-none tracking-[0.04em] text-label-grey">
        <span className="min-w-0 truncate">{structure}</span>
        <span className="shrink-0">
          {isNew && <span className="text-white">New · </span>}
          <time dateTime={post.date}>{shortDate(post.date, currentYear)}</time>
        </span>
      </p>

      <h3
        id={`t-${post.id}`}
        className="text-[16px] font-medium leading-[1.25] tracking-[-0.01em] text-white"
      >
        <button
          type="button"
          data-post-trigger={post.id}
          aria-haspopup="dialog"
          onClick={() => onOpen(post.id)}
          className="block w-full cursor-pointer text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:-outline-offset-1 focus-visible:after:outline-white/60"
        >
          <span className="line-clamp-2 text-pretty">{post.title}</span>
          <span className="sr-only">, view the post on {platform}</span>
        </button>
      </h3>

      <p className="line-clamp-2 text-pretty text-[14px] leading-[1.45] text-white/60">{post.summary}</p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <span
          aria-hidden="true"
          className="flex items-center gap-1.5 font-button text-[12px] font-semibold uppercase tracking-[-0.02em] text-white/60 transition-colors group-hover:text-white"
        >
          <PlatformIcon platform={post.platform} />
          View post
        </span>
        <p
          title="Likes when the post was picked"
          className="font-mono text-[12px] uppercase leading-none tracking-[0.04em] text-label-grey"
        >
          <span className="text-white">{compactNumber(post.likes)}</span> likes
        </p>
      </div>
    </article>
  );
}
