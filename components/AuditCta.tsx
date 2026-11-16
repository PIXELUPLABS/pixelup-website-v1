import Script from "next/script";
import { ArrowIcon } from "@/components/ArrowIcon";
import { ctaButtonBase, ctaButtonPadding } from "@/components/CtaButtons";
import { TallyPopupLink } from "@/components/TallyPopupLink";

// Split out of AuditForm so the section's own markup stays uncluttered. The
// button itself is TallyPopupLink, which owns all of the popup behavior — see
// the note there.

export function AuditCta() {
  return (
    <>
      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
      {/* gap-8 rather than relying on justify-between alone: the side nav's
          buttons are flex-1 inside a narrow column, so justify-between does the
          spacing there. This one is content-width on desktop, so it needs an
          explicit gap. */}
      <TallyPopupLink
        className={`${ctaButtonBase} ${ctaButtonPadding} w-full shrink-0 gap-8 font-display bg-white text-black hover:bg-white/90 desk:w-auto`}
      >
        <span className="font-display font-medium">GET A PERCEPTION AUDIT</span>
        <ArrowIcon />
      </TallyPopupLink>
    </>
  );
}
