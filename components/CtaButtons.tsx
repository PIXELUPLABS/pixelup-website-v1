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

// Shared button geometry/type, deliberately free of any color or flex-sizing
// class. AuditCta reuses this for the white variant — appending `text-black` to
// a base that already carries `text-white` would NOT reliably win (equal
// specificity, so stylesheet order decides, not class-attribute order), so the
// colorway is always the caller's job.
export const ctaButtonBase =
  "flex items-center justify-between rounded-[2px] px-3 py-[11.5px] " +
  "font-button text-[12px] font-semibold tracking-[-0.12px] transition-colors";

const baseButton = `${ctaButtonBase} flex-1 text-white`;

export function CtaButtons({
  telegramSolidBlack = false,
  stacked = false,
}: {
  /** Footer's Telegram button stays solid black, no hover lighten. */
  telegramSolidBlack?: boolean;
  /** Force vertical stacking, full width, at every breakpoint — for narrow
      contexts like the mobile menu panel, instead of the default row-on-
      mobile/column-on-desktop split. */
  stacked?: boolean;
}) {
  return (
    // Mobile: two-up side by side. Desktop: stacked, full width.
    <div className={`flex gap-2.5 ${stacked ? "flex-col" : "flex-row desk:flex-col"}`}>
      <a
        href={links.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseButton} ${
          telegramSolidBlack ? "bg-black" : "bg-button-dark hover:bg-white/[0.12]"
        }`}
      >
        <span>CHAT ON TELEGRAM</span>
        <PaperPlaneIcon />
      </a>
      <a
        href={links.discoveryCall}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseButton} bg-accent hover:brightness-110`}
      >
        <span>START YOUR CONVERSATION</span>
        <Image src="/media/Container.svg" alt="" width={14} height={14} aria-hidden="true" />
      </a>
    </div>
  );
}
