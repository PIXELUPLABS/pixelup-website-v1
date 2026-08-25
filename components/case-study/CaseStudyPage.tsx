import Image from "next/image";
import {
  faqHeading,
  pixelupFaq,
  pixelupFaqSchema,
  type CaseStudy,
} from "@/lib/case-studies";
import { ctaButtonBase } from "../CtaButtons";
import { Footer } from "../Footer";
import { CaseFaq } from "./CaseFaq";
import { CaseMediaBlock } from "./CaseMedia";
import { CaseSection } from "./CaseSection";
import { CaseSidebar } from "./CaseSidebar";
import { CaseStudyStory } from "./CaseStudyStory";
import { ClientInfo } from "./ClientInfo";
import { MoreProjects } from "./MoreProjects";
import { SectionShell } from "./SectionShell";

function LegacyCaseStudy({ study }: { study: CaseStudy }) {
  return (
    <>
      <div className="flex flex-col gap-4 desk:gap-0">
        <div className="p-6 pb-2 desk:pb-0">
          <h1 className="fade-up max-w-[30ch] text-balance text-[32px] font-medium leading-tight tracking-[-0.02em] text-white [animation-delay:100ms] desk:text-[56px]">
            {study.title}
          </h1>
        </div>
        <ClientInfo
          info={study.info}
          className="fade-up [animation-delay:200ms] desk:hidden"
        />
        <div className="fade-up [animation-delay:300ms]">
          <CaseMediaBlock block={{ kind: "full", slot: study.hero }} priority />
        </div>
        {study.introMedia?.map((block, index) => (
          <CaseMediaBlock key={index} block={block} />
        ))}
      </div>

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
            <>
              <SectionShell
                heading={study.closing.heading}
                headingSize={study.closing.headingSize}
                topRule
              >
                {study.closing.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[16px] leading-[1.5] text-white"
                  >
                    {paragraph}
                  </p>
                ))}
              </SectionShell>
              {study.closing.media?.map((block, index) => (
                <CaseMediaBlock key={index} block={block} />
              ))}
            </>
          )}

          {study.endCta && (
            <div className="border-t-[0.5px] border-hairline p-6 desk:hidden">
              <a
                href={study.endCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${ctaButtonBase} w-full bg-accent text-white hover:brightness-110`}
              >
                <span>{study.endCta.label}</span>
                <Image
                  src="/media/Container.svg"
                  alt=""
                  width={14}
                  height={14}
                  aria-hidden="true"
                />
              </a>
            </div>
          )}

          <SectionShell heading={faqHeading} topRule>
            <CaseFaq items={pixelupFaq} />
          </SectionShell>

          <MoreProjects refs={study.moreProjects} />
        </div>
      </div>
    </>
  );
}

/** Shared page shell with an optional richer story renderer and legacy fallback. */
export function CaseStudyPage({ study }: { study: CaseStudy }) {
  return (
    <div className="relative">
      {!study.story && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pixelupFaqSchema) }}
        />
      )}
      <div className="relative flex flex-col desk:flex-row">
        <CaseSidebar study={study} />

        <main className="min-w-0 flex-1">
          {study.story ? (
            <CaseStudyStory study={study} />
          ) : (
            <LegacyCaseStudy study={study} />
          )}
          <Footer />
        </main>
      </div>
    </div>
  );
}
