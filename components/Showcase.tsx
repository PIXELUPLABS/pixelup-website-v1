import { projects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

export function Showcase({ scroll = "internal" }: { scroll?: "internal" | "page" }) {
  return (
    // Vertical stack (not a grid). 32px gap on mobile, 24px on desktop.
    //
    // Mobile is the larger of the two on purpose. Each card's own media-to-info
    // gap is 12px, so at the old 16px the info row sat almost exactly as close
    // to the next card's media as to its own — nothing read as a group and the
    // column looked like one undifferentiated stack of images and text. 32px
    // against that 12px makes the card boundary unambiguous. Desktop needs less
    // because the info there is a single space-between row rather than three
    // stacked lines, so it reads as attached to the media above it already.
    // "internal": column scrolls on its own, nav column stays put (fixed-height shells).
    // "page": no internal scroll — content sizes naturally so the page scrolls
    // past it (e.g. the homepage, to reveal the footer after the last card).
    // `main` — this is the page's primary content region (only usage today
    // is the homepage's project listing), not a generic section.
    <main
      aria-label="Selected work"
      className={`flex flex-col gap-8 desk:flex-1 desk:gap-6 ${
        scroll === "internal" ? "no-scrollbar desk:h-full desk:overflow-y-auto" : ""
      }`}
    >
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} index={index} />
      ))}
    </main>
  );
}
