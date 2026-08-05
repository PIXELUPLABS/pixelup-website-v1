"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Glyph pools, split by case: a lowercase source character is only ever swapped
 * for another lowercase one. That keeps a sentence-case label (the footer's
 * "Explorations") from flashing into all-caps mid-shuffle, and holds the
 * x-height rhythm steady while it resolves.
 */
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";

/**
 * 8 ticks x 28ms ≈ 225ms, and the tick count is fixed rather than per-character
 * so every label finishes in the same time — otherwise "Explorations" would
 * still be churning long after "Blog" had settled.
 */
const TICKS = 8;
const TICK_MS = 28;

/** Every not-yet-resolved letter becomes a random one from its own case. */
function scrambled(text: string, resolved: number) {
  let out = "";
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    // Spaces and punctuation are landmarks — shuffling them too makes the label
    // read as noise instead of as the same word resolving into place.
    if (i < resolved || !/[a-z]/i.test(char)) {
      out += char;
      continue;
    }
    const pool = char === char.toLowerCase() ? LOWER : UPPER;
    out += pool[Math.floor(Math.random() * pool.length)];
  }
  return out;
}

/**
 * A label that shuffles itself on hover, resolving left to right. Used for the
 * Navbar and Footer link labels.
 *
 * Hover-only on purpose — deliberately not wired to :focus-visible, because a
 * keyboard user landing on the link would otherwise watch the label churn at
 * the exact moment they're trying to read it.
 */
export function ShuffleText({
  text,
  className,
}: {
  text: string;
  /** Extra classes for the outer box — it's `inline-block`, so it hugs the text. */
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const timer = useRef<number | null>(null);

  // A shuffle still resolving when the route changes would keep calling
  // setState on an unmounted node — clear it on the way out.
  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current);
    },
    []
  );

  function settle() {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    setDisplay(text);
  }

  function start() {
    // Same reduced-motion opt-out that .fade-up honors in globals.css.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (timer.current) window.clearInterval(timer.current);

    let tick = 0;
    timer.current = window.setInterval(() => {
      tick += 1;
      if (tick >= TICKS) {
        settle();
        return;
      }
      setDisplay(scrambled(text, Math.floor((tick / TICKS) * text.length)));
    }, TICK_MS);
  }

  return (
    <span
      className={`relative inline-block whitespace-nowrap${className ? ` ${className}` : ""}`}
      onMouseEnter={start}
      onMouseLeave={settle}
    >
      {/* Width lock. Random glyphs don't share advance widths with the real
          ones, so animating the text in normal flow would jitter the nav row
          and the footer's link columns on every tick. This invisible copy of
          the real label holds the box open at its resting width and the
          shuffling copy floats on top of it. visibility:hidden also drops it
          out of the a11y tree, which leaves the overlay — holding `text`
          verbatim except during a hover — as the accessible name. */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span className="absolute inset-0">{display}</span>
    </span>
  );
}
