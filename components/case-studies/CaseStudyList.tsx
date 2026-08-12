"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CaseStudyShowcaseEntry } from "@/lib/case-studies-showcase";
import { projects, type Project } from "@/lib/projects";

// Same hover treatment as the homepage ProjectCard: media scales up smoothly, clipped by the frame.
const mediaHover =
  "transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.05]";

function CardMedia({ project }: { project: Project }) {
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
      sizes="(min-width: 1200px) 45vw, 100vw"
      className={`object-cover ${mediaHover}`}
    />
  );
}

/** Sharp-edged filter pill — same look as blog ArticleFilters' Pill. */
function NichePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`cursor-pointer rounded-none px-3 py-1 font-button text-[12px] font-semibold uppercase tracking-[-0.02em] transition-colors ${
        active
          ? "border border-transparent bg-button-dark text-white"
          : "border border-dashed border-hairline bg-transparent text-white/40 hover:bg-button-dark"
      }`}
    >
      {label}
    </button>
  );
}

/** Small uppercase chip, same treatment as BlogList's category tags. */
function Tag({ label }: { label: string }) {
  return (
    <div className="flex items-end">
      <span className="h-1 w-1.5 shrink-0 bg-highlight" />
      <span className="bg-label-grey/20 px-1 py-px text-[12px] font-medium uppercase text-white">
        {label}
      </span>
    </div>
  );
}

interface ShowcaseRow {
  project: Project;
  entry: CaseStudyShowcaseEntry;
}

function CaseStudyRow({ row, index }: { row: ShowcaseRow; index: number }) {
  const { project, entry } = row;
  const entranceDelay = `${Math.min(200 + index * 120, 800)}ms`;

  const inner = (
    <>
      {/* Three columns (25/38/37, still summing to 100 — see AGENTS.md's
          gap+width trap): media, what-we-did, and a third column reserved
          for more detail later. Media is sized to the real project-image
          aspect ratio (1008/584) instead of a fixed box, so the image shows
          in full rather than being cropped by object-cover to fit a wider
          frame. */}
      <div className="relative aspect-1008/584 w-full overflow-hidden bg-white/[0.03] desk:w-[25%]">
        <CardMedia project={project} />
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
      <div className="flex w-full flex-col justify-between gap-4 pt-4 desk:w-[38%] desk:gap-0 desk:pt-0 desk:pl-5">
        <div className="flex flex-col gap-2">
          <div className="flex h-8.75 flex-wrap items-end gap-2">
            <Tag label={entry.niche} />
            {entry.fundingBadge && <Tag label={entry.fundingBadge} />}
          </div>
          <p className="text-[24px] font-medium leading-tight text-white/80 transition-opacity duration-200 group-hover:opacity-60 desk:text-[28px]">
            {project.label}
          </p>
        </div>
        <p className="pb-1 text-[12px] font-medium uppercase text-label-grey">
          {entry.stat ?? project.year}
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 pt-4 desk:w-[37%] desk:pt-0 desk:pl-5">
        {/* Same h-8.75 items-end box as the tags row opposite it, so both
            columns' content starts at the same top offset. */}
        <div className="flex h-8.75 items-end">
          <p className="text-[12px] font-medium uppercase text-label-grey">What We Did</p>
        </div>
        <p className="max-w-[40ch] text-[14px] leading-[1.3] tracking-[-0.02em] text-body-grey desk:text-[16px]">
          {entry.whatWeDid}
        </p>
      </div>
    </>
  );

  const className = "group fade-up flex w-full flex-col py-4 desk:flex-row";
  const style = { animationDelay: entranceDelay };

  if (project.external) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={project.label}
        className={className}
        style={style}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={project.href} aria-label={project.label} className={className} style={style}>
      {inner}
    </Link>
  );
}

/** Niche filter + full-width case study list for /case-studies. */
export function CaseStudyList({ entries }: { entries: CaseStudyShowcaseEntry[] }) {
  const rows = useMemo<ShowcaseRow[]>(
    () =>
      entries.flatMap((entry) => {
        const project = projects.find((p) => p.slug === entry.slug);
        return project ? [{ project, entry }] : [];
      }),
    [entries]
  );

  const niches = useMemo(
    () => ["All", ...Array.from(new Set(rows.map((r) => r.entry.niche)))],
    [rows]
  );

  const [activeNiche, setActiveNiche] = useState("All");
  const filtered =
    activeNiche === "All" ? rows : rows.filter((r) => r.entry.niche === activeNiche);

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-[10px]">
        <p className="text-[12px] font-medium uppercase text-label-grey">Niche:</p>
        <div className="flex flex-wrap gap-2">
          {niches.map((niche) => (
            <NichePill
              key={niche}
              label={niche}
              active={activeNiche === niche}
              onClick={() => setActiveNiche(niche)}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col divide-y divide-hairline">
        {filtered.map((row, index) => (
          <CaseStudyRow key={row.project.slug} row={row} index={index} />
        ))}
      </div>
    </section>
  );
}
