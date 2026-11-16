import type { Metadata } from "next";
import Link from "next/link";
import { BlogFaq } from "@/components/blog/BlogFaq";
import { Metrics } from "@/components/case-study/CaseStudyStory";
import { Emphasis } from "@/components/case-study/Emphasis";
import { CtaButtons } from "@/components/CtaButtons";
import { Footer } from "@/components/Footer";
import { LeftNav } from "@/components/LeftNav";
import { ProcessSection } from "@/components/ProcessSection";
import { ProjectCard } from "@/components/ProjectCard";
import {
  bleedMargin,
  DetailRow,
  noBreakHyphens,
  RegMarks,
  SectionIndex,
  SplitHeader,
} from "@/components/SectionRows";
import { BatchProgramme } from "@/components/yc/BatchProgramme";
import { FundingChart } from "@/components/yc/FundingChart";
import { siteUpdated } from "@/lib/site-dates";
import {
  ycBatchCount,
  ycBatchGroups,
  ycBatchRange,
  ycClients,
  ycClosing,
  ycFaq,
  ycFeatured,
  ycFeaturedWork,
  ycFunding,
  ycMoreWork,
  ycMoreWorkSection,
  ycProcess,
  ycRaisedM,
  ycRoster,
  ycSectionLabels as labels,
  ycTestimonials,
  ycWhy,
} from "@/lib/yc";

