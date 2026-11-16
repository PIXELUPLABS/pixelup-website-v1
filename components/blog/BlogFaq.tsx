import Image from "next/image";
import faqBg from "@/public/media/faq-bg.png";
import { CaseFaq } from "@/components/case-study/CaseFaq";
import {
  bleedMargin,
  RegMarks,
  SplitHeader,
  type SectionEdge,
} from "@/components/SectionRows";
import { faqHeading, pixelupFaq, type FaqItem } from "@/lib/case-studies";

/** Standalone, full-width FAQ block for /blog and the homepage, on both
    sitting directly above the Footer — same shared pixelupFaq
    content and CaseFaq accordion as the case study pages. Heading in the
    left 45%, accordion in the right 55% (not SectionShell — that hardcodes
    case-study-sidebar-specific padding, see DESIGN.md §14). Matches
    BlogList's 45/55 split and desk:pl-5 offset so the accordion's text
    lines up with BlogList's title/date column above it, instead of sitting
    at the different x-position a 50/50 split would put it at. Top hairline
    + breathing room matches the site's other full-width sections (Footer). */
export function BlogFaq({
  items = pixelupFaq,
  grid = false,
  edge = "bleed",
  eyebrow,
  marks = false,
}: {
  /** grid only: "bleed" in a LeftNav-shell column, "inset" on a full-width
      page (/yc). */
  edge?: SectionEdge;
  /** grid only: SectionIndex label above the heading (/yc). */
  eyebrow?: React.ReactNode;
  /** grid only: RegMarks on the top rule (/yc). */
  marks?: boolean;
  /** A page's own questions (/yc). The page then emits the matching
      FAQPage JSON-LD itself instead of pixelupFaqSchema. */
  items?: FaqItem[];
  /** /yc: SplitHeader's layout on `edge`, like every section above it:
      the heading row (heading left, right half empty), a full-width rule,
      then the accordion in the right half. A bottom rule closes the centre
      rule; on /yc it also opens the closing section. */
  grid?: boolean;
}) {
  if (grid) {
    // Every other /yc section's pattern: SplitHeader's heading row (heading
    // left, right half empty), a full-width rule, then the accordion in the
    // right half under it. No faq-bg texture: no other section has one.
    return (
      <section
        className={`relative border-y-[0.5px] border-hairline ${edge === "bleed" ? bleedMargin : ""}`}
        aria-labelledby="faq-heading"
      >
        {marks && <RegMarks start={edge === "bleed"} />}
        <SplitHeader
          heading={faqHeading}
          headingId="faq-heading"
          edge={edge}
          eyebrow={eyebrow}
        >
          <CaseFaq items={items} />
        </SplitHeader>
      </section>
    );
  }

  return (
    <section className="w-full border-t-[0.5px] border-hairline py-8">
      <div className="flex w-full flex-col gap-6 desk:flex-row desk:gap-0">
        <div className="relative w-full overflow-hidden desk:w-[45%] desk:pr-5">
          {/* Decorative, so aria-hidden; still a real alt because Bing's
              site scan reports alt="" as missing. */}
          <Image
            src={faqBg}
            alt="Background pattern"
            aria-hidden="true"
            fill
            sizes="(min-width: 1200px) 45vw, 100vw"
            className="scale-110 object-cover -translate-x-20 -translate-y-12"
          />
          <h2 className="relative tracking-display text-[24px] font-medium leading-tight text-white desk:text-[40px]">
            {faqHeading}
          </h2>
        </div>
        <div className="w-full desk:w-[55%] desk:pl-5">
          <CaseFaq items={items} />
        </div>
      </div>
    </section>
  );
}
