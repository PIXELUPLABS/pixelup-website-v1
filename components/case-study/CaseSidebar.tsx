import type { CaseStudy } from "@/lib/case-studies";
import { BackButton } from "../BackButton";
import { CtaButtons } from "../CtaButtons";
import { LeadCallout } from "../LeadCallout";
import { ClientInfo } from "./ClientInfo";

/**
 * Case study left nav: project info (client / year / involvement / link +
 * description) with the site CTA buttons pinned to the bottom. Logo and the
 * mobile hamburger live in the global Navbar now, not here. Sticky
 * full-height on desktop; on mobile this renders nothing — ClientInfo moves
 * under the title (see CaseStudyPage) and the description is hidden, per the
 * Figma mobile draft.
 */
export function CaseSidebar({ study }: { study: CaseStudy }) {
  return (
    // 405px, same as LeftNav and the blog asides. This used to be
    // calc(26% - 10.4px) — the viewport-relative math that made a percentage
    // width resolve identically on a page without the homepage's 40px side
    // padding. A fixed px width needs no such compensation.
    <aside className="desk:w-[405px] desk:shrink-0 desk:border-r-[0.5px] desk:border-hairline">
      {/* top-16/h-[calc(100vh-4rem)] account for the sticky Navbar's height
          (h-16, 4rem) above this page, so the sidebar sits flush below it
          instead of sticking underneath it. */}
      <div className="desk:sticky desk:top-16 desk:flex desk:h-[calc(100vh-4rem)] desk:flex-col">
        {/* pb-6 matches the main column's 24px bottom padding. */}
        <div className="no-scrollbar hidden desk:flex desk:min-h-0 desk:flex-1 desk:flex-col desk:justify-between desk:gap-8 desk:overflow-y-auto desk:pb-6 desk:pt-2">
          <div className="fade-up flex flex-col [animation-delay:100ms]">
            <div className="px-5 pb-3">
              <BackButton label="Back to all projects" icon="arrow" />
            </div>
            <ClientInfo info={study.info} />
            <div className="flex flex-col gap-3 px-5 pt-3">
              {study.description.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[14px] leading-[1.35] tracking-[-0.01em] text-white"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          {/* No TrustedStrip on this page, so the callout sits straight on top
              of the CTAs. gap-5 matches the callout/strip/CTA rhythm the other
              sidebars use. */}
          <div className="fade-up flex flex-col gap-5 px-5 [animation-delay:200ms]">
            <LeadCallout />
            <CtaButtons />
          </div>
        </div>
      </div>
    </aside>
  );
}
