import Link from "next/link";
import { ArrowIcon } from "./ArrowIcon";
import { ctaButtonBase, ctaButtonPadding } from "./cta-button-styles";

/**
 * "Book a call" as a plain link to /call, in the accent colorway: the site's
 * one primary action wherever the email-first BookCallForm isn't used.
 *
 * - "full": the sidebar size, full width at the standard CTA height.
 * - "nav": content width at the shorter navbar height (see AuditNavCta's note
 *   on why 32px sits better inside the 64px bar).
 */
export function CallButton({
  size = "full",
  label = "BOOK A CALL",
  className = "",
}: {
  size?: "full" | "nav";
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href="/call"
      className={`group ${ctaButtonBase} ${
        size === "nav" ? "shrink-0 gap-3 py-2" : `${ctaButtonPadding} w-full gap-3`
      } bg-accent text-white hover:brightness-110 ${className}`}
    >
      <span>{label}</span>
      {/* Hover: the arrow nudges a few pixels to the right, as on BookCallForm. */}
      <span className="transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px] motion-reduce:transition-none">
        <ArrowIcon size={14} />
      </span>
    </Link>
  );
}
