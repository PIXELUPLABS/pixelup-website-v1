"use client";

import { TALLY_FORM_ID, tallyFormUrl } from "@/lib/tally";

declare global {
  interface Window {
    Tally?: { openPopup: (formId: string, options?: Record<string, unknown>) => void };
  }
}

/**
 * A link that opens the perception audit form in Tally's modal popup, on the
 * page you're already on. Used by the #audit section's AuditCta.
 *
 * Why this exists instead of bare data-tally-* attributes: Tally's embed.js
 * binds one delegated document click listener, and until that script has
 * loaded, nothing intercepts the click — the href just navigates.
 *
 * So the loaded case still goes through Tally's own listener (we return
 * without preventDefault and let it do its thing, same as always), and only
 * the not-yet-loaded case is handled here: swallow the navigation, then open
 * the popup the moment the script arrives. If it never arrives (blocked,
 * offline), fall back to the hosted form in the SAME tab — never a new one.
 * With JS disabled the onClick never runs and the href navigates, which is
 * the correct no-JS fallback.
 */
export function TallyPopupLink({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  /** Runs before the popup logic — MobileMenu uses it to close the panel. */
  onClick?: () => void;
}) {
  return (
    <a
      href={tallyFormUrl}
      aria-haspopup="dialog"
      data-tally-open={TALLY_FORM_ID}
      data-tally-layout="modal"
      data-tally-width="600"
      data-tally-form-events-forwarding="1"
      className={className}
      onClick={(event) => {
        onClick?.();
        // embed.js is loaded: its document-level listener will preventDefault
        // and open the popup itself. Opening it here too would double-fire.
        if (window.Tally) return;

        event.preventDefault();
        // next/script in AuditCta has already requested embed.js — poll until
        // it lands, then open. Matches the data-tally-* config above.
        const started = Date.now();
        const poll = window.setInterval(() => {
          if (window.Tally) {
            window.clearInterval(poll);
            window.Tally.openPopup(TALLY_FORM_ID, { layout: "modal", width: 600 });
          } else if (Date.now() - started > 5000) {
            window.clearInterval(poll);
            window.location.assign(tallyFormUrl);
          }
        }, 100);
      }}
    >
      {children}
    </a>
  );
}
