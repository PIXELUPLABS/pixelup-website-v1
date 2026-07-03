import Image from "next/image";
import caseBg from "@/public/media/case-bg.png";
import type { CaseStudy } from "@/lib/case-studies";
import { CaseFaq } from "./CaseFaq";
import { CaseMediaBlock } from "./CaseMedia";
import { CaseQuote } from "./CaseQuote";
import { CaseSection } from "./CaseSection";
import { CaseSidebar } from "./CaseSidebar";
import { ClientInfo } from "./ClientInfo";
import { MoreProjects } from "./MoreProjects";
import { SectionShell } from "./SectionShell";

/**
 * Shared case study template (see Figma case study drafts): sticky info
 * sidebar + main column of title, hero, staggered Q&A sections with media
 * rows, quote, FAQ, more projects, and the site footer.
 */
export function CaseStudyPage({ study }: { study: CaseStudy }) {
  return (
    // `relative` so the MobileMenu panel positions against the page.
    <div className="relative">
      {/* Blue light-streak page background from Figma (the full locked `bg`
          layer, 1440×6773): anchored to the very top, spanning the full page
          width and flowing down the page behind all content. The mask fades
          the image's bottom edge out so tall pages never show a hard cut. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 select-none [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]"
      >
        <Image
          src={caseBg}
          alt=""
          priority
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>

      <div className="relative flex flex-col desk:flex-row">
        <CaseSidebar study={study} />

        <main className="min-w-0 flex-1 desk:pb-6">
          {/* Title + (mobile) client info + hero. */}
          <div className="flex flex-col gap-4 desk:gap-0">
            {/* Equal 24px space above and below the title on every breakpoint
                (mobile: 8px padding + the 16px flex gap); height grows with
                content. The max-width keeps the title on two lines. */}
            <div className="p-6 pb-2 desk:pb-6">
              <h1 className="fade-up tracking-display max-w-[30ch] text-balance text-[32px] font-medium leading-none text-white [animation-delay:100ms] desk:text-[56px]">
                {study.title}
              </h1>
            </div>
            <ClientInfo info={study.info} className="fade-up [animation-delay:200ms] desk:hidden" />
            <div className="fade-up [animation-delay:300ms]">
              <CaseMediaBlock block={{ kind: "full", slot: study.hero }} />
            </div>
          </div>

          {/* Everything below the hero shares the faint center rule from the
              Figma template (desktop only); content paints above it. */}
          <div className="relative mt-4">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-1/2 hidden border-l-[0.5px] border-hairline desk:block"
            />
            <div className="relative flex flex-col gap-4">
              {study.sections.map((section) => (
                <div key={section.heading} className="flex flex-col gap-4">
                  <CaseSection section={section} />
                  {section.media.map((block, index) => (
                    <CaseMediaBlock key={index} block={block} />
                  ))}
                </div>
              ))}

              <CaseQuote quote={study.quote} />

              <SectionShell heading={study.faqHeading}>
                <CaseFaq items={study.faq} />
              </SectionShell>

              <MoreProjects refs={study.moreProjects} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
