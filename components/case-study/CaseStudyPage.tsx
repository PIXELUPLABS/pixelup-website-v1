import {
  faqHeading,
  pixelupFaq,
  pixelupFaqSchema,
  type CaseStudy,
} from "@/lib/case-studies";
import { Footer } from "../Footer";
import { CaseFaq } from "./CaseFaq";
import { CaseMediaBlock } from "./CaseMedia";
import { CaseSection } from "./CaseSection";
import { CaseSidebar } from "./CaseSidebar";
import { ClientInfo } from "./ClientInfo";
import { MoreProjects } from "./MoreProjects";
import { SectionShell } from "./SectionShell";

/**
 * Shared case study template (see Figma case study drafts): sticky info
 * sidebar + main column of title, hero, staggered Q&A sections with media
 * rows, FAQ, more projects, and the site footer.
 */
export function CaseStudyPage({ study }: { study: CaseStudy }) {
  return (
    // `relative` so the MobileMenu panel positions against the page.
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pixelupFaqSchema) }}
      />
      <div className="relative flex flex-col desk:flex-row">
        <CaseSidebar study={study} />

        <main className="min-w-0 flex-1">
          {/* Title + (mobile) client info + hero. */}
          <div className="flex flex-col gap-4 desk:gap-0">
            {/* Equal 24px space above and below the title on every breakpoint
                (mobile: 8px padding + the 16px flex gap); height grows with
                content. The max-width keeps the title on two lines. On desktop
                the bottom gap is owned by the hero's own padding below instead
                (desk:pb-0), so it isn't double-counted. */}
            <div className="p-6 pb-2 desk:pb-0">
              <h1 className="fade-up max-w-[30ch] text-balance text-[32px] font-medium leading-tight tracking-[-0.02em] text-white [animation-delay:100ms] desk:text-[56px]">
                {study.title}
              </h1>
            </div>
            <ClientInfo info={study.info} className="fade-up [animation-delay:200ms] desk:hidden" />
            {/* CaseMediaBlock itself now owns the desk:p-6 spacing (shared
                with every other media block on the page) — no extra padding
                needed here. */}
            <div className="fade-up [animation-delay:300ms]">
              <CaseMediaBlock block={{ kind: "full", slot: study.hero }} priority />
            </div>
            {study.introMedia?.map((block, index) => (
              <CaseMediaBlock key={index} block={block} />
            ))}
          </div>

          {/* Everything below the hero shares the faint center rule from the
              Figma template (desktop only); content paints above it. desk:mt-0
              because the hero's own desk:p-6 above already provides the gap.
              desk:pb-6 lives on this wrapper (not <main>) so the rule below,
              which is inset-y-0 against this relative box, stretches through
              that padding and touches the footer instead of stopping short. */}
          <div className="relative mt-4 desk:mt-0 desk:pb-6">
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

              {study.closing && (
                <SectionShell heading={study.closing.heading} topRule>
                  {study.closing.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-[16px] leading-[1.5] text-white">
                      {paragraph}
                    </p>
                  ))}
                </SectionShell>
              )}

              <SectionShell heading={faqHeading} topRule>
                <CaseFaq items={pixelupFaq} />
              </SectionShell>

              <MoreProjects refs={study.moreProjects} />
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
