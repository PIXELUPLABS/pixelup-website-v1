import Image from "next/image";
import Link from "next/link";
import type { MoreProjectRef } from "@/lib/case-studies";
import { projects, type Project } from "@/lib/projects";

// Same hover as the homepage ProjectCard: media scales up smoothly, clipped by the frame.
const mediaHover =
  "transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.05]";

function CardMedia({ project }: { project: Project }) {
  if (project.media.type === "video") {
    return (
      <video
        className={`h-full w-full object-cover ${mediaHover}`}
        src={project.media.src}
        poster={project.media.poster}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }
  return (
    <Image
      src={project.media.src}
      alt={`${project.label} — project by PixelUp Labs`}
      fill
      sizes="(min-width: 1200px) 26vw, 100vw"
      className={`object-cover ${mediaHover}`}
    />
  );
}

function ProjectCardSmall({
  project,
  tags,
}: {
  project: Project;
  tags: string;
}) {
  const inner = (
    <>
      <div className="relative aspect-square w-full overflow-hidden bg-white/[0.03]">
        <CardMedia project={project} />
        {project.overlayLogo && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <img src={project.overlayLogo} alt="" aria-hidden="true" className="w-[30%]" />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <p className="truncate text-[20px] font-medium leading-[1.3] tracking-[-0.02em] text-white">
          {project.label}
        </p>
        <p className="text-[12px] leading-[1.3] tracking-[-0.02em] text-white/60">
          {tags}
        </p>
      </div>
    </>
  );

  const className = "group flex min-w-0 flex-1 flex-col gap-4 desk:gap-6";

  if (project.external) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={project.label}
        className={className}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={project.href} aria-label={project.label} className={className}>
      {inner}
    </Link>
  );
}

/** "More projects" grid at the end of a case study. */
export function MoreProjects({ refs }: { refs: MoreProjectRef[] }) {
  const cards = refs.flatMap((ref) => {
    const project = projects.find((p) => p.slug === ref.slug);
    return project ? [{ project, tags: ref.tags }] : [];
  });

  return (
    <section className="flex w-full flex-col gap-8 border-t-[0.5px] border-hairline p-6 desk:gap-12">
      <h2 className="tracking-display max-w-[536px] text-[24px] font-medium leading-none text-white desk:text-[48px]">
        More Projects
      </h2>
      <div className="grid gap-8 desk:grid-cols-2 desk:gap-6">
        {cards.map(({ project, tags }) => (
          <ProjectCardSmall key={project.slug} project={project} tags={tags} />
        ))}
      </div>
    </section>
  );
}
