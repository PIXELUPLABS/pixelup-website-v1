"use client";

import { useEffect, useRef, useState } from "react";

export interface SectionNavItem {
  id: string;
  label: string;
  /** "01"…: shown in the list variant only. Items without one keep the column. */
  index?: string;
  /** Optional mono count before the active marker, list variant only
      (/swipe: "Posts 189", "Creators 93"). */
  count?: string;
}

/**
 * Tracks which section the reader is in: the last one whose top has crossed
 * a line 30% down the viewport. A scroll check rather than an
 * IntersectionObserver band, because the long service sections and the gaps
 * between them would otherwise leave no section "active" mid-read.
 */
function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ids]);

  return activeId;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Same in-page scroll as AuditNavCta: smooth unless reduced motion is on,
 * and the hash kept shareable via replaceState. The sections' scroll-mt-*
 * keeps their tops clear of the sticky Navbar (and the mobile strip). */
function scrollToSection(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  window.history.replaceState(null, "", `#${id}`);
}

/**
 * In-page section index for long single pages (used on /swipe).
 *
 * - "list": the desktop sidebar. Hairline-divided rows in ClientInfo's
 *   rhythm (px-5 py-3, 14px), a mono index, and a small square
 *   color.brand.accent marker on the active row.
 * - "strip": the mobile bar pinned under the Navbar. Horizontal scroll of
 *   the same sharp pills as the /case-studies niche filter, active in
 *   color.brand.accent. The active pill is scrolled into view within the
 *   strip, never the page.
 */
export function SectionNav({
  items,
  variant,
}: {
  items: SectionNavItem[];
  variant: "list" | "strip";
}) {
  const [ids] = useState(() => items.map((item) => item.id));
  const activeId = useActiveSection(ids);
  const stripRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (variant !== "strip" || !activeId) return;
    const strip = stripRef.current;
    const pill = strip?.querySelector<HTMLElement>(`[data-section="${activeId}"]`);
    if (!strip || !pill) return;
    // Scroll only the strip. pill.scrollIntoView() would also move the page.
    strip.scrollTo({
      left: pill.offsetLeft - (strip.clientWidth - pill.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [activeId, variant]);

  if (variant === "strip") {
    return (
      <nav
        aria-label="On this page"
        className="sticky top-16 z-20 border-b-[0.5px] border-hairline bg-base desk:hidden"
      >
        <ul
          ref={stripRef}
          className="no-scrollbar relative flex gap-2 overflow-x-auto px-6 py-3"
        >
          {items.map((item) => {
            const active = item.id === activeId;
            return (
              <li key={item.id} data-section={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "location" : undefined}
                  onClick={(event) => scrollToSection(event, item.id)}
                  className={`block whitespace-nowrap px-3 py-1 font-button text-[12px] font-semibold uppercase tracking-[-0.02em] transition-colors ${
                    active
                      ? "border border-transparent bg-accent text-white"
                      : "border border-dashed border-hairline text-white/40 hover:bg-button-dark"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="On this page">
      <ul className="flex flex-col divide-y-[0.5px] divide-hairline border-y-[0.5px] border-hairline">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                onClick={(event) => scrollToSection(event, item.id)}
                className="group flex items-center gap-3 px-5 py-3 text-[14px] leading-[1.3] tracking-[-0.01em]"
              >
                <span
                  aria-hidden="true"
                  className={`w-5 shrink-0 font-mono text-[12px] leading-none ${
                    active ? "text-white" : "text-white/40"
                  }`}
                >
                  {item.index}
                </span>
                <span
                  className={`min-w-0 flex-1 transition-colors ${
                    active ? "text-white" : "text-white/60 group-hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
                {item.count && (
                  <span className="shrink-0 font-mono text-[12px] leading-none text-white/40">
                    {item.count}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 shrink-0 bg-accent transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
