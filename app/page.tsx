import { AuditForm } from "@/components/AuditForm";
import { BlogFaq } from "@/components/blog/BlogFaq";
import { Footer } from "@/components/Footer";
import { LeftNav } from "@/components/LeftNav";
import { Showcase } from "@/components/Showcase";
import { links } from "@/lib/projects";

// Structured data for search engines: the agency (Organization) and the site
// itself (WebSite), cross-referenced by @id per Google's guidelines.
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.pixeluplabs.com/#organization",
      name: "PixelUp Labs",
      url: "https://www.pixeluplabs.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://www.pixeluplabs.com/media/nav-logo.svg",
      },
      description:
        "We build brands, websites and products that command enterprise trust.",
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
          <BlogFaq />
          <AuditForm />
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
