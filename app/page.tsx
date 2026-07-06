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
      "@id": "https://pixeluplabs.com/#organization",
      name: "PixelUp Labs",
      url: "https://pixeluplabs.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://pixeluplabs.com/media/nav-logo.svg",
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
      "@id": "https://pixeluplabs.com/#website",
      url: "https://pixeluplabs.com/",
      name: "PIXELUP LABS",
      publisher: { "@id": "https://pixeluplabs.com/#organization" },
    },
  ],
};

export default function Home() {
  return (
    // Mobile: single column, page scrolls.
    // Desktop (≥1200px): fixed-height flex row — static left nav + internally
    // scrolling right showcase. See pixeluplabs-design-spec.md §2.
    <div className="relative flex flex-col gap-8 p-5 desk:h-screen desk:flex-row desk:gap-8 desk:overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <LeftNav />
      <Showcase />
    </div>
  );
}
