import Image from "next/image";
// import bgBottom from "@/public/media/bg-bottom.png"; // TODO: hidden for now, re-enable when ready.
import bgHome from "@/public/media/bg-home.png";
// import { Footer } from "@/components/Footer"; // TODO: footer hidden site-wide for now, re-enable when ready.
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
    // `relative` so the two background layers below anchor to the whole
    // page (hero through footer) instead of just the viewport.
    <div className="relative">
      {/* Top-anchored background: page starts with this image. -top-16
          pulls it up behind the sticky Navbar (h-16), same trick as the
          case study page background; Navbar's z-30 keeps it painting on
          top. Fades out by 85% down (bg-bottom is hidden for now, so this
          fade just needs to clear a hard cut, not hand off to it). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-16 select-none [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]"
      >
        <Image src={bgHome} alt="" priority sizes="100vw" className="h-auto w-full" />
      </div>
      {/* <div> bg-bottom background TODO: hidden for now, re-enable when ready. */}

      {/* Mobile: single column, page scrolls.
          Desktop (≥1200px): left nav pinned to the viewport while the showcase
          scrolls the page underneath it — once the last card passes, the nav
          unpins and the footer follows. See pixeluplabs-design-spec.md §2. */}
      <div className="relative flex flex-col gap-8 p-5 desk:flex-row desk:items-start desk:gap-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <LeftNav sticky />
        {/* Divider between the nav and showcase columns. `self-stretch`
            overrides the row's `items-start` so it spans the row's full
            height (set by Showcase's content) — flush from the navbar at
            the top to the footer at the bottom, not just LeftNav's own
            (shorter, sticky-capped) box. `-my-5` extends it past the row's
            own p-5 padding so it touches the navbar/footer with no gap.
            Horizontal margins replace the row's gap-8, keeping the same
            total spacing either side of the line. */}
        <div
          aria-hidden="true"
          className="hidden desk:mx-4 desk:-my-5 desk:block desk:self-stretch desk:border-l-[0.5px] desk:border-hairline"
        />
        <Showcase scroll="page" />
      </div>
      {/* <Footer /> TODO: hidden site-wide for now, re-enable when ready. */}
    </div>
  );
}
