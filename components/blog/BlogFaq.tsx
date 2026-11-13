import Image from "next/image";
import faqBg from "@/public/media/faq-bg.png";
import { CaseFaq } from "@/components/case-study/CaseFaq";
import {
  bleedMargin,
  contentPadding,
  labelPadding,
} from "@/components/SectionRows";
import { faqHeading, pixelupFaq, type FaqItem } from "@/lib/case-studies";

/** Standalone, full-width FAQ block for /blog and the homepage, on both
    sitting directly above AuditForm — same shared pixelupFaq
    content and CaseFaq accordion as the case study pages. Heading in the
    left 45%, accordion in the right 55% (not SectionShell — that hardcodes
    case-study-sidebar-specific padding, see DESIGN.md §14). Matches
    BlogList's 45/55 split and desk:pl-5 offset so the accordion's text
    lines up with BlogList's title/date column above it, instead of sitting
    at the different x-position a 50/50 split would put it at. Top hairline
    + breathing room matches the site's other full-width sections (Footer,
    AuditForm). */
export function BlogFaq({
  bleed = false,
  items = pixelupFaq,
  grid = false,
}: {
  /** A page's own questions (/yc). The page then emits the matching
      FAQPage JSON-LD itself instead of pixelupFaqSchema. */
  items?: FaqItem[];
  /** Homepage, directly under ProcessSection: the top hairline runs from the
      LeftNav divider to the viewport edge and closes ProcessSection's centre
      rule. The padding puts the content back where it was. */
  bleed?: boolean;
  /** /yc: the FAQ sits on SectionRows' two-column grid instead of the 45/55
      split, on the "bleed" edge. The heading takes the left cell at the
      page's H2 size, the centre rule carries on from the section above, and
      the accordion starts where every other row's content does. A bottom
      rule closes the centre rule, since the Footer card sits apart. */
  grid?: boolean;
}) {
  if (grid) {
    return (
      <section
        className={`border-y-[0.5px] border-hairline ${bleedMargin}`}
        aria-labelledby="faq-heading"
      >
        <div className="grid desk:grid-cols-2">
          <div
            className={`relative overflow-hidden ${labelPadding.bleed} desk:border-r-[0.5px] desk:border-hairline`}
          >
            <Image
              src={faqBg}
              alt=""
              fill
              sizes="(min-width: 1200px) 50vw, 100vw"
              className="scale-110 object-cover -translate-x-20 -translate-y-12"
            />
            <h2
              id="faq-heading"
              className="relative text-balance text-[24px] font-medium leading-tight tracking-display text-white desk:text-[48px]"
            >
              {faqHeading}
            </h2>
          </div>
          <div className={`${contentPadding.bleed} pt-0 desk:pt-6`}>
            <CaseFaq items={items} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`border-t-[0.5px] border-hairline py-8 ${bleed ? `${bleedMargin} desk:pl-4 desk:pr-5` : "w-full"}`}
    >
      <div className="flex w-full flex-col gap-6 desk:flex-row desk:gap-0">
        <div className="relative w-full overflow-hidden desk:w-[45%] desk:pr-5">
          <Image
            src={faqBg}
            alt=""
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
