import { processSection } from "@/lib/process";
import { Emphasis } from "./case-study/Emphasis";
import {
  bleedMargin,
  DetailRow,
  noBreakHyphens,
  SplitHeader,
  type SectionEdge,
} from "./SectionRows";

/** Step and working-together titles: one size under the section's H2. */
const rowHeading =
  "text-balance text-[20px] font-medium leading-tight tracking-display text-white desk:text-[24px]";

/**
 * "What it looks like working with us": the homepage and every case study.
 * The H2 and intro in case study SectionShell's layout, then the /yc and
 * /services label | content rows: one row per step (the title with its mono
 * timing where ChallengeBlock has its "01 / 02" counter, then the step with
 * its `**phrase**` highlights in white), then the working-together terms.
 *
 * No bottom hairline: the next section's top rule closes the centre rule
 * (BlogFaq on the homepage, EndCta or the FAQ on case studies).
 */
export function ProcessSection({
  edge = "inset",
}: {
  /** "bleed" in a LeftNav-shell column (homepage), "inset" on case studies. */
  edge?: SectionEdge;
}) {
  const { heading, intro, steps, principlesHeading, principles } =
    processSection;

  return (
    <section
      aria-labelledby="process-heading"
      className={`border-t-[0.5px] border-hairline ${edge === "bleed" ? bleedMargin : ""}`}
    >
      <SplitHeader heading={heading} headingId="process-heading" edge={edge}>
        <p className="max-w-[60ch] text-[16px] leading-[1.5] text-muted-65">
          <Emphasis text={intro} />
        </p>
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
              <p className="text-muted-65">
                <Emphasis text={step.body} format={noBreakHyphens} />
              </p>
            </DetailRow>
          </li>
        ))}
      </ol>

      <div className="border-t-[0.5px] border-hairline">
        <DetailRow
          edge={edge}
          label={<h3 className={rowHeading}>{principlesHeading}</h3>}
        >
          <ul className="flex list-none flex-col divide-y-[0.5px] divide-hairline">
            {principles.map((principle) => (
              <li
                key={principle.lead}
                className="py-4 text-muted-65 first:pt-0 last:pb-0"
              >
                <strong className="font-medium text-white">
                  {principle.lead}
                </strong>{" "}
                {noBreakHyphens(principle.text)}
              </li>
            ))}
          </ul>
        </DetailRow>
      </div>
    </section>
  );
}
