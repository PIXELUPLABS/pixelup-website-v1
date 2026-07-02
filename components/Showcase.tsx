import { projects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

export function Showcase() {
  return (
    // Vertical stack (not a grid), 24px gap between cards.
    // On desktop this column scrolls internally; the nav column stays put.
    <section
      aria-label="Selected work"
      className="flex flex-col gap-6 desk:h-full desk:flex-1 desk:overflow-y-auto"
    >
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </section>
  );
}
