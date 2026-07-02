import { LeftNav } from "@/components/LeftNav";
import { Showcase } from "@/components/Showcase";

export default function Home() {
  return (
    // Mobile: single column, page scrolls.
    // Desktop (≥1200px): fixed-height flex row — static left nav + internally
    // scrolling right showcase. See pixeluplabs-design-spec.md §2.
    <div className="relative flex flex-col gap-8 p-5 desk:h-screen desk:flex-row desk:gap-8 desk:overflow-hidden">
      <LeftNav />
      <Showcase />
    </div>
  );
}
