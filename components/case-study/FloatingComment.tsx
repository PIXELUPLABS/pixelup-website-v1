"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { MediaComment } from "@/lib/case-studies";

/** Splits text into user-perceived characters, so emoji type out whole. */
function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });
    return Array.from(segmenter.segment(text), (part) => part.segment);
  }
  return Array.from(text);
}

const TYPE_MS = 32;
const WAIT_MS = 700;

/**
 * Types `text` out once its element scrolls into view, after a short beat.
 * The full text is the initial state (crawlers, screen readers, no-JS), and
 * prefers-reduced-motion keeps it that way.
 */
function useTypeOut(text: string) {
  const ref = useRef<HTMLElement>(null);
  const chars = useMemo(() => graphemes(text), [text]);
  const [shown, setShown] = useState(chars.length);
  const [phase, setPhase] = useState<"waiting" | "typing" | "done">("done");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    setShown(0);
    setPhase("waiting");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = setTimeout(() => {
          setPhase("typing");
          let count = 0;
          const tick = () => {
            count += 1;
            setShown(count);
            if (count < chars.length) {
              timer = setTimeout(tick, TYPE_MS);
            } else {
              setPhase("done");
            }
          };
          tick();
        }, WAIT_MS);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [chars]);

  return { ref, typed: chars.slice(0, shown).join(""), phase };
}

/** The sender's photo, or their initials until one is supplied. */
function Avatar({
  comment,
  className,
}: {
  comment: MediaComment;
  className: string;
}) {
  if (comment.avatar) {
    return (
      <img
        src={comment.avatar}
        alt=""
        width={32}
        height={32}
        className={`object-cover ${className}`}
      />
    );
  }
  const initials = comment.name
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2);
  return (
    <span
      className={`flex items-center justify-center bg-white/[0.12] text-[11px] font-bold text-white ${className}`}
    >
      {initials}
    </span>
  );
}

function Mention({ name, blurred }: { name: string; blurred?: boolean }) {
  return (
    <span className="rounded-[3px] bg-[#1D9BD1]/[0.15] px-0.5 text-[#1D9BD1]">
      {blurred ? (
        // The chip stays crisp; only the handle inside it is blurred.
        <span className="inline-block select-none blur-[3px]">@{name}</span>
      ) : (
        <>@{name}</>
      )}
    </span>
  );
}

const cardPlacement =
  "mt-2 w-full shadow-[0_2px_6px_rgba(0,0,0,0.3),0_20px_40px_-20px_rgba(0,0,0,0.7)] desk:absolute desk:right-3 desk:top-3 desk:mt-0";
const cardPosition = `${cardPlacement} desk:w-[300px]`;

/**
 * A client message pinned inside the top right of a full-width media slot on
 * desktop (12px in) and sitting under the media on mobile: a compact Slack
 * message (dark theme) by default, or a public X post. The message types out
 * once when the card scrolls into view. The full message is in the markup from
 * the first render (crawlers, screen readers, no-JS), and
 * prefers-reduced-motion shows it straight away.
 */
export function FloatingComment({ comment }: { comment: MediaComment }) {
  return comment.variant === "x" ? (
    <XPost comment={comment} />
  ) : (
    <SlackMessage comment={comment} />
  );
}

/**
 * Avatar with the sender's org badge, name, timestamp, an optional @mention,
 * the message and its reactions. A typing beat runs before the message, and
 * the reactions fade in after it.
 */
