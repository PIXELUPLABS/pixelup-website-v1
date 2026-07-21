import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ExplorationGallery } from "@/components/explorations/ExplorationGallery";
import { LeftNav } from "@/components/LeftNav";
import { explorationBlocks } from "@/lib/explorations";

// Scoped to this page's heading only — the rest of the site keeps font-display.
const geist = Geist({ subsets: ["latin"], weight: ["500", "600"] });

export const metadata: Metadata = {
  title: "Explorations - PIXELUP LABS",
  description:
    "Explorations from PixelUp Labs — brands, websites and products that command enterprise trust.",
  alternates: { canonical: "/explorations" },
};

export default function ExplorationsPage() {
  return (
    <div className="relative flex flex-col gap-8 p-5 desk:flex-row desk:items-start desk:gap-0">
      <LeftNav
        sticky
        heading="Concepts we Killed"
        subheading="Gallery of ideas that lost the pitch but still deserves a look. See how we think when no one's watching the final cut."
        headingSize="desk:text-[56px]"
        headingFontClassName={geist.className}
      />
      {/* Divider between the nav and content columns, same treatment as the homepage. */}
      <div
        aria-hidden="true"
        className="hidden desk:mx-4 desk:-my-5 desk:block desk:self-stretch desk:border-l-[0.5px] desk:border-hairline"
      />
      {/* Same card frame + gap-6 (24px) stack as the homepage's ProjectCard list. */}
      <main className="flex min-w-0 flex-1 flex-col gap-2">
        <ExplorationGallery blocks={explorationBlocks} />
      </main>
    </div>
  );
}
