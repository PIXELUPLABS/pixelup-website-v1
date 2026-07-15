import { projects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

export function Showcase({ scroll = "internal" }: { scroll?: "internal" | "page" }) {
  return (
    // Vertical stack (not a grid), 24px gap between cards.
    // "internal": column scrolls on its own, nav column stays put (fixed-height shells).
    // "page": no internal scroll — content sizes naturally so the page scrolls
    // past it (e.g. the homepage, to reveal the footer after the last card).
    <section
      aria-label="Selected work"
      className={`flex flex-col gap-6 desk:flex-1 ${
        scroll === "internal" ? "no-scrollbar desk:h-full desk:overflow-y-auto" : ""
      }`}
    >
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} index={index} />
      ))}
    </section>
  );
}
