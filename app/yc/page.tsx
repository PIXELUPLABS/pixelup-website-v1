import type { Metadata } from "next";
import Link from "next/link";
import { BlogFaq } from "@/components/blog/BlogFaq";
import { ClientRoster } from "@/components/clients/ClientRoster";
import { Metrics } from "@/components/case-study/CaseStudyStory";
import { Emphasis } from "@/components/case-study/Emphasis";
import { CtaButtons } from "@/components/CtaButtons";
import { Footer } from "@/components/Footer";
import { ProcessSection } from "@/components/ProcessSection";
import { ProjectCard } from "@/components/ProjectCard";
import {
  noBreakHyphens,
  RegMarks,
  SectionIndex,
  SplitHeader,
} from "@/components/SectionRows";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { FundingChart } from "@/components/yc/FundingChart";
import { siteUpdated } from "@/lib/site-dates";
import {
  ycClients,
  ycClosing,
  ycFaq,
  ycFeatured,
  ycFeaturedWork,
  ycFunding,
  ycIndex,
  ycIndexBatches,
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

/** The site's text link (BlogPostSidebar, CaseFaq): the accent and filled
    buttons stay with Book a call in the hero and the closing section. */
const textLink =
  "w-fit text-[14px] leading-[1.3] tracking-[-0.01em] text-white underline underline-offset-2 transition-colors hover:text-white/70";

/** A full-width section: its top rule runs edge to edge of the column, and
    a RegMark sits where it crosses the centre rule. */
const section = "relative border-t-[0.5px] border-hairline";

/** The CTA buttons at LeftNav's 405px width (/faq caps them the same way),
    so they read as buttons, not bars, in a half-width cell. */
const ctaWidth = "w-full max-w-[405px]";

/**
 * /yc, set like a Swiss poster programme, full width with no sidebar (Arjun,
 * 2026-11-16). The hero carries the pitch and the CTA, then the page reads
 * top to bottom as numbered sections, 01 Raised to 07 FAQ, and closes on
 * the CTA again beside a founder's quote. Every section uses SectionRows'
 * "inset" geometry: rules run edge to edge, text sits 24px inside the
 * quarter lines, and a hairline registration mark sits on the centre rule.
 */
export default function YcPage() {
  return (
    <main className="flex min-w-0 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero: the H1 in the left half; the intro and the one primary
          action bottom-aligned in the right half, so the CTA is above the
          fold. No TrustedStrip: the chart and the index below are the same
          companies, with their numbers. */}
      <section aria-labelledby="yc-hero-heading" className="grid desk:grid-cols-2">
        <div className="flex flex-col p-6 pt-10 desk:border-r-[0.5px] desk:border-hairline desk:pb-12 desk:pt-16">
          <h1
            id="yc-hero-heading"
            className="fade-up max-w-[14ch] text-balance text-[40px] font-medium leading-[1.05] tracking-display text-white [animation-delay:100ms] desk:text-[64px]"
          >
            The design team behind {ycClients.length} YC companies
          </h1>
        </div>
        <div className="flex flex-col gap-6 p-6 pt-0 desk:justify-end desk:pb-12 desk:pt-16">
          <p className="fade-up max-w-[44ch] text-pretty text-[16px] leading-[1.5] text-muted-65 [animation-delay:200ms]">
            From in-batch to Series C, we design brand, website and product
            as one system.{" "}
            <strong className="font-medium text-white">
              Greptile: YC W24 to $25M Series A in 6 months.
            </strong>
          </p>
          <div className={`fade-up ${ctaWidth} [animation-delay:300ms]`}>
            <CtaButtons />
          </div>
        </div>
      </section>

      {/* 01 — Raised: the poster. One number, then the companies behind it
          as plain blocks. */}
      <section aria-labelledby="yc-raised-heading" className={section}>
        <RegMarks start={false} />
        <div className="flex flex-col gap-8 p-6 desk:pb-12">
          <div className="flex items-baseline justify-between gap-6">
            <SectionIndex index={1} label={labels.raised} />
            <p className="hidden font-mono text-[12px] uppercase leading-none tracking-[0.06em] text-white/40 desk:block">
              Fig. 01 — Total raised per company
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
                YC companies we design for
              </strong>
              .
            </p>
          </div>
          <FundingChart entries={ycFunding} />
        </div>
      </section>

      {/* 02 — Featured: Greptile's journey in four cells. The lead sits in
          the heading row's right half, so no row is left half-empty. */}
      <section aria-labelledby="yc-featured-heading" className={section}>
        <RegMarks start={false} />
        <SplitHeader
          heading={ycFeatured.heading}
          headingId="yc-featured-heading"
          eyebrow={<SectionIndex index={2} label={labels.featured} />}
          aside={
            <>
              <p className={lead}>
                <Emphasis text={ycFeatured.lead} format={noBreakHyphens} />
              </p>
              <Link href={ycFeatured.link.href} className={textLink}>
                {ycFeatured.link.label}
              </Link>
            </>
          }
        />
        <div className="border-t-[0.5px] border-hairline p-6">
          <ProjectCard project={ycFeaturedWork} index={0} />
        </div>
        <Metrics metrics={ycFeatured.metrics} bottomRule={false} />
      </section>

      {/* 03 — Index: the /clients roster with the batch in place of "What
          we did", newest batch first. The label row explains the columns,
          so the heading stands alone, on one line. */}
      <section aria-labelledby="yc-index-heading" className={section}>
        <RegMarks start={false} />
        <SplitHeader
          heading={ycRoster.heading}
          headingId="yc-index-heading"
          eyebrow={<SectionIndex index={3} label={labels.index} />}
          singleLine
        />
        <ClientRoster clients={ycIndex} batches={ycIndexBatches} />
      </section>

      {/* 04 — Work: a two-up grid of tiles split on the centre rule. */}
      <section aria-labelledby="yc-work-heading" className={section}>
        <RegMarks start={false} />
        <SplitHeader
          heading={ycMoreWorkSection.heading}
          headingId="yc-work-heading"
          eyebrow={<SectionIndex index={4} label={labels.work} />}
        />
        <div className="grid desk:grid-cols-2">
          {ycMoreWork.map((project, index) => (
            <div
              key={project.slug}
              className={`border-t-[0.5px] border-hairline p-6 ${
                index % 2 === 0 ? "desk:border-r-[0.5px]" : ""
              }`}
            >
              <ProjectCard project={project} index={index + 1} compact />
            </div>
          ))}
        </div>
      </section>

      {/* 05 — Why: the heading row (right half empty), What you get in the
          right half under it. */}
      <section aria-labelledby="yc-why-heading" className={section}>
        <RegMarks start={false} />
        <SplitHeader
          heading={ycWhy.heading}
          headingId="yc-why-heading"
          eyebrow={<SectionIndex index={5} label={labels.why} />}
        >
          <h3 className="font-mono text-[12px] uppercase leading-none tracking-[0.06em] text-white/40">
            {ycWhy.deliverablesLabel}
          </h3>
          {/* CaseSection's shipped-work list. */}
          <ul className="flex list-none flex-col gap-2 text-[16px] leading-[1.35] text-white">
            {ycWhy.deliverables.map((item, index) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="text-white/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SplitHeader>
      </section>

      {/* 06 — Process: each step's weeks on one track, so the rows read as a
          Gantt chart. */}
      <ProcessSection
        edge="inset"
        content={ycProcess}
        marks
        eyebrow={<SectionIndex index={6} label={labels.process} />}
      />

      {/* 07 — FAQ, on the same two-column grid. Its bottom rule opens the
          closing section. */}
      <BlogFaq
        items={ycFaq}
        grid
        edge="inset"
        marks
        eyebrow={<SectionIndex index={7} label={labels.faq} />}
      />

      {/* Closing: with no sticky sidebar, the CTA comes back at the end, at
          every width, beside the YC founders' quotes. Heading row with its
          right half empty, then the quote and the buttons in the right half
          under it, like 05. A bottom rule closes the centre rule, since the
          Footer sits apart. */}
      <section
        aria-labelledby="yc-closing-heading"
        className="relative border-b-[0.5px] border-hairline"
      >
        <RegMarks start={false} />
        <SplitHeader heading={ycClosing.heading} headingId="yc-closing-heading">
          <p className={lead}>{ycClosing.body}</p>
          <div className={`${ctaWidth} flex flex-col gap-5`}>
            <TestimonialSlider testimonials={ycTestimonials} />
            <CtaButtons />
          </div>
        </SplitHeader>
      </section>

      <div className="mt-12">
        <Footer />
      </div>
    </main>
  );
}
