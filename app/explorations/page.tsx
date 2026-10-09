import type { Metadata } from "next";
import { ExplorationGallery } from "@/components/explorations/ExplorationGallery";
import { explorationBlocks, flattenExplorationBlocks } from "@/lib/explorations";
import { readPublicImageDimensions } from "@/lib/imageDimensions";

// Real dimensions are read at build time so every card on the canvas is sized
// to its true aspect ratio. Falls back to the old 1008x584 card ratio if a
// header can't be read.
const explorationImages = flattenExplorationBlocks(explorationBlocks).map((src) => ({
  src,
  ...(readPublicImageDimensions(src) ?? { width: 1008, height: 584 }),
}));

export const metadata: Metadata = {
  title: "Explorations - PIXELUP LABS",
  description:
    "Explorations from PIXELUP LABS — brands, websites and products that command enterprise trust.",
  alternates: { canonical: "/explorations" },
};

export default function ExplorationsPage() {
  return (
    // Full-bleed canvas filling the viewport under the sticky h-16 Navbar.
    // Wheel and drag pan the canvas, so the page itself never scrolls.
    <main className="relative h-[calc(100svh-4rem)] overflow-hidden">
      <h1 className="sr-only">Concepts We Killed — explorations from PIXELUP LABS</h1>
      <ExplorationGallery images={explorationImages} />
    </main>
  );
}
