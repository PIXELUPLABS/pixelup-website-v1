import type { Metadata } from "next";
import Image from "next/image";
import { ArticleFilters } from "@/components/blog/ArticleFilters";
import { CaseFaq } from "@/components/case-study/CaseFaq";
import { blogPosts } from "@/lib/blog";
import { pixelupFaq, pixelupFaqSchema } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Blog - PIXELUP LABS",
  description:
    "Insights on brand, product and website design from the PixelUp Labs team.",
  alternates: { canonical: "/blog" },
};

// Placeholder route: Navbar comes from the root layout. Article list lands later.
export default function BlogPage() {
  return (
    <main className="px-6 pt-4 desk:pt-6">
      <div className="flex flex-col gap-5">
        <h1 className="text-[36px] font-medium leading-none text-white desk:h-[70px] desk:py-[3px] desk:text-[64px]">
          Articles
        </h1>
        <ArticleFilters />
      </div>

      {/* Article list: full width, height grows with content (none set for
          now). mt-4/desk:mt-6 separates it from the filters above (mobile
          total incl. py-8 + first box's own py-4 top = 64px; desktop
          unchanged at 72px); py-8 (32px) gives the list its own top/bottom
          breathing room. */}
      <section className="mt-4 w-full py-8 desk:mt-6">
        <div className="flex w-full flex-col divide-y divide-hairline">
          {/* One box per post — count is driven by blogPosts.length, not hardcoded.
              Spacing lives on each wrapper (py-4 = 16px top + 16px bottom = 32px
              total on mobile; desk:py-1.5 = 12px total on desktop) rather than a
              flex `gap`, so the divider above sits centered in that space instead
              of flush against one box's edge. */}
          {blogPosts.map((post) => (
            <div key={post.slug} className="py-4 desk:py-1.5">
              {/* Mobile: stacked column (tag, then title, then image), auto
                  height. Desktop (desk:): the original 240px row with the
                  76.29% / 23.71% split — every desktop class below is
                  unchanged from before, just gated behind `desk:`. */}
              <div className="flex flex-col gap-6 desk:h-[240px] desk:flex-row desk:gap-0">
                {/* Same 1068/1400 ≈ 76.29% / 23.71% split as the filters/display row. */}
                <div className="flex flex-col gap-2 desk:h-full desk:w-[76.29%] desk:flex-row desk:border-r desk:border-hairline">
                  {/* Category tag: dot + label, vertically centered, flush left. */}
                  <div className="flex h-[35px] w-[94px] items-center gap-2">
                    <span className="h-[6.54px] w-[6.54px] shrink-0 bg-[#0658FC]" />
                    <span className="text-[12px] font-medium uppercase text-label-grey">
                      Design
                    </span>
                  </div>
                  {/* Title: below the tag on mobile; fills the remaining
                      height/width to the right of the tag on desktop. */}
                  <div className="w-full desk:h-full desk:flex-1">
                    <p className="text-[36px] font-medium leading-tight text-white capitalize desk:text-[40px]">
                      What makes a website
                      <br />
                      project run smoothly
                    </p>
                  </div>
                </div>
                {/* Image: below the title on mobile (own fixed height);
                    right column on desktop (fixed 23.71% width, full height). */}
                <div className="relative h-[240px] w-full desk:h-full desk:w-[23.71%]">
                  <Image
                    src="/media/Link.png"
                    alt=""
                    fill
                    sizes="(min-width: 1200px) 24vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div aria-hidden="true" className="w-full border-t border-hairline" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pixelupFaqSchema) }}
      />
      {/* Same FAQ as the case study pages, but full width here — no
          SectionShell, since that splits heading/content into two halves
          to match the case study sidebar layout, which this page doesn't have. */}
      <section className="w-full">
        <div className="px-2 pt-8">
          {/* Line break is intentional here only — the case study pages keep
              faqHeading as a single string via SectionShell, unchanged.
              Mobile: 48px, one word per line. Desktop: unchanged 48px,
              "Frequently Answered" / "Question" — the extra break between
              "Frequently" and "Answered" is desk:hidden so it only splits
              on mobile. */}
          <h2 className="tracking-display text-balance text-[48px] font-medium leading-none text-white desk:text-[48px]">
            Frequently
            <br className="desk:hidden" /> Answered
            <br />
            Question
            {/* Same dot used as the category tag marker in the blog boxes above. */}
            <span className="ml-1 inline-block h-[6.54px] w-[6.54px] shrink-0 bg-[#0658FC] align-baseline" />
          </h2>
        </div>
        {/* pt-8 (32px) is the exact gap from the heading above — the heading's
            own wrapper has no bottom padding, so this is the only spacing. */}
        <div className="w-full px-2 pb-6 pt-8">
          <CaseFaq items={pixelupFaq} />
        </div>
      </section>
    </main>
  );
}
