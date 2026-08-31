"use client";

import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";
import { ctaButtonBase } from "@/components/CtaButtons";

/** The AuditForm section's anchor — see its `id` and matching scroll-mt-16. */
const AUDIT_ANCHOR = "audit";

/**
 * White CTA in the top nav, pointing at the brand-audit section rather than
 * opening the Tally popup — the popup is the section's own AuditCta.
 *
 * The href is the cross-page form (`/#audit`) so it always resolves: AuditForm
 * only renders on the homepage, /blog, /clients, blog posts and case studies,
 * and on any other route the link falls back to the homepage's copy. When the
 * section IS on the current page, the click handler cancels that navigation and
 * scrolls in place instead. Feature-detecting the element beats keeping a list
 * of routes here in sync with wherever AuditForm gets added next.
 */
export function AuditNavCta({
  className = "",
  onNavigate,
}: {
  className?: string;
  /** Lets the mobile menu close itself when the CTA is used. */
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={`/#${AUDIT_ANCHOR}`}
      onClick={(event) => {
        onNavigate?.();

        const target = document.getElementById(AUDIT_ANCHOR);
        // Not on this page — let the Link navigate to the homepage's section.
        if (!target) return;

        event.preventDefault();
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
        // Keep the URL shareable without the jump replaceState avoids.
        window.history.replaceState(null, "", `#${AUDIT_ANCHOR}`);
      }}
      // py-2 rather than the shared ctaButtonPadding: the full-size 39px
      // button left only ~12px above and below inside the 64px navbar. 32px
      // sits better there, and 8px is on Tailwind's default 4px scale.
      className={`${ctaButtonBase} shrink-0 gap-3 py-2 bg-white text-black hover:bg-white/90 ${className}`}
    >
      <span>GET PERCEPTION AUDIT</span>
      <ArrowIcon />
    </Link>
  );
}
