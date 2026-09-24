import { BlogFaq } from "@/components/blog/BlogFaq";
import { Footer } from "@/components/Footer";
import { LeftNav } from "@/components/LeftNav";
import { Showcase } from "@/components/Showcase";
import { links } from "@/lib/projects";
import { sitePublished, siteUpdated } from "@/lib/site-dates";

// The canonical entity paragraph (proof-bank.md in the article workspace),
// used verbatim everywhere PIXELUP LABS is described: this page's visible
// About section and the Organization JSON-LD below. Keep them one string so
// search and answer engines never see two descriptions of the company.
const entityDescription =
  "PIXELUP LABS is the enterprise-readiness design partner for funded B2B startups, most of them AI-native. We rebuild brand, website, and product design around the opinion a founder holds about their market, so enterprise buyers stop hesitating before they ever book the demo. We've run this play for Greptile, Sully, Reducto, Bland, and a dozen other AI-native teams, in weeks not quarters, and we leave behind the design system so it doesn't decay when we're gone.";

// Structured data for search engines: the agency (Organization), the site
// itself (WebSite), and this page (WebPage), cross-referenced by @id per
// Google's guidelines.
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.pixeluplabs.com/#organization",
      name: "PIXELUP LABS",
      url: "https://www.pixeluplabs.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://www.pixeluplabs.com/media/nav-logo.svg",
      },
      description: entityDescription,
      sameAs: ["https://x.com/dakshpixelup", links.telegram],
      knowsAbout: [
        "Brand Identity",
        "Website Design",
        "Product Design",
        "Design Systems",
        "Motion Design",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.pixeluplabs.com/#website",
      url: "https://www.pixeluplabs.com/",
      name: "PIXELUP LABS",
      publisher: { "@id": "https://www.pixeluplabs.com/#organization" },
    },
    {
      // The homepage itself. Its reason for existing is `dateModified`:
      // without a date signal in JSON-LD, meta tags, or sitemap <lastmod>,
      // crawlers and AI answer engines can't tell the page is current and
      // discount it as undated. Bump siteUpdated.home in lib/site-dates.ts
      // whenever the homepage content changes.
      "@type": "WebPage",
      "@id": "https://www.pixeluplabs.com/#webpage",
      url: "https://www.pixeluplabs.com/",
      name: "PIXELUP LABS - Premium Brands and Websites",
      description:
        "We build brands, websites and products that command enterprise trust.",
      isPartOf: { "@id": "https://www.pixeluplabs.com/#website" },
      about: { "@id": "https://www.pixeluplabs.com/#organization" },
      datePublished: sitePublished,
      dateModified: siteUpdated.home,
    },
  ],
};

export default function Home() {
  return (
    <div className="relative">
      {/* Mobile: single column, page scrolls.
          Desktop (≥1200px): left nav pinned to the viewport while the showcase
          scrolls the page underneath it — once the last card passes, the nav
          unpins and the footer follows. See pixeluplabs-design-spec.md §2. */}
      <div className="relative flex flex-col gap-8 p-4 desk:flex-row desk:items-start desk:gap-0 desk:p-5">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <LeftNav sticky />
        <div
          aria-hidden="true"
          className="hidden desk:mx-4 desk:-my-5 desk:block desk:self-stretch desk:border-l-[0.5px] desk:border-hairline"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <Showcase scroll="page" />
          {/* Who we are, between the work and the FAQ. Same 45/55 split,
              desk:pl-5 offset and top hairline as BlogFaq, so the paragraph
              lines up with the FAQ accordion's text column below it. */}
          <section className="w-full border-t-[0.5px] border-hairline py-8">
            <div className="flex w-full flex-col gap-6 desk:flex-row desk:gap-0">
              <div className="w-full desk:w-[45%] desk:pr-5">
                <h2 className="tracking-display text-[24px] font-medium leading-tight text-white desk:text-[40px]">
                  About PIXELUP LABS
                </h2>
              </div>
              <div className="w-full desk:w-[55%] desk:pl-5">
                <p className="text-[16px] leading-[1.5] text-muted-65">
                  {entityDescription}
                </p>
              </div>
            </div>
          </section>
          <BlogFaq />
          {/* Same treatment as /blog's Footer wrapper — cancels the row's
              p-5 on this wrapper only, so Footer fills the extra space via
              its own w-full without needing any change to Footer itself. */}
          <div className="-mx-4 -mb-4 desk:-mr-5 desk:-mb-5 desk:-ml-4">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
