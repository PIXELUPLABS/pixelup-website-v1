"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

function Mention({ name }: { name: string }) {
  return (
    <span className="rounded-[3px] bg-[#1D9BD1]/[0.15] px-0.5 text-[#1D9BD1]">
      @{name}
    </span>
  );
}

/**
 * A compact Slack-style message (dark theme) pinned inside the top right of
 * a full-width media slot on desktop (12px in) and sitting under the media on
 * mobile:
 * avatar with the sender's org badge, name, timestamp, an optional @mention,
 * the message and its reactions. The message types out once when the card
 * scrolls into view, after a short typing beat, then the reactions fade in.
 * The full message is in the markup from the first render (crawlers, screen
 * readers, no-JS), and prefers-reduced-motion shows it straight away.
 */
export function FloatingComment({ comment }: { comment: MediaComment }) {
  const ref = useRef<HTMLElement>(null);
  const chars = useMemo(() => graphemes(comment.quote), [comment.quote]);
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

  const spoken = [
    `${comment.name}${comment.org ? `, ${comment.org}` : ""}${comment.time ? `, ${comment.time}` : ""}:`,
    comment.mention ? `@${comment.mention}` : "",
    comment.quote,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure
      ref={ref}
      className="mt-2 w-full rounded-lg border border-white/[0.1] bg-[#1A1D21] px-3 py-2.5 text-[#D1D2D3] shadow-[0_2px_6px_rgba(0,0,0,0.3),0_20px_40px_-20px_rgba(0,0,0,0.7)] desk:absolute desk:right-3 desk:top-3 desk:mt-0 desk:w-[300px]"
    >
      <span className="sr-only">{spoken}</span>
      <div aria-hidden="true" className="flex gap-2">
        <div className="relative size-7 shrink-0">
          <img
            src={comment.avatar}
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-md object-cover"
          />
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
                  <Mention name={comment.mention} />{" "}
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
                      <Mention name={comment.mention} />{" "}
                    </>
                  )}
                  {chars.slice(0, shown).join("")}
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
