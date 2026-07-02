import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

function CardMedia({ project }: { project: Project }) {
  if (project.media.type === "video") {
    return (
      <video
        className="h-full w-full object-cover"
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
      sizes="(min-width: 1200px) 70vw, 100vw"
      className="object-cover"
    />
  );
}

export function ProjectCard({ project }: { project: Project }) {
  // ~1008 x 584 on the live site → aspect ratio ≈ 1.73:1. Square corners, clipped.
  const inner = (
    <div className="relative aspect-[1008/584] w-full overflow-hidden bg-white/[0.03]">
      <CardMedia project={project} />
    </div>
  );

  if (project.external) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={project.label}
        className="block"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={project.href} aria-label={project.label} className="block">
      {inner}
    </Link>
  );
}
