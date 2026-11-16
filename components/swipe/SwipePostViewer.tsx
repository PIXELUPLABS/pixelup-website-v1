"use client";

import { useEffect, useState } from "react";
import { ArrowIcon } from "@/components/ArrowIcon";
import { ctaButtonBase, ctaButtonPadding } from "@/components/cta-button-styles";
import { Dialog } from "@/components/Dialog";
import type { SwipeCreator } from "@/lib/swipe/creators";
import { buildPrompt, pickedLabel, platformLabel, profileUrl } from "@/lib/swipe/format";
import type { SwipePlatform, SwipePost } from "@/lib/swipe/posts";
import { CreatorMonogram, PlatformIcon } from "./SwipeGlyphs";
import { SwipePostEmbed } from "./SwipePostEmbed";

const circleButton =
  "flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20";
const profileCircle =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[0.5px] border-hairline text-white/60 transition-colors hover:bg-button-dark hover:text-white";
const labelClass = "text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey";
const helper =
  "Paste it into ChatGPT or Claude. It asks about your own work, then drafts your version.";

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/**
 * The post viewer: the real post through its official embed on the right (the
 * "well"), our breakdown on the left, and the page's one accent action, Copy
 * prompt. Below desk it's a bottom sheet with one scroll body and a pinned
 * action bar. Prev/next (buttons or ←/→) walk the list the viewer was opened
 * from.
 */
