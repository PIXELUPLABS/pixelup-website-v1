import { ctaButtonBase } from "@/components/CtaButtons";
import { TallyPopupLink } from "@/components/TallyPopupLink";

// Split out of AuditForm so the section's own markup stays uncluttered. The
// button itself is TallyPopupLink (shared with the Navbar CTA), which owns all
// of the popup behavior — see the note there.

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
      {/* embed.js is no longer loaded here — the Navbar CTA needs it on every
          route, so it loads once there and this button rides on that. See the
          note in components/Navbar.tsx.

          gap-8 rather than relying on justify-between alone: the side nav's
          buttons are flex-1 inside a narrow column, so justify-between does the
          spacing there. This one is content-width on desktop, so it needs an
          explicit gap. */}
      <TallyPopupLink
        className={`${ctaButtonBase} w-full shrink-0 gap-8 font-display bg-white text-black hover:bg-white/90 desk:w-auto`}
      >
        <span className="font-display font-medium">GET A PERCEPTION AUDIT</span>
        <ArrowIcon />
      </TallyPopupLink>
    </>
  );
}
