"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { MediaBlock } from "@/lib/case-studies";

/**
 * Portrait images drifting left forever across a panel (the Figma frame's
 * 2920×1643, posters about 70% of its height and 2.5% apart; square on mobile
 * so the posters stay legible). Sizes are container units, so the row scales
 * with the panel. The set renders twice, each copy carrying its own trailing gap,
 * so `marquee`'s translateX(-50%) lands exactly one period on and the seam
 * never shows (same build as TrustedStrip). It only runs while the panel is
 * on screen, so it starts from its first poster when readers reach it. Hover
 * slows it to half speed; with prefers-reduced-motion it stands still and
 * scrolls by hand instead.
 */
export function MediaMarquee({
  block,
}: {
  block: Extract<MediaBlock, { kind: "marquee" }>;
}) {
  const background = block.background?.media;
  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const track = trackRef.current;
    if (!panel || !track) return;
    // Paused off screen; the first time the panel comes into view the row
    // rewinds, so it always starts from its first poster.
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          const animation = track.getAnimations()[0];
          if (animation) animation.currentTime = 0;
        }
        track.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
      },
      { threshold: 0.25 },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="px-6 desk:p-6">
      <div
        ref={panelRef}
        className="@container relative aspect-square overflow-hidden bg-white/[0.04] desk:aspect-[2920/1643]"
      >
        {background?.type === "image" && (
          <Image
            src={background.src}
            alt=""
            fill
            sizes="(min-width: 1200px) 80vw, 100vw"
            className="object-cover"
          />
        )}
        <div className="no-scrollbar absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden motion-reduce:overflow-x-auto">
          <div
            ref={trackRef}
            className="flex w-max animate-marquee motion-reduce:animate-none"
            style={{ animationDuration: `${block.duration ?? 40}s` }}
            onMouseEnter={(e) => {
              const animation = e.currentTarget.getAnimations()[0];
              if (animation) animation.playbackRate = 0.5;
            }}
            onMouseLeave={(e) => {
              const animation = e.currentTarget.getAnimations()[0];
              if (animation) animation.playbackRate = 1;
            }}
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="mr-[2.5cqw] flex gap-[2.5cqw]"
              >
                {block.slots.map((slot, index) =>
                  slot.media?.type === "image" && slot.intrinsicSize ? (
                    <Image
                      key={index}
                      src={slot.media.src}
                      alt={copy === 0 ? (slot.alt ?? "") : ""}
                      width={slot.intrinsicSize.width}
                      height={slot.intrinsicSize.height}
                      sizes="(min-width: 1200px) 24vw, 50vw"
                      className="h-auto w-[50cqw] shrink-0 desk:w-[27cqw]"
                    />
                  ) : null,
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
