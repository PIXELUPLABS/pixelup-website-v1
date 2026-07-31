import Script from "next/script";
import { ctaButtonBase } from "@/components/CtaButtons";

// Split out of AuditForm so the section's own markup stays uncluttered. Note
// there's no "use client" here: Tally's embed.js binds through a single
// delegated document click listener (`target.closest("[data-tally-open]")`), so
// the data-tally-* attributes below are all the wiring needed — this component
// ships zero JS of our own, and the button keeps working after a client-side
// navigation because nothing is bound to the element itself.
const TALLY_FORM_ID = "7ROjKa";

// The site's arrow glyph. Inlined rather than using /media/Container.svg because
// that asset hardcodes fill="white", which would be invisible on a white button.
// currentColor lets it inherit text-black here and text-white anywhere else.
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.2173 8.80431V7.19579H9.60876V8.80431H11.2173ZM9.60876 7.19579V5.58727H8.00024V7.19579H9.60876ZM9.60876 10.4128V8.80431H8.00024V10.4128H9.60876ZM8.00024 5.58727V3.97876H6.39172V5.58727H8.00024ZM8.00024 12.0213V10.4128H6.39172V12.0213H8.00024ZM6.39172 3.97876V2.37024H4.7832V3.97876H6.39172ZM6.39172 13.6299V12.0213H4.7832V13.6299H6.39172Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AuditCta() {
  return (
    <>
      {/* afterInteractive (the default) rather than beforeInteractive: it can
          live in a non-root component, so the script only downloads on the
          routes that actually render this section (/, /blog, /blog/[slug])
          instead of site-wide. Next.js loads it once even if a visitor
          navigates between two of those routes. */}
      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
      {/* An <a> to the hosted form, not a <button>: Tally's listener calls
          preventDefault() before opening the popup, so the href never fires
          normally — it's purely the fallback for when embed.js is blocked or
          still in flight, where a <button> would just be dead. Matches
          CtaButtons, which is also <a>-based.

          Responsiveness is Tally's own: width=600 is a desktop max, and its
          stylesheet clamps the modal to max-width 95vw with a dedicated
          <=576px breakpoint, so no mobile override is needed here.

          gap-8 rather than relying on justify-between alone: the side nav's
          buttons are flex-1 inside a narrow column, so justify-between does the
          spacing there. This one is content-width on desktop, so it needs an
          explicit gap. */}
      <a
        href={`https://tally.so/r/${TALLY_FORM_ID}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-haspopup="dialog"
        data-tally-open={TALLY_FORM_ID}
        data-tally-layout="modal"
        data-tally-width="600"
        data-tally-form-events-forwarding="1"
        className={`${ctaButtonBase} w-full shrink-0 gap-8 font-display bg-white text-black hover:bg-white/90 desk:w-auto`}
      >
        <span className="font-display font-medium">GET YOUR FREE AUDIT</span>
        <ArrowIcon />
      </a>
    </>
  );
}
