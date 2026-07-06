import Image from "next/image";
import Link from "next/link";
import type { MoreProjectRef } from "@/lib/case-studies";
import { projects, type Project } from "@/lib/projects";

// Same hover as the homepage ProjectCard: media scales up smoothly, clipped by the frame.
const mediaHover =
  "transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.05]";

function CardMedia({ project }: { project: Project }) {
  // Prefer the dedicated square high-res crop (from the case study title
  // image); it fills the 1:1 frame without the lossy cover-crop of the
  // 16:9 homepage media, and replaces videos with a crisp still.
  if (project.cardImage) {
    return (
      <Image
        src={project.cardImage}
        alt={project.alt}
        fill
        sizes="(min-width: 1200px) 38vw, 100vw"
        className={`object-cover ${mediaHover}`}
      />
    );
  }
  if (project.media.type === "video") {
    return (
      <video
        className={`h-full w-full object-cover ${mediaHover}`}
        src={project.media.src}
        poster={project.media.poster}
        aria-label={project.alt}
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
      alt={project.alt}
      fill
      sizes="(min-width: 1200px) 38vw, 100vw"
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
        {/* Card crops already carry the client's mark; only overlay it on
            homepage media (e.g. the Sainapse video). */}
        {!project.cardImage && project.overlayLogo && (
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
    <section className="w-full border-t-[0.5px] border-hairline">
      <div className="p-6">
        <h2 className="tracking-display max-w-[536px] text-balance text-[24px] font-medium leading-none text-white desk:text-[48px]">
          More Projects
        </h2>
      </div>
      {/* Cards span the full content width, split exactly at the page center
          (the px-6 side padding is symmetric, so 50% of this row = the
          vertical center rule): the first card's right border sits ON the
          rule, the second starts one 24px gutter after it. */}
      <div className="flex flex-col gap-8 px-6 pb-6 desk:flex-row desk:gap-0">
        {cards.map(({ project, tags }, index) => (
          <div
            key={project.slug}
            className={`flex min-w-0 desk:w-1/2 ${index > 0 ? "desk:pl-6" : ""}`}
          >
            <ProjectCardSmall project={project} tags={tags} />
          </div>
        ))}
      </div>
    </section>
  );
}
