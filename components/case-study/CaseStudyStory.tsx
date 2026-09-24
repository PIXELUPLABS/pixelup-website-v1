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
import { EndCta } from "./EndCta";
import { MoreProjects } from "./MoreProjects";
import { SectionShell } from "./SectionShell";

function Metrics({
  metrics,
  usesSharedCenterRule = false,
  bottomRule = true,
}: {
  metrics: CaseMetric[];
  usesSharedCenterRule?: boolean;
  /** Off when the next section's top rule would double it. */
  bottomRule?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-2 border-t-[0.5px] border-hairline desk:grid-cols-4 ${bottomRule ? "border-b-[0.5px]" : ""}`}
    >
      {metrics.map((metric, index) => {
        const mobileBorders = index % 2 === 1 ? "border-l-[0.5px]" : "";
        const mobileRows = index > 1 ? "border-t-[0.5px]" : "";
        const desktopBorders =
          index > 0 && !(usesSharedCenterRule && index === 2)
            ? "desk:border-l-[0.5px]"
            : "desk:border-l-0";

        return (
          <div
            key={`${metric.value}-${metric.label}`}
            className={`flex min-w-0 flex-col gap-4 border-hairline p-6 ${mobileBorders} ${mobileRows} ${desktopBorders} desk:border-t-0`}
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
        <h1 className="fade-up max-w-[20ch] text-balance text-[32px] font-medium leading-[1.05] tracking-display text-white [animation-delay:200ms] desk:text-[64px]">
          {story.headline}
        </h1>
      </section>

      <ClientInfo
        info={study.info}
        publication={study.publication}
        className="fade-up [animation-delay:300ms] desk:hidden"
      />

      <div className="fade-up [animation-delay:400ms]">
        <Metrics metrics={story.highlights} />
      </div>

      <div className="fade-up [animation-delay:500ms]">
        <CaseMediaBlock block={{ kind: "full", slot: study.hero }} priority />
      </div>
    </div>
  );
}

function ContextBlock({
  block,
}: {
  block: Extract<CaseStoryBlock, { kind: "context" }>;
}) {
  return (
    <SectionShell heading={block.heading} topRule contentInset="wide">
      <div className="flex flex-col divide-y-[0.5px] divide-hairline">
        {block.items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
          >
            <p className="text-[14px] leading-[1.3] tracking-[-0.01em] text-white/60">
              {item.label}
            </p>
            <p className="text-[16px] leading-[1.5] text-white">{item.text}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function ChallengeBlock({
  block,
  total,
}: {
  block: Extract<CaseStoryBlock, { kind: "challenge" }>;
  /** How many challenge blocks the story has, so "01" reads as "01 / 02". */
  total: number;
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
            <p className="p-6 pb-2 text-[14px] leading-[1.3] tracking-[-0.01em] text-white/60 desk:border-r-[0.5px] desk:border-hairline desk:pb-6">
              {detail.label}
            </p>
            <p className="p-6 pt-2 text-[16px] leading-[1.5] text-white desk:pt-6">
              {detail.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function GalleryBlock({
  block,
}: {
  block: Extract<CaseStoryBlock, { kind: "gallery" }>;
}) {
  return (
    <>
      <SectionShell heading={block.heading} topRule contentInset="wide">
        <p className="text-[16px] leading-[1.5] text-white">{block.intro}</p>
      </SectionShell>
      {block.media.map((media, index) => (
        <CaseMediaBlock key={index} block={media} />
      ))}
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
      <Metrics
        metrics={block.metrics}
        usesSharedCenterRule
        bottomRule={!flushNext}
      />
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

  return (
    <section className="border-t-[0.5px] border-hairline">
      <div className="grid desk:grid-cols-2">
        <div className="flex flex-col gap-6 p-6 desk:border-r-[0.5px] desk:border-hairline">
          <p className="font-mono text-[12px] uppercase leading-none tracking-wide text-white/40">
            Client testimonial
          </p>
          <h2 className="max-w-[18ch] text-balance text-[24px] font-medium leading-tight tracking-display text-white desk:text-[48px]">
            {block.heading}
          </h2>
        </div>
        <div className="flex flex-col gap-8 border-t-[0.5px] border-hairline p-6 desk:border-t-0">
          {block.approvalPending && (
            <p className="w-fit border-[0.5px] border-hairline px-3 py-2 font-mono text-[12px] uppercase leading-none tracking-wide text-white/60">
              Prototype only · approval pending
            </p>
          )}
          <div className="flex flex-col gap-6">
            <blockquote className="max-w-[40ch] text-balance text-[20px] font-medium leading-[1.4] tracking-[-0.02em] text-white desk:text-[24px]">
              “{block.quote}”
            </blockquote>
            <div className="flex items-center gap-4">
              {block.person.headshot && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white/[0.04]">
                  <Image
                    src={block.person.headshot}
                    alt={`${block.person.name}, ${block.person.company}`}
                    fill
                    sizes="64px"
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
}: {
  block: CaseStoryBlock;
  challengeTotal: number;
  nextOpensWithRule: boolean;
}) {
  switch (block.kind) {
    case "context":
      return <ContextBlock block={block} />;
    case "media":
      return <CaseMediaBlock block={block.media} />;
    case "challenge":
      return <ChallengeBlock block={block} total={challengeTotal} />;
    case "gallery":
      return <GalleryBlock block={block} />;
    case "results":
      return <ResultsBlock block={block} flushNext={nextOpensWithRule} />;
    case "testimonial":
      return <TestimonialBlock block={block} />;
    case "afterLaunch":
      return (
        <SectionShell heading={block.heading} topRule contentInset="wide">
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-[16px] leading-[1.5] text-white">
              {paragraph}
            </p>
          ))}
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
            return (
              <StoryBlock
                key={block.id}
                block={block}
                challengeTotal={challengeTotal}
                nextOpensWithRule={next?.kind !== "media"}
              />
            );
          })}

          {study.endCta && <EndCta endCta={study.endCta} />}

          <SectionShell
            heading={story.faqHeading}
            topRule
            contentInset="wide"
          >
            <CaseFaq items={story.faqs} />
          </SectionShell>

          <MoreProjects refs={study.moreProjects} heading="More case studies" />
        </div>
      </div>
    </>
  );
}
