import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
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

/**
 * Info row under the card media (Figma "Frame 2147243671"): client name +
 * one-line descriptor on the left, services + year on the right.
 *
 * Figma spec is a 921 x 50 row — `space-between`, `align-items: flex-end`,
 * 16px gap. Reproduced fluidly rather than at a fixed width, and the 50px
 * height is left intrinsic (24px title at 1.2 + 16px tagline at 1.3 = 49.6px
 * naturally) so a wrapping mobile tagline can't clip.
 *
 * Below `desk` the two groups stack: 921px of horizontal room doesn't exist,
 * so the meta drops under the title and keeps its own space-between, which
 * holds the year against the right edge at every width.
 */
function ProjectInfo({ project }: { project: Project }) {
  const { label, tagline, services, year } = project;
  const hasServices = Boolean(services?.length);

  // Nothing to show until the copy fields are populated — render no empty row.
  if (!tagline && !hasServices && !year) return null;

  return (
    <div className="flex flex-col items-start gap-3 desk:flex-row desk:items-end desk:justify-between desk:gap-4">
      <div className="w-full min-w-0 desk:flex-1">
        <h3 className="text-[20px] font-medium leading-[1.2] tracking-[-0.02em] text-white desk:truncate desk:text-[24px]">
          {label}
        </h3>
        {tagline && (
          <p className="text-[14px] leading-[1.3] tracking-[-0.02em] text-body-grey desk:truncate desk:text-[16px]">
            {tagline}
          </p>
        )}
      </div>
      {(hasServices || year) && (
        <div className="flex w-full items-baseline justify-between gap-4 font-mono text-[12px] font-medium uppercase leading-[1.3] tracking-[0.04em] text-label-grey desk:w-auto desk:shrink-0 desk:justify-end desk:gap-8">
          {/* Wraps below desk — a three-discipline list needs ~307px and a
              375px card only offers 296px, and losing the last discipline to an
              ellipsis is worse than a second line. `items-baseline` aligns the
              year to the first line, so it stays put when this wraps.
              Each discipline (comma included) is its own nowrap span, so the
              only break opportunities are the separators — "Product Design"
              never splits across lines. */}
          {hasServices && (
            <p className="min-w-0 desk:truncate">
              {services!.map((service, i) => (
                <Fragment key={service}>
                  {i > 0 && " "}
                  <span className="whitespace-nowrap">
                    {service}
                    {i < services!.length - 1 && ","}
                  </span>
                </Fragment>
              ))}
            </p>
          )}
          {year && <p className="shrink-0">{year}</p>}
        </div>
      )}
    </div>
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
  //
  // 12px between the media and the info row. That has to stay clearly smaller
  // than the Showcase gap separating one card from the next (32px mobile, 24px
  // desktop) — it's the only thing telling the eye which info belongs to which
  // image. Raising it without raising Showcase's gap makes the column read as
  // one continuous stack again.
  const inner = (
    <div className="flex flex-col gap-3">
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
      <ProjectInfo project={project} />
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
