import type { Metadata } from "next";
import { CalEmbed } from "@/components/CalEmbed";
import { LeftNav } from "@/components/LeftNav";

export const metadata: Metadata = {
  title: "Book a Call - PIXELUP LABS",
  description:
    "Book a discovery call with PixelUp Labs: brands, websites and products that command enterprise trust.",
  alternates: { canonical: "/call" },
};

export default function CallPage() {
  return (
    // Same shell as the homepage: static left nav + right column. The Cal
    // embed manages its own internal scrolling inside the fixed-height shell.
    <div className="relative flex flex-col gap-8 p-5 desk:h-screen desk:flex-row desk:gap-8 desk:overflow-hidden">
      <LeftNav
        heading="We love working with bold founders who are tired of the ordinary"
        subheading="Brands, Websites and product design that leaves a lasting impression."
        balanceHero
      />
      <section
        aria-label="Book a discovery call"
        className="no-scrollbar min-h-[640px] desk:h-full desk:min-h-0 desk:flex-1 desk:overflow-y-auto"
      >
        <CalEmbed />
      </section>
    </div>
  );
}
