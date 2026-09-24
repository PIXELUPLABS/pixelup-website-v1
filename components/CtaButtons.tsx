import { links } from "@/lib/projects";
import { BookCallForm } from "./BookCallForm";
import { ctaButtonBase, ctaButtonPadding } from "./cta-button-styles";

// Re-exported so existing importers (AuditCta, AuditNavCta) keep working.
export { ctaButtonBase, ctaButtonPadding };

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

const baseButton = `${ctaButtonBase} ${ctaButtonPadding} flex-1 text-white`;

export function CtaButtons({
  telegramSolidBlack = false,
}: {
  /** Footer's Telegram button stays solid black, no hover lighten. */
  telegramSolidBlack?: boolean;
}) {
  return (
    // Stacked and full width at every breakpoint. Side by side on mobile forced
    // the longer label onto two lines, leaving the two CTAs mismatched in
    // height — and the Book a call row needs the full width for its field.
    <div className="flex flex-col gap-2.5">
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
      <BookCallForm />
    </div>
  );
}
