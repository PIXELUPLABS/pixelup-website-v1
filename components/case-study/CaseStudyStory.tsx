import Link from "next/link";
import Image from "next/image";
import type {
  CaseMetric,
  CaseStoryBlock,
  CaseStudy,
  CaseStudyStory as CaseStudyStoryData,
} from "@/lib/case-studies";
import { CaseFaq } from "./CaseFaq";
import { CaseMediaBlock } from "./CaseMedia";
import { ClientInfo } from "./ClientInfo";
import { Emphasis, hasEmphasis } from "./Emphasis";
import { EndCta } from "./EndCta";
import { MoreProjects } from "./MoreProjects";
import { SectionShell } from "./SectionShell";

/**
 * Row label and body copy colors for one story. A story written with
 * `**phrase**` highlights (Henry Labs) mutes its body so the white phrases
 * stand out, and lifts the labels to white. One without any (Streamline)
 * keeps white body copy under grey labels.
 */
function copyTones(highlighted: boolean) {
  return highlighted
    ? { label: "text-white", body: "text-muted-65" }
    : { label: "text-white/60", body: "text-white" };
}

type CopyTones = ReturnType<typeof copyTones>;

/** Hairline-divided metric cells. Also the /services hero trust strip. */
export function Metrics({
  metrics,
  usesSharedCenterRule = false,
  bottomRule = true,
}: {
  metrics: CaseMetric[];
  usesSharedCenterRule?: boolean;
  /** Off when the next section's top rule would double it. */
  bottomRule?: boolean;
}) {
  // Two or three cells fill the row on desktop; on mobile a third spans both
  // columns instead of leaving an empty cell beside it.
  const threeUp = metrics.length === 3;
  const deskColumns =
    metrics.length === 2
      ? "desk:grid-cols-2"
      : threeUp
        ? "desk:grid-cols-3"
        : "desk:grid-cols-4";
  return (
    <div
      className={`grid grid-cols-2 border-t-[0.5px] border-hairline ${deskColumns} ${bottomRule ? "border-b-[0.5px]" : ""}`}
    >
      {metrics.map((metric, index) => {
        const mobileBorders = index % 2 === 1 ? "border-l-[0.5px]" : "";
        const mobileRows = index > 1 ? "border-t-[0.5px]" : "";
        const mobileSpan =
          threeUp && index === 2 ? "col-span-2 desk:col-span-1" : "";
        const desktopBorders =
          index > 0 && !(usesSharedCenterRule && index === 2)
            ? "desk:border-l-[0.5px]"
            : "desk:border-l-0";

        return (
          <div
            key={`${metric.value}-${metric.label}`}
            className={`flex min-w-0 flex-col gap-4 border-hairline p-6 ${mobileBorders} ${mobileRows} ${mobileSpan} ${desktopBorders} desk:border-t-0`}
          >
            <p className="text-[32px] font-medium leading-none tracking-display text-white desk:text-[48px]">
              {metric.value}
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-[14px] leading-[1.3] text-white">
                {metric.label}
              </p>
              {metric.detail && (
                <p className="text-[12px] leading-[1.3] text-white/60">
                  {metric.detail}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StoryHero({
  study,
  story,
}: {
  study: CaseStudy;
  story: CaseStudyStoryData;
}) {
  return (
    <div className="flex flex-col gap-6 pb-6">
      <section className="flex flex-col gap-6 p-6">
        {story.statusBadge && (
          <div className="fade-up flex items-end [animation-delay:100ms]">
            <span className="h-1 w-1.5 shrink-0 bg-highlight" />
            <p className="bg-label-grey/20 px-1 py-px text-[12px] font-medium uppercase text-white">
              {story.statusBadge}
            </p>
          </div>
        )}
        <h1
          // Balanced lines would stop well short of the column, so a
          // full-width headline fills each line instead.
          className={`fade-up ${story.fullWidthHeadline ? "text-pretty" : "max-w-[20ch] text-balance"} text-[32px] font-medium leading-[1.05] tracking-display text-white [animation-delay:200ms] desk:text-[64px]`}
        >
          {story.headline}
        </h1>
      </section>

      <ClientInfo
        info={study.info}
        className="fade-up [animation-delay:300ms] desk:hidden"
      />

      {story.highlights?.length ? (
        <div className="fade-up [animation-delay:400ms]">
          <Metrics metrics={story.highlights} />
        </div>
      ) : null}

      <div className="fade-up [animation-delay:500ms]">
        <CaseMediaBlock block={{ kind: "full", slot: study.hero }} priority />
      </div>
    </div>
  );
}

function ContextBlock({
  block,
  tones,
}: {
  block: Extract<CaseStoryBlock, { kind: "context" }>;
  tones: CopyTones;
}) {
  return (
    <SectionShell heading={block.heading} topRule contentInset="wide">
      <div className="flex flex-col divide-y-[0.5px] divide-hairline">
        {block.items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
          >
            <p
              className={`text-[14px] leading-[1.3] tracking-[-0.01em] ${tones.label}`}
            >
              {item.label}
            </p>
            <p className={`text-[16px] leading-[1.5] ${tones.body}`}>
              <Emphasis text={item.text} />
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function ChallengeBlock({
  block,
  total,
  tones,
}: {
  block: Extract<CaseStoryBlock, { kind: "challenge" }>;
  /** How many challenge blocks the story has, so "01" reads as "01 / 02". */
  total: number;
  tones: CopyTones;
}) {
  const details = [
    { label: "Problem", text: block.problem },
    { label: "Why it mattered", text: block.whyItMattered },
    { label: "What we did", text: block.whatWeDid },
    { label: "Outcome", text: block.outcome },
  ];

  return (
    <section className="border-t-[0.5px] border-hairline">
      <div className="grid desk:grid-cols-2">
        <div className="flex items-start justify-between gap-6 p-6 desk:border-r-[0.5px] desk:border-hairline">
          <p className="text-[14px] leading-[1.3] tracking-[-0.01em] text-white/60">
            Critical challenge
          </p>
          <p className="font-mono text-[12px] leading-none text-white">
            {block.index}
            <span className="text-white/40">
              {" "}
              / {String(total).padStart(2, "0")}
            </span>
          </p>
        </div>
        <div className="p-6 pt-0 desk:pt-6">
          <h2 className="max-w-[18ch] text-balance text-[24px] font-medium leading-tight tracking-display text-white desk:text-[48px]">
            {block.heading}
          </h2>
        </div>
      </div>
      <div className="divide-y-[0.5px] divide-hairline border-t-[0.5px] border-hairline">
        {details.map((detail) => (
          <div key={detail.label} className="grid desk:grid-cols-2">
            <p
              className={`p-6 pb-2 text-[14px] leading-[1.3] tracking-[-0.01em] ${tones.label} desk:border-r-[0.5px] desk:border-hairline desk:pb-6`}
            >
              {detail.label}
            </p>
            <p
              className={`p-6 pt-2 text-[16px] leading-[1.5] ${tones.body} desk:pt-6`}
            >
              <Emphasis text={detail.text} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function GalleryBlock({
  block,
  tones,
}: {
  block: Extract<CaseStoryBlock, { kind: "gallery" }>;
  tones: CopyTones;
}) {
  return (
    <>
      <SectionShell heading={block.heading} topRule contentInset="wide">
        <p className={`text-[16px] leading-[1.5] ${tones.body}`}>
          <Emphasis text={block.intro} />
        </p>
      </SectionShell>
      {block.media.map((media, index) =>
        index === 0 ? (
          <CaseMediaBlock key={index} block={media} />
        ) : (
          // Same gutter between stacked gallery media as between story media.
          <div key={index} className="-mt-4 desk:-mt-12">
            <CaseMediaBlock block={media} />
          </div>
        ),
      )}
    </>
  );
}

function ResultsBlock({
  block,
  flushNext,
}: {
  block: Extract<CaseStoryBlock, { kind: "results" }>;
  /** The next block opens with its own hairline: cancel the block gap and let
   * that rule close the metrics, so the dividers run into it instead of
   * stopping short (or doubling it with a second bottom border). */
  flushNext: boolean;
}) {
  return (
    <section
      className={`border-t-[0.5px] border-hairline ${flushNext ? "-mb-6" : ""}`}
    >
      <div className="p-6">
        <h2 className="text-[24px] font-medium leading-tight tracking-display text-white desk:text-[48px]">
          {block.heading}
        </h2>
      </div>
      {block.metrics?.length ? (
        <Metrics
          metrics={block.metrics}
          usesSharedCenterRule
          bottomRule={!flushNext}
        />
      ) : null}
    </section>
  );
}

function TestimonialBlock({
  block,
}: {
  block: Extract<CaseStoryBlock, { kind: "testimonial" }>;
}) {
  // An unapproved quote is previewable in dev but never ships publicly —
  // flip `approvalPending` off in lib/case-studies.ts once the client signs off.
  if (block.approvalPending && process.env.NODE_ENV === "production") {
    return null;
  }

  // Without a heading the label and quote read as one row on mobile, so the
  // hairline between the two columns only appears with a heading.
  const { heading } = block;

  return (
    <section className="border-t-[0.5px] border-hairline">
      <div className="grid desk:grid-cols-2">
        <div
          className={`flex flex-col gap-6 p-6 desk:border-r-[0.5px] desk:border-hairline ${heading ? "" : "pb-0 desk:pb-6"}`}
        >
          <p className="font-mono text-[12px] uppercase leading-none tracking-wide text-white/40">
            Client testimonial
          </p>
          {heading && (
            <h2 className="max-w-[18ch] text-balance text-[24px] font-medium leading-tight tracking-display text-white desk:text-[48px]">
              {heading}
            </h2>
          )}
        </div>
        <div
          className={`flex flex-col gap-8 p-6 ${heading ? "border-t-[0.5px] border-hairline desk:border-t-0" : ""}`}
        >
          {block.approvalPending && (
            <p className="w-fit border-[0.5px] border-hairline px-3 py-2 font-mono text-[12px] uppercase leading-none tracking-wide text-white/60">
              Prototype only · approval pending
            </p>
          )}
          <div className={`flex flex-col ${heading ? "gap-6" : "gap-5"}`}>
            {/* Headingless rows stay at paragraph scale so the quote reads
                as part of Results, not a pull quote. */}
            <blockquote
              className={
                heading
                  ? "max-w-[40ch] text-balance text-[20px] font-medium leading-[1.4] tracking-[-0.02em] text-white desk:text-[24px]"
                  : "text-[16px] leading-[1.5] text-white"
              }
            >
              “{block.quote}”
            </blockquote>
            <div className={`flex items-center ${heading ? "gap-4" : "gap-3"}`}>
              {block.person.headshot && (
                <div
                  className={`relative shrink-0 overflow-hidden rounded-full bg-white/[0.04] ${heading ? "h-16 w-16" : "h-10 w-10"}`}
                >
                  <Image
                    src={block.person.headshot}
                    alt={`${block.person.name}, ${block.person.company}`}
                    fill
                    sizes={heading ? "64px" : "40px"}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <p className="text-[16px] leading-[1.3] text-white">
                  {block.person.name}
                </p>
                <p className="text-[14px] leading-[1.3] text-white/60">
                  {block.person.role}, {block.person.company}
                  {block.source && (
                    <>
                      ,{" "}
                      <a
                        href={block.source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-white/30 underline-offset-2 hover:text-white"
                      >
                        {block.source.label}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryBlock({
  block,
  challengeTotal,
  nextOpensWithRule,
  followsMedia,
  tones,
}: {
  block: CaseStoryBlock;
  challengeTotal: number;
  nextOpensWithRule: boolean;
  /** A media block straight after another one tightens to the pair gutter. */
  followsMedia: boolean;
  tones: CopyTones;
}) {
  switch (block.kind) {
    case "context":
      return <ContextBlock block={block} tones={tones} />;
    case "media":
      // Stacked media blocks would sit 72px apart on desktop (24px padding on
      // each block + the 24px column gap) against a 24px gap inside a pair.
      // Pull a follow-on block up so every gap between images matches the
      // pair gutter: 24px on desktop, 8px on mobile where pairs stack.
      return followsMedia ? (
        <div className="-mt-4 desk:-mt-12">
          <CaseMediaBlock block={block.media} />
        </div>
      ) : (
        <CaseMediaBlock block={block.media} />
      );
    case "challenge":
      return (
        <ChallengeBlock block={block} total={challengeTotal} tones={tones} />
      );
    case "gallery":
      return <GalleryBlock block={block} tones={tones} />;
    case "results":
      return <ResultsBlock block={block} flushNext={nextOpensWithRule} />;
    case "testimonial":
      return <TestimonialBlock block={block} />;
    case "afterLaunch":
      return (
        <SectionShell heading={block.heading} topRule contentInset="wide">
          {block.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className={`text-[16px] leading-[1.5] ${tones.body}`}
            >
              <Emphasis text={paragraph} />
            </p>
          ))}
          {block.cta && (
            <p className={`text-[16px] leading-[1.5] ${tones.body}`}>
              {block.cta.text}{" "}
              <Link
                href={block.cta.href}
                className="text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
              >
                {block.cta.label}
              </Link>
              .
            </p>
          )}
        </SectionShell>
      );
  }
}

export function CaseStudyStory({ study }: { study: CaseStudy }) {
  const story = study.story;

  if (!story) return null;

  const challengeTotal = story.blocks.filter(
    (block) => block.kind === "challenge",
  ).length;
  // One `**phrase**` anywhere in the copy switches the whole story to the
  // highlighted tones, so labels and body never mix styles on one page.
  const tones = copyTones(hasEmphasis(JSON.stringify(story.blocks)));

  return (
    <>
      <StoryHero study={study} story={story} />
      <div className="relative desk:pb-6">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 hidden border-l-[0.5px] border-hairline desk:block"
        />
        <div className="relative flex flex-col gap-6">
          {story.blocks.map((block, index) => {
            // Every block except media opens with a full-width hairline, and
            // so does the FAQ that follows the last block.
            const next = story.blocks[index + 1];
            const previous = story.blocks[index - 1];
            return (
              <StoryBlock
                key={block.id}
                block={block}
                challengeTotal={challengeTotal}
                nextOpensWithRule={next?.kind !== "media"}
                followsMedia={
                  block.kind === "media" && previous?.kind === "media"
                }
                tones={tones}
              />
            );
          })}

          {study.endCta && <EndCta endCta={study.endCta} />}

          <SectionShell heading={story.faqHeading} topRule contentInset="wide">
            <CaseFaq items={story.faqs} />
          </SectionShell>

          <MoreProjects refs={study.moreProjects} heading="More case studies" />
        </div>
      </div>
    </>
  );
}
