import type { Metadata } from "next";
import Link from "next/link";
import { BlogFaq } from "@/components/blog/BlogFaq";
import { Metrics } from "@/components/case-study/CaseStudyStory";
import { Emphasis } from "@/components/case-study/Emphasis";
import { ClientRoster } from "@/components/clients/ClientRoster";
import { Footer } from "@/components/Footer";
import { LeftNav } from "@/components/LeftNav";
import { ProcessSection } from "@/components/ProcessSection";
import { ProjectCard } from "@/components/ProjectCard";
import {
  bleedMargin,
  DetailRow,
  noBreakHyphens,
  SplitHeader,
} from "@/components/SectionRows";
import { siteUpdated } from "@/lib/site-dates";
import {
  ycClients,
  ycFaq,
  ycFeaturedWork,
  ycMetrics,
  ycMoreWork,
  ycMoreWorkSection,
  ycProcess,
  ycRoster,
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

/** Row titles: ProcessSection's step titles, one size under the H2. */
const rowHeading =
  "text-balance text-[20px] font-medium leading-tight tracking-display text-white desk:text-[24px]";

/** The site's text link (BlogPostSidebar, CaseFaq): the accent and filled
    buttons stay with Book a call in the sidebar. */
const textLink =
  "w-fit text-[14px] leading-[1.3] tracking-[-0.01em] text-white underline underline-offset-2 transition-colors hover:text-white/70";

/** Every section's top rule; the next section's rule closes its centre rule. */
const sectionRule = "border-t-[0.5px] border-hairline";

/** bleedMargin (the shell's divider gap and outer padding), padded back. */
const bleedPadding = "desk:pl-4 desk:pr-5";

/**
 * /clients' shell (sticky LeftNav hero, content column on the right), with
 * the homepage's proof order: work first, then the numbers, the roster, the
 * argument, the process and the FAQ. Every section sits on SectionRows'
 * "bleed" edge, like the homepage's process and FAQ: each horizontal rule
 * runs from the LeftNav divider to the viewport edge, and the text keeps the
 * column's edges.
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
        {/* No TrustedStrip: the roster on the right is the same logos with
            their batches, and the founder quotes carry the sidebar's proof. */}
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
        <main className="flex min-w-0 flex-1 flex-col gap-8">
          {/* Featured work: the page's LCP, like the homepage's first card. */}
          <section aria-labelledby="yc-featured-heading">
            <h2 id="yc-featured-heading" className="sr-only">
              Featured YC work
            </h2>
            <ProjectCard project={ycFeaturedWork} index={0} />
          </section>

          {/* No gap: the roster's top rule closes the proof band. */}
          <div className={bleedMargin}>
            <Metrics metrics={ycMetrics} bottomRule={false} edge="bleed" />
            <section aria-labelledby="yc-roster-heading" className={sectionRule}>
              <SplitHeader
                heading={ycRoster.heading}
                headingId="yc-roster-heading"
                edge="bleed"
              >
                <p className={lead}>
                  <Emphasis text={ycRoster.intro} />
                </p>
              </SplitHeader>
              {/* Desk only: below desk the roster has no column labels, so
                  its first row's own rule already closes the header. */}
              <div className="desk:border-t-[0.5px] desk:border-hairline desk:pt-6">
                <ClientRoster clients={ycClients} bleed />
              </div>
            </section>
          </div>

          <section
            aria-labelledby="yc-work-heading"
            className={`${sectionRule} ${bleedMargin}`}
          >
            <SplitHeader
              heading={ycMoreWorkSection.heading}
              headingId="yc-work-heading"
              edge="bleed"
            >
              <p className={lead}>
                <Emphasis text={ycMoreWorkSection.intro} />
              </p>
            </SplitHeader>
            {/* Showcase's stack: 40px between cards on mobile, 32px on desk.
                The rule bleeds; the cards pad back to the column's edges. */}
            <div
              className={`flex flex-col gap-10 ${sectionRule} pt-6 desk:gap-8 ${bleedPadding}`}
            >
              {ycMoreWork.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index + 1}
                />
              ))}
            </div>
          </section>

          {/* No gaps: each section's top rule closes the one above it. */}
          <div>
            <section
              aria-labelledby="yc-why-heading"
              className={`${sectionRule} ${bleedMargin}`}
            >
              <SplitHeader
                heading={ycWhy.heading}
                headingId="yc-why-heading"
                edge="bleed"
              />
              <div
                className={`divide-y-[0.5px] divide-hairline ${sectionRule}`}
              >
                {ycWhy.rows.map((row) => (
                  <DetailRow
                    key={row.label}
                    edge="bleed"
                    label={<h3 className={rowHeading}>{row.label}</h3>}
                  >
                    <p className="text-muted-65">
                      <Emphasis text={row.body} format={noBreakHyphens} />
                    </p>
                    {row.link && (
                      <Link href={row.link.href} className={textLink}>
                        {row.link.label}
                      </Link>
                    )}
                  </DetailRow>
                ))}
                <DetailRow
                  edge="bleed"
                  label={
                    <h3 className={rowHeading}>{ycWhy.deliverablesLabel}</h3>
                  }
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
            <ProcessSection edge="bleed" content={ycProcess} />
            <BlogFaq items={ycFaq} grid />
          </div>

          <div className="-mx-4 -mb-4 desk:-mr-5 desk:-mb-5 desk:-ml-4">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
