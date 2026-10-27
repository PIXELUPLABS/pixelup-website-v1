import type { Metadata } from "next";
import { CtaButtons } from "@/components/CtaButtons";
import {
  FaqPanel,
  FaqTabList,
  FaqTabsProvider,
} from "@/components/faq/FaqTabs";
import { Footer } from "@/components/Footer";
import { faqCategories, faqPageSchema } from "@/lib/faq";
import { withOpenGraph } from "@/lib/open-graph";
import { siteUpdated } from "@/lib/site-dates";

const description =
  "Straight answers about working with PIXELUP LABS: prices, what's included, timelines, process, who it's for and who it isn't.";

const metadata: Metadata = {
  title: "FAQ - PIXELUP LABS",
  description,
  alternates: { canonical: "/faq" },
};

export const generateMetadata = withOpenGraph(metadata, "/faq");

const updatedLabel = new Date(
  `${siteUpdated.faq}T00:00:00Z`,
).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * /faq: the questions, with the site's CTA buttons in the side column, then the Footer. Same 45/55 split as the
 * shared FAQ block (BlogFaq): title, topic tabs and CTAs on the left, sticky
 * on desktop; the active topic's accordion on the right. Content and the
 * FAQPage JSON-LD both come from lib/faq.ts.
 */
export default function FaqPage() {
  return (
    <FaqTabsProvider
      index={faqCategories.map((c) => ({
        id: c.id,
        questions: c.items.map((item) => item.id),
      }))}
    >
      <main className="flex flex-col p-4 desk:p-5">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
        />
        <section className="flex flex-col gap-8 pb-8 desk:flex-row desk:items-start desk:gap-0">
          {/* Sticky side column, like BlogSidebar: title and topics on top, the
              site's CTA buttons pinned to the bottom on desktop. */}
          <div className="flex flex-col gap-6 desk:sticky desk:top-21 desk:h-[calc(100vh-6.5rem)] desk:w-[45%] desk:gap-0 desk:pr-5">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h1 className="fade-up tracking-display text-[24px] font-medium leading-tight text-white [animation-delay:100ms] desk:text-[40px]">
                  Frequently asked questions
                </h1>
                <p className="fade-up text-[12px] text-label-grey [animation-delay:200ms]">
                  Updated {updatedLabel}
                </p>
              </div>
              <div className="fade-up max-w-[405px] [animation-delay:300ms]">
                <FaqTabList
                  tabs={faqCategories.map((c) => ({ id: c.id, label: c.label }))}
                />
              </div>
            </div>
            <div className="fade-up hidden max-w-[405px] [animation-delay:400ms] desk:mt-auto desk:block">
              <CtaButtons />
            </div>
          </div>
          <div className="min-w-0 desk:w-[55%] desk:pl-5">
            {faqCategories.map((category) => (
              <FaqPanel key={category.id} category={category} />
            ))}
            {/* On mobile the side column sits above the questions, so its CTAs move here. */}
            <div className="pt-8 desk:hidden">
              <CtaButtons />
            </div>
          </div>
        </section>
        {/* Cancels main's padding so the Footer spans the page, as on /case-studies. */}
        <div className="-mx-4 -mb-4 desk:-mx-5 desk:-mb-5">
          <Footer />
        </div>
      </main>
    </FaqTabsProvider>
  );
}