const PAGE_URL = "https://www.pixeluplabs.com/yc/";
const title = "Design Agency for YC Companies - PIXELUP LABS";
const description = `Brand, website and product design for ${ycClients.length} YC companies, from in-batch to Series C. Greptile went from YC W24 to a $25M Series A in 6 months.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/yc" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: title,
  description,
  datePublished: siteUpdated.yc,
  dateModified: siteUpdated.yc,
  isPartOf: { "@id": "https://www.pixeluplabs.com/#website" },
  about: { "@id": "https://www.pixeluplabs.com/#organization" },
  mainEntity: {
    "@type": "ItemList",
    name: "YC companies PIXELUP LABS has designed for",
    numberOfItems: ycClients.length,
    itemListElement: ycClients.map((client, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: { "@type": "Organization", name: client.name },
    })),
  },
};

/** FAQPage JSON-LD for the page's own questions (pixelupFaqSchema's shape). */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ycFaq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

/** Lead copy under a section's H2: ProcessSection's intro treatment. */
const lead = "max-w-[60ch] text-[16px] leading-[1.5] text-muted-65";

/** Row and column titles: one size under the H2 (ProcessSection's steps). */
const rowHeading =
  "text-balance text-[20px] font-medium leading-tight tracking-display text-white desk:text-[24px]";

/** The site's text link (BlogPostSidebar, CaseFaq): the accent and filled
    buttons stay with Book a call in the sidebar. */
const textLink =
  "w-fit text-[14px] leading-[1.3] tracking-[-0.01em] text-white underline underline-offset-2 transition-colors hover:text-white/70";

/** A bleed section: its top rule runs from the LeftNav divider to the
    viewport edge, and RegMarks sit where that rule crosses the lines. */
const section = `relative border-t-[0.5px] border-hairline ${bleedMargin}`;

/** bleedMargin padded back, for full-width blocks inside a bleed section. */
const bleedPadding = "desk:pl-4 desk:pr-5";

/**
 * /yc, set like a Swiss poster programme on the site's LeftNav shell: the
 * sticky sidebar carries the pitch, quotes and the one CTA, and the column
 * reads top to bottom as numbered sections, 01 Raised to 07 FAQ. Every rule
 * bleeds to the divider and the viewport edge (Arjun, 2026-11-12) and
 * carries hairline registration marks where it crosses them.
 */
export default function YcPage() {
  return (
    <div className="relative">
      <div className="relative flex flex-col gap-8 p-4 desk:flex-row desk:items-start desk:gap-0 desk:p-5">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {/* No TrustedStrip: the chart and the index are the same companies,
            with their numbers. */}
        <LeftNav
          sticky
          balanceHero
          showTrustedStrip={false}
          testimonials={ycTestimonials}
          heading={`The design team behind ${ycClients.length} YC companies`}
          subheading={
            <>
              From in-batch to Series C, we design brand, website and product
              as one system.{" "}
              <strong className="font-medium text-white">
                Greptile went from YC W24 to a $25M Series A in 6 months.
              </strong>
            </>
          }
        />
        <div
          aria-hidden="true"
          className="hidden desk:mx-4 desk:-my-5 desk:block desk:self-stretch desk:border-l-[0.5px] desk:border-hairline"
        />
        <main className="flex min-w-0 flex-1 flex-col">
          {/* 01 — Raised: the poster. One number, then the companies behind
              it as plain blocks. Text, so it's also the page's LCP. */}
          <section
            aria-labelledby="yc-raised-heading"
            className={`relative ${bleedMargin}`}
          >
            <div className={`flex flex-col gap-8 pb-12 ${bleedPadding}`}>
              <div className="flex items-baseline justify-between gap-6">
                <SectionIndex index={1} label={labels.raised} />
                <p className="hidden font-mono text-[12px] uppercase leading-none tracking-[0.06em] text-white/40 desk:block">
                  Fig. 01 — YC {ycBatchRange.first} → {ycBatchRange.last}
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <h2 id="yc-raised-heading" className="sr-only">
                  Funding raised by our YC clients
                </h2>
                <p
                  aria-hidden="true"
                  className="fade-up text-[88px] font-medium leading-[0.8] tracking-clients-heading text-white [animation-delay:150ms] desk:text-[168px]"
                >
                  ${ycRaisedM}M
                </p>
                <p className="fade-up max-w-[44ch] text-pretty text-[16px] leading-[1.5] text-muted-65 [animation-delay:250ms]">
                  Raised by the{" "}
                  <strong className="font-medium text-white">
                    {ycClients.length} YC companies we design for
                  </strong>
                  , across {ycBatchCount} batches. A floor, not an estimate:
                  public rounds only.
                </p>
              </div>
              <FundingChart entries={ycFunding} />
            </div>
          </section>

          {/* 02 — Featured: Greptile's journey in four cells. */}
          <section aria-labelledby="yc-featured-heading" className={section}>
            <RegMarks />
            <SplitHeader
              heading={ycFeatured.heading}
              headingId="yc-featured-heading"
              edge="bleed"
              eyebrow={<SectionIndex index={2} label={labels.featured} />}
            >
              <p className={lead}>
                <Emphasis text={ycFeatured.lead} format={noBreakHyphens} />
              </p>
              <Link href={ycFeatured.link.href} className={textLink}>
                {ycFeatured.link.label}
              </Link>
            </SplitHeader>
            <div
              className={`border-t-[0.5px] border-hairline py-6 ${bleedPadding}`}
            >
              <ProjectCard project={ycFeaturedWork} index={0} />
            </div>
            <Metrics
              metrics={ycFeatured.metrics}
              edge="bleed"
              bottomRule={false}
            />
          </section>

          {/* 03 — Index: the roster as a programme, by batch. */}
          <section aria-labelledby="yc-index-heading" className={section}>
            <RegMarks />
            <SplitHeader
              heading={ycRoster.heading}
              headingId="yc-index-heading"
              edge="bleed"
              eyebrow={<SectionIndex index={3} label={labels.index} />}
            >
              <p className={lead}>
                <Emphasis text={ycRoster.intro} />
              </p>
            </SplitHeader>
            <BatchProgramme groups={ycBatchGroups} />
          </section>

          {/* 04 — Work: a two-up grid of tiles split on the centre rule. */}
          <section aria-labelledby="yc-work-heading" className={section}>
            <RegMarks />
            <SplitHeader
              heading={ycMoreWorkSection.heading}
              headingId="yc-work-heading"
              edge="bleed"
              eyebrow={<SectionIndex index={4} label={labels.work} />}
            >
              <p className={lead}>
                <Emphasis text={ycMoreWorkSection.intro} />
              </p>
            </SplitHeader>
            <div className="grid desk:grid-cols-2">
              {ycMoreWork.map((project, index) => (
                <div
                  key={project.slug}
                  className={`border-t-[0.5px] border-hairline py-6 ${
                    index % 2 === 0
                      ? "desk:border-r-[0.5px] desk:pl-4 desk:pr-6"
                      : "desk:pl-6 desk:pr-5"
                  }`}
                >
                  <ProjectCard project={project} index={index + 1} compact />
                </div>
              ))}
            </div>
          </section>

          {/* 05 — Why: three numbered columns, then what you get. */}
          <section aria-labelledby="yc-why-heading" className={section}>
            <RegMarks />
            <SplitHeader
              heading={ycWhy.heading}
              headingId="yc-why-heading"
              edge="bleed"
              eyebrow={<SectionIndex index={5} label={labels.why} />}
            />
            <ol className="grid list-none border-t-[0.5px] border-hairline desk:grid-cols-3">
              {ycWhy.columns.map((column, index) => (
                <li
                  key={column.title}
                  className={`flex flex-col gap-4 py-6 ${
                    index > 0
                      ? "border-t-[0.5px] border-hairline desk:border-l-[0.5px] desk:border-t-0"
                      : ""
                  } ${
                    index === 0
                      ? "desk:pl-4 desk:pr-6"
                      : index === ycWhy.columns.length - 1
                        ? "desk:pl-6 desk:pr-5"
                        : "desk:px-6"
                  }`}
                >
                  <p className="font-mono text-[12px] leading-none text-white/40">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className={rowHeading}>{column.title}</h3>
                  <p className="text-[16px] leading-[1.5] text-muted-65">
                    <Emphasis text={column.body} format={noBreakHyphens} />
                  </p>
                </li>
              ))}
            </ol>
            <div className="border-t-[0.5px] border-hairline">
              <DetailRow
                edge="bleed"
                label={<h3 className={rowHeading}>{ycWhy.deliverablesLabel}</h3>}
              >
                {/* CaseSection's shipped-work list. */}
                <ul className="flex list-none flex-col gap-2 leading-[1.35]">
                  {ycWhy.deliverables.map((item, index) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="text-white/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </DetailRow>
            </div>
          </section>

          {/* 06 — Process: each step's weeks on one track, so the rows read
              as a Gantt chart. */}
          <ProcessSection
            edge="bleed"
            content={ycProcess}
            marks
            eyebrow={<SectionIndex index={6} label={labels.process} />}
          />

          {/* 07 — FAQ, on the same two-column grid. */}
          <BlogFaq
            items={ycFaq}
            grid
            marks
            eyebrow={<SectionIndex index={7} label={labels.faq} />}
          />

          {/* Below desk only: the sidebar's buttons have scrolled away by
              here. Desk keeps the sticky sidebar, so this would repeat it. */}
          <section
            aria-labelledby="yc-closing-heading"
            className="flex flex-col gap-6 py-10 desk:hidden"
          >
            <h2
              id="yc-closing-heading"
              className="text-[40px] font-medium leading-none tracking-clients-heading text-white"
            >
              {ycClosing.heading}
            </h2>
            <p className={lead}>{ycClosing.body}</p>
            <CtaButtons />
          </section>

          <div className="-mx-4 -mb-4 desk:-mr-5 desk:-mb-5 desk:-ml-4 desk:mt-8">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
