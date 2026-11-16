import type { SwipeCreator } from "./creators";
import type { SwipePlatform, SwipePost } from "./posts";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/** 1835 → "1.8K", 212 → "212". */
export function compactNumber(value: number) {
  if (value < 1000) return String(value);
  const thousands = value / 1000;
  return `${thousands >= 10 ? Math.round(thousands) : Math.round(thousands * 10) / 10}K`;
}

/** "2026-10" → "October 2026". */
export function monthLabel(month: string) {
  const [year, m] = month.split("-");
  return `${MONTHS[Number(m) - 1]} ${year}`;
}

/** "2026-10-19" → "Oct 19, 2026". */
export function dayLabel(day: string) {
  const [year, m, d] = day.split("-");
  return `${MONTHS[Number(m) - 1].slice(0, 3)} ${Number(d)}, ${year}`;
}

/**
 * Card date. "YYYY-MM-DD" in `currentYear` → "Oct 19"; in another year →
 * "Oct 19, 2025". Month-only archive dates ("YYYY-MM") → "Sep 2025".
 */
export function shortDate(date: string, currentYear: string) {
  const [year, m, d] = date.split("-");
  const month = MONTHS[Number(m) - 1].slice(0, 3);
  if (!d) return `${month} ${year}`;
  return year === currentYear ? `${month} ${Number(d)}` : `${month} ${Number(d)}, ${year}`;
}

/** Day labels for full dates, month labels for month-only archive dates. */
export function pickedLabel(date: string) {
  return date.length === 10 ? dayLabel(date) : monthLabel(date);
}

export function profileUrl(creator: SwipeCreator, platform: SwipePlatform) {
  if (platform === "x") return creator.x ? `https://x.com/${creator.x}` : null;
  return creator.linkedin ? `https://www.linkedin.com/in/${creator.linkedin}/` : null;
}

export const platformLabel: Record<SwipePlatform, string> = {
  x: "X",
  linkedin: "LinkedIn",
};

/**
 * The "Copy prompt" text: hands an AI assistant the reference post plus our
 * notes on it, and asks it to interview the reader before drafting their own
 * version. The creator's words never go in; only the link, our summary and
 * the structure tags do.
 */
export function buildPrompt(post: SwipePost, creator: SwipeCreator) {
  const handle =
    post.platform === "x" && creator.x ? ` (@${creator.x})` : "";

  const article = post.platform === "x" ? "an" : "a";

  return `Help me write ${article} ${platformLabel[post.platform]} post of my own, modelled on how a high-performing post is put together. Use my experience and my words, not the original's.

REFERENCE
Link: ${post.url}
Author: ${creator.name}${handle}
Category: ${post.category}
Format: ${post.format}
Opening move: ${post.hook}
Reach when saved: ${post.likes} likes, ${post.comments} comments, ${post.reposts} reposts
What it covers: ${post.summary}

HOW TO WORK WITH ME
1. Break the reference down in three short bullets: what the opening line promises, what keeps people reading through the middle, and what the ending asks the reader to do. If you can't open the link, work from the notes above and say so.
2. Find my angle. Ask me one question at a time, and wait for each answer. Start by asking which part of my own work maps to this topic. Every question after that should build on a specific detail from my last answer: a project, a number, a decision, a mistake, a before and after. Stop after five questions, or sooner once you have enough.
3. Draft the post from my answers only. Keep my phrasing where you can and invent nothing. Match the reference's format and opening move, not its wording. No hashtags, no emoji, no em dashes.
4. Give me two alternative opening lines underneath the draft.`;
}
