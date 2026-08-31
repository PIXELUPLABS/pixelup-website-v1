import Image from "next/image";
import { links } from "@/lib/projects";

function PaperPlaneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Shared button geometry/type, deliberately free of any color, vertical
// padding, or flex-sizing class. AuditCta reuses this for the white variant —
// appending `text-black` to a base that already carries `text-white` would NOT
// reliably win (equal specificity, so stylesheet order decides, not
// class-attribute order), so the colorway is always the caller's job. Vertical
// padding is out for exactly the same reason: AuditNavCta runs a shorter button
// inside the 64px navbar, and an appended py-* couldn't reliably override a
// baked-in one. Every caller states its own py-*.
export const ctaButtonBase =
  "flex items-center justify-between rounded-[2px] px-3 " +
  "font-display text-[12px] font-medium tracking-[-0.12px] transition-colors";

/** The standard full-size CTA height, used everywhere except the navbar. */
export const ctaButtonPadding = "py-[11.5px]";

const baseButton = `${ctaButtonBase} ${ctaButtonPadding} flex-1 text-white`;

export function CtaButtons({
  telegramSolidBlack = false,
}: {
  /** Footer's Telegram button stays solid black, no hover lighten. */
  telegramSolidBlack?: boolean;
}) {
  return (
    // Stacked and full width at every breakpoint. Side by side on mobile forced
    // "START A CONVERSATION" onto two lines, leaving the two buttons
    // mismatched in height.
    <div className="flex flex-col gap-2.5">
      <a
        href={links.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseButton} ${
          telegramSolidBlack ? "bg-black" : "bg-button-dark hover:bg-white/[0.12]"
        }`}
      >
        <span>START A CONVERSATION</span>
        <PaperPlaneIcon />
      </a>
      <a
        href={links.discoveryCall}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseButton} bg-accent hover:brightness-110`}
      >
        <span>BOOK A CALL</span>
        <Image src="/media/Container.svg" alt="" width={14} height={14} aria-hidden="true" />
      </a>
    </div>
  );
}
