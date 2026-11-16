import { processSection, type ProcessContent } from "@/lib/process";
import { Emphasis } from "./case-study/Emphasis";
import {
  bleedMargin,
  DetailRow,
  noBreakHyphens,
  RegMarks,
  SplitHeader,
  type SectionEdge,
} from "./SectionRows";

/** Step titles: one size under the section's H2. */
const rowHeading =
  "text-balance text-[20px] font-medium leading-tight tracking-display text-white desk:text-[24px]";

/**
 * "What it looks like working with us", on /yc only (staging): the homepage
 * and case studies follow main, which has no process section. The H2 in
 * case study SectionShell's layout, then SectionRows' label | content rows:
 * one row per step (the title with its mono timing where ChallengeBlock has
 * its "01 / 02" counter, then the step with its `**phrase**` highlight in
 * white). How we work day to day lives in the shared FAQ (pixelupFaq).
 *
 * No bottom hairline: the next section's top rule (/yc's FAQ) closes the
 * centre rule.
 */
/**
 * A step's span on the week track: one cell per week, the step's weeks in
 * color.brand.accent. Decorative (the mono timing says the same in words).
 */
/** One grid template for every track, so their columns can't drift apart. */
function trackColumns(cells: number) {
  return { gridTemplateColumns: `repeat(${cells}, minmax(0, 1fr))` };
}

function WeekTrack({
  cells,
  span: [start, end],
}: {
  cells: number;
  span: [number, number];
}) {
  return (
    <div
      aria-hidden="true"
      className="grid gap-px desk:mt-3"
      style={trackColumns(cells)}
    >
      {Array.from({ length: cells }, (_, cell) => (
        <span
          key={cell}
          className={`h-1.5 desk:h-2 ${cell >= start && cell < end ? "bg-accent" : "bg-white/10"}`}
        />
      ))}
    </div>
  );
}

/**
 * Gantt mode's head, in the right half of the row under the heading: the
 * total in Metrics' cell styles. No week ruler (Arjun dropped it, 2026-11-16):
 * the tracks and the mono timings carry the weeks.
 */
function GanttHead({
  total,
}: {
  total?: { value: string; label: string; detail?: string };
}) {
  return (
    <>
      {total && (
        <div className="flex flex-col gap-4">
          <p className="text-[32px] font-medium leading-none tracking-display text-white desk:text-[48px]">
            {total.value}
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-[14px] leading-[1.3] text-white">{total.label}</p>
            {total.detail && (
              <p className="text-[12px] leading-[1.3] text-white/60">{total.detail}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function ProcessSection({
  edge = "inset",
  content = processSection,
  eyebrow,
  marks = false,
}: {
  /** "inset" (default): full width, rules edge to edge (/yc since 2026-11-16).
      "bleed" is for a LeftNav-shell column; no current caller. */
  edge?: SectionEdge;
  /** A page's own wording of the same steps (/yc). Defaults to lib/process.ts. */
  content?: ProcessContent;
  /** SplitHeader's section index label (/yc). */
  eyebrow?: React.ReactNode;
  /** RegMarks on the section's top rule (/yc). The left mark only on "bleed". */
  marks?: boolean;
}) {
  const { heading, intro, steps, trackCells, total } = content;

  return (
    <section
      aria-labelledby="process-heading"
      className={`relative border-t-[0.5px] border-hairline ${edge === "bleed" ? bleedMargin : ""}`}
    >
      {marks && <RegMarks start={edge === "bleed"} />}
      <SplitHeader
        heading={heading}
        headingId="process-heading"
        edge={edge}
        eyebrow={eyebrow}
      >
        {/* Gantt mode: the total sits in the right half under the heading
            row (the heading row's right half stays empty, like every other
            section), in the same box as the tracks. */}
        {trackCells && <GanttHead total={total} />}
        {intro && (
          <p className="max-w-[60ch] text-[16px] leading-[1.5] text-muted-65">
            <Emphasis text={intro} />
          </p>
        )}
      </SplitHeader>

      <ol className="list-none divide-y-[0.5px] divide-hairline border-t-[0.5px] border-hairline">
        {steps.map((step) => (
          <li key={step.title}>
            <DetailRow
              edge={edge}
              label={
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className={rowHeading}>{step.title}</h3>
                  <p className="shrink-0 font-mono text-[12px] uppercase leading-none tracking-wide text-white">
                    {step.timing}
                  </p>
                </div>
              }
            >
              {trackCells && step.span && (
                <WeekTrack cells={trackCells} span={step.span} />
              )}
              <p className="text-muted-65">
                <Emphasis text={step.body} format={noBreakHyphens} />
              </p>
            </DetailRow>
          </li>
        ))}
      </ol>
    </section>
  );
}
