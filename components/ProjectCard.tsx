import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

// Media scales up smoothly on hover, clipped by the card frame.
const mediaHover =
  "transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.05]";

function CardMedia({ project, priority }: { project: Project; priority: boolean }) {
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
      priority={priority}
      sizes="(min-width: 1200px) 70vw, 100vw"
      className={`object-cover ${mediaHover}`}
    />
  );
}

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  /** Position in the showcase — drives the staggered entrance delay. */
  index?: number;
}) {
  // Cards join the entrance sequence after the nav copy (~200ms in), each one
  // a beat later than the last, capped so deep cards don't lag forever.
  const entranceDelay = `${Math.min(200 + index * 120, 800)}ms`;

  // ~1008 x 584 on the live site → aspect ratio ≈ 1.73:1. Square corners, clipped.
  const inner = (
    <div className="relative aspect-[1008/584] w-full overflow-hidden bg-white/[0.03]">
      {/* The first card is the homepage LCP — preload it. */}
      <CardMedia project={project} priority={index === 0} />
      {project.overlayLogo && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <img
            src={project.overlayLogo}
            alt=""
            aria-hidden="true"
            className="w-[18%]"
          />
        </div>
      )}
    </div>
  );

  const cardClass = "fade-up group block";
  const cardStyle = { animationDelay: entranceDelay };

  if (project.external) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={project.label}
        className={cardClass}
        style={cardStyle}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={project.href}
      aria-label={project.label}
      className={cardClass}
      style={cardStyle}
    >
      {inner}
    </Link>
  );
}
