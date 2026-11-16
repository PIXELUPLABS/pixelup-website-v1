import type { SwipePost } from "./posts";

/**
 * How each post is shown for real: through the platform's official embed, so
 * the creator's own text and media are served by X or LinkedIn, never copied
 * into this repo.
 *
 * Checked 2026-10-22 against every post: X's oEmbed endpoint answered 200 for
 * all 150 X posts, and LinkedIn's embed endpoint answered 200 for 38 of 39
 * LinkedIn posts. The one that 404s is listed below and falls back to a link.
 * Re-check when adding posts (a deleted post, or one whose author turned
 * embedding off, has to go in this list).
 */
const NOT_EMBEDDABLE = new Set<string>(["li-7516169365562716160"]);

export type SwipeEmbed =
  | { kind: "x"; tweetId: string }
  | { kind: "linkedin"; src: string }
  | null;

export function embedFor(post: SwipePost): SwipeEmbed {
  if (NOT_EMBEDDABLE.has(post.id)) return null;

  if (post.platform === "x") {
    const tweetId = post.url.match(/status\/(\d+)/)?.[1];
    return tweetId ? { kind: "x", tweetId } : null;
  }

  // The URN type has to match the kind of id in the post URL, or LinkedIn
  // answers 404: activity-…, share-… and ugcPost-… are three different URNs.
  const match = post.url.match(/(activity|share|ugcPost)-(\d+)/);
  return match
    ? { kind: "linkedin", src: `https://www.linkedin.com/embed/feed/update/urn:li:${match[1]}:${match[2]}` }
    : null;
}
