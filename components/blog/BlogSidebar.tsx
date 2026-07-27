import { Geist } from "next/font/google";
import { BackButton } from "../BackButton";
import { CtaButtons } from "../CtaButtons";
import { TrustedStrip } from "../TrustedStrip";
import { ArticleFilters } from "./ArticleFilters";

// Scoped to the "Articles" heading only — the rest of the site keeps font-display.
const geist = Geist({ subsets: ["latin"], weight: ["500"] });

/**
 * Blog's left aside: back button + title/subheading + category filters, with
 * the site's trusted-strip + CTA buttons pinned to the bottom. Same width and
 * sticky treatment as LeftNav — sticky lives on the aside itself (not a
 * nested wrapper, that's CaseSidebar's pattern) because this page's row uses
 * `desk:items-start` like the homepage/`/explorations`, not `CaseStudyPage`'s
 * stretch row. Sticky-on-a-nested-div inside an items-start row never gets a
 * tall enough containing block to stay pinned — it was scrolling with main.
 */
export function BlogSidebar() {
  return (
    <aside className="flex flex-col gap-8 desk:sticky desk:top-21 desk:h-[calc(100vh-6.5rem)] desk:w-[26%] desk:min-w-[340px] desk:max-w-[460px] desk:gap-0 desk:self-start">
      <div className="flex flex-col gap-6">
        <BackButton label="Back to home" icon="arrow" />
        <div className="flex flex-col gap-4">
          <h1 className={`${geist.className} tracking-display text-[24px] font-medium leading-[1.1] text-white desk:text-[54px]`}>
            Articles
          </h1>
          <p className="max-w-[40ch] text-[16px] leading-[1.2] tracking-[-0.02em] text-muted-65">
            Sub Heading of Articles will be added here
          </p>
        </div>
        <ArticleFilters />
      </div>
      <div className="flex flex-col gap-5 desk:mt-auto">
        <TrustedStrip />
        <CtaButtons />
      </div>
    </aside>
  );
}
