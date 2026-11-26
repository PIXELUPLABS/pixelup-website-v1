"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CaseMediaSlot } from "@/components/case-study/CaseMedia";
import type { ServiceSlide } from "@/lib/services";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** How long an image slide stays up before the carousel moves on. */
const IMAGE_DWELL_MS = 4500;
/** A video slide stays for one play-through, within these bounds. */
const VIDEO_DWELL_MIN_MS = 5000;
const VIDEO_DWELL_MAX_MS = 12000;

const controlMotion =
  "transition-colors duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none";

/**
 * A service row's work carousel on /services. Native scroll-snap does the
 * swiping (touch, trackpad, momentum), so there's no drag code.
 *
 * Auto-rotates, with limits so six carousels on one page stay calm: only
 * while the carousel is on screen, paused while the pointer is over it or
 * focus is inside it, and stopped for good once the visitor swipes, uses the
 * arrow keys or picks a slide themselves. Off entirely under reduced motion.
 * It loops back to the first slide after the last.
 *
 * Below the strip: the service's constant scope line, and TestimonialSlider's
 * position bars (clickable) at every size. Slides mount one ahead of the
 * furthest one seen, and none loads eagerly, so the H1 stays the page's only
 * LCP candidate. A pointer click on a slide opens the service page; keyboard and
 * screen-reader users get the row's title link instead.
 */
export function ServiceCarousel({
  label,
  caption,
  href,
  slides,
}: {
  /** Service name, read as "{label} work". */
  label: string;
  /** Constant per-service scope line under the strip (Service.scope). */
  caption: string;
  /** The service's detail page, once it exists. Without it a slide click
      does nothing and the strip shows no pointer cursor. */
  href?: string;
  slides: ServiceSlide[];
}) {
  const router = useRouter();
  const trackId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [maxSeen, setMaxSeen] = useState(0);
  // Announced once a scroll settles, so a long jump doesn't read out every
  // slide it passes.
  const [settled, setSettled] = useState(0);
  const count = slides.length;
  const multiple = count > 1;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !multiple) return;
    let frame = 0;
    let settleTimer = 0;
    const update = () => {
      frame = 0;
      const index = Math.round(track.scrollLeft / track.clientWidth);
      const clamped = Math.min(Math.max(index, 0), count - 1);
      setActive(clamped);
      setMaxSeen((seen) => Math.max(seen, clamped));
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => setSettled(clamped), 150);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
    };
  }, [count, multiple]);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const target = Math.min(Math.max(index, 0), count - 1);
      // Mount the target ahead of the scroll so it isn't blank on arrival.
      setMaxSeen((seen) => Math.max(seen, target));
      track.scrollTo({
        left: target * track.clientWidth,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    },
    [count],
  );

  // Auto-rotation state: see the component note for the rules.
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [takenOver, setTakenOver] = useState(false);
  const rotating = multiple && !takenOver;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !multiple) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.6 },
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, [multiple]);

  useEffect(() => {
    if (!rotating || !inView || paused || prefersReducedMotion()) return;
    // A video gets one full play-through before the carousel moves on.
    const video = trackRef.current?.children[active]?.querySelector("video");
    const dwell =
      video && Number.isFinite(video.duration)
        ? Math.min(Math.max(video.duration * 1000, VIDEO_DWELL_MIN_MS), VIDEO_DWELL_MAX_MS)
        : IMAGE_DWELL_MS;
    const timer = window.setTimeout(() => goTo((active + 1) % count), dwell);
    return () => window.clearTimeout(timer);
  }, [active, count, goTo, inView, paused, rotating]);

  const openService = (event: React.MouseEvent) => {
    if (!href || event.defaultPrevented || event.shiftKey || event.altKey) return;
    if (event.metaKey || event.ctrlKey) {
      window.open(href, "_blank", "noopener");
      return;
    }
    router.push(href);
  };


  return (
    <section
      aria-roledescription="carousel"
      aria-label={`${label} work`}
      className="flex flex-col gap-3"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setPaused(true);
      }}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div
        id={trackId}
        ref={trackRef}
        tabIndex={multiple ? 0 : undefined}
        onKeyDown={(event) => {
          // Leave modified arrows to the browser (Alt/Cmd+Arrow is back/forward).
          if (!multiple || event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;
          if (event.key === "ArrowRight") {
            event.preventDefault();
            setTakenOver(true);
            goTo(active + 1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            setTakenOver(true);
            goTo(active - 1);
          }
        }}
        // A swipe or a sideways trackpad scroll: the visitor is driving now.
        onTouchStart={() => setTakenOver(true)}
        onWheel={(event) => {
          if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) setTakenOver(true);
        }}
        onClick={openService}
        onAuxClick={(event) => {
          if (href && event.button === 1) window.open(href, "_blank", "noopener");
        }}
        className={`no-scrollbar flex ${href ? "cursor-pointer" : ""} snap-x snap-mandatory overflow-x-auto overscroll-x-contain focus-visible:outline focus-visible:outline-[0.5px] focus-visible:outline-white/60`}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.media.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className="w-full shrink-0 snap-start snap-always"
          >
            {i <= maxSeen + 1 ? (
              <CaseMediaSlot
                slot={{ media: slide.media, alt: slide.alt, tone: slide.tone }}
                aspect="aspect-[1160/696]"
                sizes="(min-width: 1200px) calc(50vw - 202px), 100vw"
              />
            ) : (
              <div aria-hidden="true" className="aspect-[1160/696] w-full bg-white/[0.04]" />
            )}
          </div>
        ))}
      </div>

      {/* The scope line never wraps; when it and the bars don't fit on one
          line (mobile, and the narrow half column near desk), the bars drop
          to their own line under it. */}
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="whitespace-nowrap text-[14px] leading-[1.3] tracking-[-0.01em] text-muted-65">
          {caption}
        </p>
        {multiple && (
          <>
            {/* Silent while it rotates on its own, so a screen reader isn't
                read a slide number every few seconds. */}
            <p className="sr-only" aria-live={rotating ? "off" : "polite"}>
              {settled + 1} of {count}
            </p>
            <div className="flex shrink-0 items-center gap-1">
              {slides.map((slide, i) => (
                <button
                  key={slide.media.src}
                  type="button"
                  aria-controls={trackId}
                  aria-label={`Image ${i + 1} of ${count}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => {
                    setTakenOver(true);
                    goTo(i);
                  }}
                  className="group/bar flex h-6 w-6 cursor-pointer items-center"
                >
                  <span
                    className={`h-0.5 w-full ${controlMotion} ${
                      i === active ? "bg-white" : "bg-white/20 group-hover/bar:bg-white/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
