"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

// Routes that bring their own header and full-viewport layout (see below). /2027 joins when its page ships here.
const OWN_SHELL = new Set(["/process"]);

/**
 * The shared shell around every page: the sticky Navbar inside a column
 * capped at 1800px.
 *
 * The cap centers the site on very large monitors — the page was stretching
 * edge-to-edge, which broke the intended layout proportions. Only binds above
 * 1800px; no effect at smaller sizes. The hairline side borders only kick in
 * past that same breakpoint (min-[1800px]:) — below it the div already spans
 * the full viewport, so a border there would just be a stray line glued to
 * the screen edge instead of framing the centered column.
 *
 * /process (How we work, app/process) brings its own header and lays itself
 * out on the full viewport, so it renders without either. Exact match only:
 * nothing exists below it, and an unmatched URL under it serves the
 * prerendered 404, which has the frame.
 */
export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (OWN_SHELL.has(pathname)) return children;

  return (
    <div className="mx-auto max-w-[1800px] min-[1800px]:border-x-[0.5px] min-[1800px]:border-hairline">
      <Navbar />
      {children}
    </div>
  );
}
