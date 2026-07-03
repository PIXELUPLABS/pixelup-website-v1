import Link from "next/link";
import type { CaseStudy } from "@/lib/case-studies";
import { CtaButtons } from "../CtaButtons";
import { Logo } from "../Logo";
import { MobileMenu } from "../MobileMenu";
import { ClientInfo } from "./ClientInfo";

function BackButton() {
  return (
    <Link
      href="/"
      aria-label="Back to all projects"
      className="-ml-1 inline-flex h-8 w-8 items-center justify-center text-white/60 transition-colors hover:text-white"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M19 12H5m0 0 6-6m-6 6 6 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

/**
 * Case study left nav: same logo header as the homepage LeftNav, but the body
 * is the project info (client / year / involvement / link + description) with
 * the site CTA buttons pinned to the bottom. Sticky full-height on desktop;
 * on mobile only the header renders here — ClientInfo moves under the title
 * (see CaseStudyPage) and the description is hidden, per the Figma mobile draft.
 */
export function CaseSidebar({ study }: { study: CaseStudy }) {
  return (
    // Width matches the homepage LeftNav exactly: that nav is 26% of a page with
    // 40px side padding, i.e. 0.26·(100vw−40px) = 26% − 10.4px, same min/max clamp.
    <aside className="desk:w-[calc(26%-10.4px)] desk:min-w-[340px] desk:max-w-[460px] desk:shrink-0 desk:border-r-[0.5px] desk:border-hairline">
      <div className="desk:sticky desk:top-0 desk:flex desk:h-screen desk:flex-col">
        {/* Header: logo + (mobile-only) hamburger. Same constraint as LeftNav:
            don't transform this row — the menu panel positions against the page. */}
        <div className="flex items-center justify-between p-5">
          <div className="fade-up">
            <Logo />
          </div>
          <MobileMenu />
        </div>

        <div className="no-scrollbar hidden desk:flex desk:min-h-0 desk:flex-1 desk:flex-col desk:justify-between desk:gap-8 desk:overflow-y-auto desk:pb-8 desk:pt-2">
          <div className="fade-up flex flex-col [animation-delay:100ms]">
            <div className="px-5 pb-3">
              <BackButton />
            </div>
            <ClientInfo info={study.info} />
            <div className="flex flex-col gap-3 px-5 pt-3">
              {study.description.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[12px] leading-[1.15] tracking-[-0.02em] text-white"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="fade-up px-5 [animation-delay:200ms]">
            <CtaButtons />
          </div>
        </div>
      </div>
    </aside>
  );
}
