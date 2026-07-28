import Image from "next/image";
import faqBg from "@/public/media/faq-bg.png";
import { CaseFaq } from "@/components/case-study/CaseFaq";
import { faqHeading, pixelupFaq } from "@/lib/case-studies";

/** Standalone, full-width FAQ block for /blog — same shared pixelupFaq
    content and CaseFaq accordion as the case study pages. Heading in the
    left half, accordion in the right half, split with a hairline (not
    SectionShell — that hardcodes case-study-sidebar-specific padding, see
    DESIGN.md §14). Top hairline + breathing room matches the site's other
    full-width sections (Footer, AuditForm). */
export function BlogFaq() {
  return (
    <section className="w-full border-t-[0.5px] border-hairline py-8">
      <div className="flex w-full flex-col gap-6 desk:flex-row desk:gap-0">
        <div className="relative w-full overflow-hidden desk:w-1/2 desk:pr-8">
          <Image
            src={faqBg}
            alt=""
            fill
            sizes="(min-width: 1200px) 50vw, 100vw"
            className="scale-110 object-cover -translate-x-20 -translate-y-12"
          />
          <h2 className="relative tracking-display text-[24px] font-medium leading-tight text-white desk:text-[40px]">
            {faqHeading}
            <span aria-hidden="true" className="ml-2 inline-block h-2 w-2 shrink-0 bg-[#0658FC] align-baseline" />
          </h2>
        </div>
        <div className="w-full desk:w-1/2 desk:pl-8">
          <CaseFaq items={pixelupFaq} />
        </div>
      </div>
    </section>
  );
}