export function SwipePostViewer({
  post,
  creator,
  position,
  total,
  onPrev,
  onNext,
  onClose,
  onSelectCreator,
}: {
  post: SwipePost | null;
  creator: SwipeCreator | null;
  /** 1-based position in the list the viewer walks. */
  position: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onSelectCreator: (creatorId: string) => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copied = !!post && copiedId === post.id;

  useEffect(() => {
    if (!copiedId) return;
    const timer = window.setTimeout(() => setCopiedId(null), 2000);
    return () => window.clearTimeout(timer);
  }, [copiedId]);

  async function copyPrompt() {
    if (!post || !creator) return;
    const prompt = buildPrompt(post, creator);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(post.id);
    } catch {
      // Clipboard access can be refused; the browser prompt keeps it copyable.
      window.prompt("Copy this prompt", prompt);
    }
  }

  const open = !!post && !!creator;
  const platform = post ? platformLabel[post.platform] : "";
  const handle =
    creator && (post?.platform === "x" || !creator.role) && creator.x
      ? `@${creator.x}`
      : creator?.role ?? (creator?.x ? `@${creator.x}` : platformLabel.linkedin);
  const structure: [string, string][] = post
    ? [
        ["Category", post.category],
        ["Format", post.format],
        ["Opening move", post.hook],
        ["Picked", pickedLabel(post.date)],
      ]
    : [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy="viewer-title"
      className="desk:h-[min(800px,calc(100dvh-40px))] desk:w-[min(960px,calc(100vw-40px))]"
      onKeyDown={(event) => {
        if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          onPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          onNext();
        }
      }}
    >
      {post && creator && (
        <div className="flex h-full min-h-0 flex-col desk:grid desk:grid-cols-[360px_minmax(0,1fr)] desk:grid-rows-[auto_auto_minmax(0,1fr)_auto]">
          {/* Header bar */}
          <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b-[0.5px] border-hairline px-4 desk:col-span-2">
            <div className="flex items-center gap-2">
              <button type="button" onClick={onPrev} aria-label="Previous post" className={circleButton}>
                <span className="rotate-180">
                  <ArrowIcon />
                </span>
              </button>
              <button type="button" onClick={onNext} aria-label="Next post" className={circleButton}>
                <ArrowIcon />
              </button>
              <p className="ml-2 font-mono text-[12px] uppercase leading-none tracking-[0.04em] text-label-grey">
                <span className="text-white">{position}</span> / {total}
              </p>
              <span className="sr-only" aria-live="polite">
                Post {position} of {total}: {post.title}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close post"
              autoFocus
              className={circleButton}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </button>
          </div>

          {/* One scroll body below desk; desk:contents lets its three parts
              take their own cells in the panel grid. */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain desk:contents">
            <div className="flex flex-col gap-4 px-5 pt-5 desk:col-start-1 desk:row-start-2 desk:border-r-[0.5px] desk:border-hairline desk:px-6 desk:pt-6">
              <div className="flex items-center gap-3">
                <CreatorMonogram creator={creator} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => onSelectCreator(creator.id)}
                    className="w-fit max-w-full cursor-pointer truncate text-left text-[14px] font-medium leading-[1.2] text-white hover:underline"
                  >
                    {creator.name}
                    <span className="sr-only">, see all their posts</span>
                  </button>
                  <p className="truncate text-[12px] leading-[1.2] text-label-grey">{handle}</p>
                </div>
                <ul className="flex items-center gap-2" aria-label={`${creator.name}'s profiles`}>
                  {(["x", "linkedin"] as SwipePlatform[]).map((profile) => {
                    const href = profileUrl(creator, profile);
                    if (!href) return null;
                    return (
                      <li key={profile}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${creator.name} on ${platformLabel[profile]}`}
                          title={`${creator.name} on ${platformLabel[profile]}`}
                          className={profileCircle}
                        >
                          <PlatformIcon platform={profile} size={14} />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <h2
                id="viewer-title"
                className="text-pretty text-[20px] font-medium leading-[1.25] tracking-[-0.01em] text-white"
              >
                {post.title}
              </h2>
            </div>

            <div className="relative min-h-[360px] bg-base desk:col-start-2 desk:row-span-3 desk:row-start-2 desk:min-h-0 desk:overflow-y-auto desk:overscroll-contain">
              <div className="mx-auto w-full max-w-[598px] px-5 py-5 desk:p-6">
                <SwipePostEmbed key={post.id} post={post} creator={creator} />
              </div>
            </div>

            <div className="flex flex-col gap-5 px-5 py-5 desk:col-start-1 desk:row-start-3 desk:min-h-0 desk:overflow-y-auto desk:border-r-[0.5px] desk:border-hairline desk:px-6">
              <div className="flex flex-col gap-2">
                <p className={labelClass}>What it covers</p>
                <p className="text-pretty text-[14px] leading-[1.45] text-white/60">{post.summary}</p>
              </div>
              <dl className="flex flex-col">
                {structure.map(([term, value]) => (
                  <div
                    key={term}
                    className="flex justify-between gap-4 border-t-[0.5px] border-hairline py-3"
                  >
                    <dt className={labelClass}>{term}</dt>
                    <dd className="text-right text-[14px] leading-[1.3] text-white">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-pretty text-[12px] leading-[1.4] text-white/40 desk:hidden">{helper}</p>
            </div>
          </div>

          {/* Actions: pinned bar below desk, bottom of the info column on desk */}
          <div className="flex shrink-0 gap-3 border-t-[0.5px] border-hairline p-4 desk:col-start-1 desk:row-start-4 desk:flex-col desk:gap-4 desk:border-r-[0.5px] desk:p-6">
            <button
              type="button"
              onClick={copyPrompt}
              className={`${ctaButtonBase} ${ctaButtonPadding} flex-1 cursor-pointer gap-8 bg-accent text-white hover:brightness-110 desk:flex-none`}
            >
              <span>{copied ? "PROMPT COPIED" : "COPY PROMPT"}</span>
              <ArrowIcon />
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? "Prompt copied to the clipboard" : ""}
            </span>
            <p className="hidden text-pretty text-[12px] leading-[1.4] text-white/40 desk:block">{helper}</p>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ctaButtonBase} ${ctaButtonPadding} shrink-0 gap-3 bg-button-dark text-white hover:bg-white/[0.12] desk:w-fit desk:gap-2 desk:bg-transparent desk:p-0 desk:font-button desk:font-semibold desk:uppercase desk:tracking-[-0.02em] desk:hover:bg-transparent desk:hover:text-white/70`}
            >
              <span className="uppercase">Open on {platform}</span>
              <ArrowIcon />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      )}
    </Dialog>
  );
}