function SlackMessage({ comment }: { comment: MediaComment }) {
  const { ref, typed, phase } = useTypeOut(comment.quote);

  const spoken = [
    `${comment.name}${comment.org ? `, ${comment.org}` : ""}${comment.time ? `, ${comment.time}` : ""}:`,
    comment.mention && !comment.blurMention ? `@${comment.mention}` : "",
    comment.quote,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure
      ref={ref}
      className={`rounded-lg border border-white/[0.1] bg-[#1A1D21] px-3 py-2.5 text-[#D1D2D3] ${cardPosition}`}
    >
      <span className="sr-only">{spoken}</span>
      <div aria-hidden="true" className="flex gap-2">
        <div className="relative size-7 shrink-0">
          <Avatar comment={comment} className="size-7 rounded-md" />
          {comment.org && (
            <span className="absolute -bottom-1 -right-1 flex size-3.5 items-center justify-center rounded-[3px] border-2 border-[#1A1D21] bg-[#616061] text-[7px] font-bold leading-none text-white">
              {comment.org.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-baseline gap-x-2 leading-tight">
            <span className="text-[13px] font-bold text-white">
              {comment.name}
            </span>
            {comment.time && (
              <span className="text-[11px] text-[#ABABAD]">{comment.time}</span>
            )}
          </p>
          {/* The invisible copy holds the final size, so the card never grows while typing. */}
          <div className="mt-0.5 grid text-[13px] leading-[19px]">
            <p className="invisible col-start-1 row-start-1">
              {comment.mention && (
                <>
                  <Mention
                    name={comment.mention}
                    blurred={comment.blurMention}
                  />{" "}
                </>
              )}
              {comment.quote}
            </p>
            <p className="col-start-1 row-start-1">
              {phase === "waiting" ? (
                <span className="inline-flex gap-1 pt-2">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="size-1.5 animate-bounce rounded-full bg-white/30"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
              ) : (
                <>
                  {comment.mention && (
                    <>
                      <Mention
                        name={comment.mention}
                        blurred={comment.blurMention}
                      />{" "}
                    </>
                  )}
                  {typed}
                  {phase === "typing" && (
                    <span className="ml-px inline-block h-[1.05em] w-[2px] animate-pulse bg-[#D1D2D3] align-[-0.15em]" />
                  )}
                </>
              )}
            </p>
          </div>
          {comment.reactions && (
            <div
              className={`mt-1.5 flex flex-wrap gap-1 ${phase === "done" ? "opacity-100 transition-opacity duration-300 motion-reduce:transition-none" : "opacity-0"}`}
            >
              {comment.reactions.map((reaction) => (
                <span
                  key={reaction.emoji}
                  className={`inline-flex h-5 items-center gap-1 rounded-full border px-1.5 text-[11px] font-semibold ${
                    reaction.mine
                      ? "border-[#1D9BD1] bg-[#1264A3] text-white"
                      : "border-white/[0.12] bg-white/[0.06] text-[#D1D2D3]"
                  }`}
                >
                  <span className="text-[12px] leading-none">
                    {reaction.emoji}
                  </span>
                  {reaction.count}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}

function XLogo({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

/** X's verification check (24×24), drawn in currentColor. */
const X_ICONS = {
  verified:
    "M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z",
} as const;

function XIcon({
  name,
  className,
}: {
  name: keyof typeof X_ICONS;
  className: string;
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d={X_ICONS[name]} />
    </svg>
  );
}

/** X's font stack: Chirp where installed, then the system UI fonts. */
const X_FONT =
  'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const formatTime = (date: Date, timeZone?: string) =>
  `${new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone }).format(date)} · ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone }).format(date)}`;

const noSubscribe = () => () => {};

/**
 * "1:12 PM · Oct 15, 2026": rendered in UTC on the server and during
 * hydration (so the two agree), then in the reader's own time zone, as X
 * shows it.
 */
function usePostTime(datetime?: string, fallback?: string) {
  return useSyncExternalStore(
    noSubscribe,
    () => (datetime ? formatTime(new Date(datetime)) : (fallback ?? "")),
    () => (datetime ? formatTime(new Date(datetime), "UTC") : (fallback ?? "")),
  );
}

/** X's count style: 2,947 → "2,947", 12,400 → "12.4K". */
function xCount(n: number) {
  if (n < 10000) return n.toLocaleString("en-US");
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

/**
 * A post as X shows it in dark mode, 10% smaller than the Slack card:
 * round avatar, bold name with the blue check, @handle under it, the X logo
 * top right, "Replying to", the post, then the time, date and views. No action
 * row. The post types out once on scroll-in and the time line fades in after
 * it; the card is drawn at its final size from the start.
 */
function XPost({ comment }: { comment: MediaComment }) {
  const { ref, typed, phase } = useTypeOut(comment.quote);
  const handle = comment.handle ? `@${comment.handle}` : "";
  const posted = usePostTime(comment.datetime, comment.time);
  const views = comment.stats?.views;

  const spoken = [
    `${comment.name}${comment.verified ? " (verified)" : ""}${handle ? `, ${handle}` : ""}${comment.mention ? `, replying to @${comment.mention}` : ""}, on X:`,
    comment.quote,
    posted ? `Posted ${posted}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure
      ref={ref}
      style={{ fontFamily: X_FONT }}
      className={`relative rounded-[11px] border border-[#2F3336] bg-black px-[11px] py-[9px] text-left text-[#E7E9EA] antialiased ${cardPlacement} desk:w-[270px]`}
    >
      <span className="sr-only">{spoken}</span>
      {comment.href && (
        <a
          href={comment.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${comment.name}'s post on X`}
          className="absolute right-[11px] top-[11px] text-[#E7E9EA] hover:opacity-80"
        >
          <XLogo className="size-[14px]" />
        </a>
      )}
      <div aria-hidden="true">
        <div className="flex items-center gap-[7px] pr-[22px]">
          <Avatar comment={comment} className="size-[29px] shrink-0 rounded-full" />
          <div className="min-w-0 leading-tight">
            <p className="flex items-center gap-0.5 text-[11.7px] font-bold">
              <span className="truncate">{comment.name}</span>
              {comment.verified && (
                <XIcon name="verified" className="size-[13.5px] shrink-0 text-[#1D9BF0]" />
              )}
            </p>
            {handle && (
              <p className="truncate text-[10.8px] text-[#71767B]">{handle}</p>
            )}
          </div>
        </div>
        {comment.mention && (
          <p className="mt-[7px] text-[10.8px] leading-tight text-[#71767B]">
            Replying to <span className="text-[#1D9BF0]">@{comment.mention}</span>
          </p>
        )}
        {/* The invisible copy holds the final size, so the card never grows while typing. */}
        <div className="mt-1 grid text-[11.7px] leading-[17px]">
          <p className="invisible col-start-1 row-start-1 whitespace-pre-wrap">
            {comment.quote}
          </p>
          <p className="col-start-1 row-start-1 whitespace-pre-wrap">
            {typed}
            {phase !== "done" && (
              <span className="ml-px inline-block h-[1.05em] w-[2px] animate-pulse bg-[#E7E9EA] align-[-0.15em]" />
            )}
          </p>
        </div>
        {posted && (
          <p
            className={`mt-[7px] text-[10.8px] leading-tight text-[#71767B] ${phase === "done" ? "opacity-100 transition-opacity duration-300 motion-reduce:transition-none" : "opacity-0"}`}
          >
            {comment.href ? (
              <a
                href={comment.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                className="hover:underline"
              >
                {posted}
              </a>
            ) : (
              posted
            )}
            {views ? (
              <>
                {" · "}
                <span className="font-bold text-[#E7E9EA]">{xCount(views)}</span> Views
              </>
            ) : null}
          </p>
        )}
      </div>
    </figure>
  );
}
