import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Image from "next/image";
import { ViewToggle } from "@/components/explorations/ViewToggle";
import { LeftNav } from "@/components/LeftNav";

// Scoped to this page's heading only — the rest of the site keeps font-display.
const geist = Geist({ subsets: ["latin"], weight: ["500", "600"] });

export const metadata: Metadata = {
  title: "Explorations - PIXELUP LABS",
  description:
    "Explorations from PixelUp Labs — brands, websites and products that command enterprise trust.",
  alternates: { canonical: "/explorations" },
};

// Ordered top-to-bottom exactly as they should render — "full" is one
// full-width image, "pair" is two images side by side (50/50 on desktop).
type ExplorationBlock = { kind: "full"; src: string } | { kind: "pair"; srcs: [string, string] };

const explorationBlocks: ExplorationBlock[] = [
  { kind: "full", src: "/media/explorations/img-1.png" },
  { kind: "full", src: "/media/explorations/img-2.png" },
  { kind: "pair", srcs: ["/media/explorations/img-3.png", "/media/explorations/img-4.png"] },
  { kind: "full", src: "/media/explorations/img-5.png" },
  { kind: "pair", srcs: ["/media/explorations/img-6.png", "/media/explorations/img-7.png"] },
  { kind: "full", src: "/media/explorations/img-8.png" },
];

const cardFrame = "relative aspect-[1008/584] w-full overflow-hidden bg-white/[0.03]";

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
        <ViewToggle />
        {explorationBlocks.map((block, index) =>
          block.kind === "full" ? (
            <div key={block.src} className={cardFrame}>
              <Image
                src={block.src}
                alt=""
                fill
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
                sizes="(min-width: 1200px) 70vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div key={block.srcs.join("-")} className="flex flex-col gap-2 desk:flex-row">
              {block.srcs.map((src) => (
                <div key={src} className={`${cardFrame} min-w-0 desk:flex-1`}>
                  <Image
                    src={src}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="(min-width: 1200px) 35vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
