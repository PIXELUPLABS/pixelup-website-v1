"use client";

import Image from "next/image";
import { useState } from "react";
import type { Testimonial } from "@/lib/testimonials";

// Per-mark heights so the wordmarks sit optically level: ClientRow's idea, at
// the card's smaller scale. Marks not listed use the default.
const logoHeightBySlug: Record<string, string> = {
  greptile: "h-[18px]",
  henrylabs: "h-[14px]",
};
const defaultLogoHeight = "h-4";

/** Time on each quote, scaled to its length (~250ms a word) so a long quote
    stays up long enough to read, kept within 6–12s. */
function dwellMs(quote: string) {
  const words = quote.trim().split(/\s+/).length;
  return Math.min(Math.max(words * 250, 6000), 12000);
}

/**
 * Cross-fading testimonial card. Every slide sits in the same grid cell, so the
 * card holds the height of its tallest quote and nothing below it shifts.
 */
export function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);
  // Picking a testimonial hands control to the visitor, so rotation stops.
  const [rotating, setRotating] = useState(true);
  const count = testimonials.length;
  const autoplay = rotating && count > 1;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      className="group/testimonials relative rounded-[2px] bg-button-dark p-4"
    >
      <div className="grid" aria-live={autoplay ? "off" : "polite"}>
        {testimonials.map((testimonial, i) => (
          <figure
            key={testimonial.slug}
            className={`col-start-1 row-start-1 flex flex-col justify-between gap-4 transition-[opacity,visibility] duration-600 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
              i === active ? "visible opacity-100" : "invisible opacity-0"
            }`}
          >
            <div className="flex flex-col gap-4">
              {/* Same h-6 row as the progress bars, so the two line up. */}
              <div className="flex h-6 items-center">
                {testimonial.logo && (
                  <Image
                    src={testimonial.logo.src}
                    alt=""
                    width={testimonial.logo.width}
                    height={testimonial.logo.height}
                    className={`${
                      logoHeightBySlug[testimonial.slug] ?? defaultLogoHeight
                    } w-auto opacity-70 brightness-0 invert`}
                  />
                )}
              </div>
              <blockquote className="text-pretty text-[14px] leading-[1.4] text-white">
                “{testimonial.quote}”
              </blockquote>
            </div>
            <figcaption className="flex flex-col gap-0.5">
              <span className="text-[14px] leading-[1.3] text-white">{testimonial.name}</span>
              {(testimonial.role || testimonial.company) && (
                <span className="text-[12px] leading-[1.3] text-label-grey">
                  {[testimonial.role, testimonial.company].filter(Boolean).join(", ")}
                </span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {count > 1 && (
        <div className="absolute right-4 top-4 flex h-6 items-center gap-1">
          {testimonials.map((testimonial, i) => {
            const isActive = i === active;
            return (
              <button
                key={testimonial.slug}
                type="button"
                aria-label={`Testimonial ${i + 1} of ${count}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => {
                  setActive(i);
                  setRotating(false);
                }}
                className="group/bar flex h-6 w-6 cursor-pointer items-center"
              >
                <span className="relative h-0.5 w-full overflow-hidden bg-white/20 transition-colors group-hover/bar:bg-white/40">
                  {/* Fills over the slide's dwell time, and its animationend
                      advances the slider. Reduced motion drops the animation,
                      so the bar shows full and nothing rotates on its own. */}
                  <span
                    onAnimationEnd={
                      isActive && autoplay ? () => setActive((i + 1) % count) : undefined
                    }
                    style={
                      isActive && autoplay
                        ? { animationDuration: `${dwellMs(testimonial.quote)}ms` }
                        : undefined
                    }
                    className={`absolute inset-0 origin-left bg-white ${
                      !isActive
                        ? "scale-x-0"
                        : autoplay
                          ? "animate-[testimonial-progress_linear_forwards] group-focus-within/testimonials:[animation-play-state:paused] group-hover/testimonials:[animation-play-state:paused] motion-reduce:animate-none"
                          : ""
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
