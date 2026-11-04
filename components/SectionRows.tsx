/**
 * The label | content rows shared by /services, /yc and ProcessSection
 * (homepage and case studies): CaseStudyStory ChallengeBlock's geometry,
 * split out of ServiceSection so pages outside /services can use them
 * without pulling in the /services code.
 */

/** Keeps hyphenated words ("AI-native") whole when a heading wraps. */
export function noBreakHyphens(text: string) {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/**
 * "inset" (default) pads every cell 24px, for a full-bleed main like
 * /services. "flush" drops the outer side padding so the text lines up with
 * the edge of a LeftNav-shell column (ClientRoster, BlogFaq), as on /yc.
 * "bleed" keeps flush's text positions, but the section is pulled out by
 * `bleedMargin` so its hairlines run from the shell's divider to the
 * viewport edge with no gap; the cells pad that distance back.
 */
export type SectionEdge = "inset" | "flush" | "bleed";

/** The LeftNav shell's divider gap (mx-4) and outer padding (p-5), undone. */
export const bleedMargin = "desk:-ml-4 desk:-mr-5";

const labelPadding: Record<SectionEdge, string> = {
  inset: "p-6",
  flush: "py-6 desk:pr-6",
  bleed: "py-6 desk:pl-4 desk:pr-6",
};

/** Padding of a row's right-hand (content) cell. */
export const contentPadding: Record<SectionEdge, string> = {
  inset: "p-6",
  flush: "py-6 desk:pl-6",
  bleed: "py-6 desk:pl-6 desk:pr-5",
};

/** One label | content row: CaseStudyStory ChallengeBlock's detail row. */
export function DetailRow({
  label,
  edge = "inset",
  children,
}: {
  label: React.ReactNode;
  edge?: SectionEdge;
  children: React.ReactNode;
}) {
  return (
    <div className="grid desk:grid-cols-2">
      <div
        className={`${labelPadding[edge]} pb-2 text-[14px] leading-[1.3] tracking-[-0.01em] text-white/60 desk:border-r-[0.5px] desk:border-hairline desk:pb-6`}
      >
        {label}
      </div>
      <div
        className={`flex flex-col gap-4 ${contentPadding[edge]} pt-2 text-[16px] leading-[1.5] text-white desk:pt-6`}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Case study SectionShell's header on these edges: the H2 in the left half,
 * a full-width hairline under it from desk up, then the lead copy in the
 * right half. The centre rule runs through both rows.
 */
export function SplitHeader({
  heading,
  headingId,
  edge = "inset",
  children,
}: {
  heading: string;
  headingId: string;
  edge?: SectionEdge;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="grid desk:grid-cols-2">
        <div
          className={`${labelPadding[edge]} desk:border-r-[0.5px] desk:border-hairline`}
        >
          <h2
            id={headingId}
            className="text-balance text-[24px] font-medium leading-tight tracking-display text-white desk:text-[48px]"
          >
            {noBreakHyphens(heading)}
          </h2>
        </div>
      </div>
      <div className="grid desk:grid-cols-2 desk:border-t-[0.5px] desk:border-hairline">
        <div
          aria-hidden="true"
          className="hidden desk:block desk:border-r-[0.5px] desk:border-hairline"
        />
        <div
          className={`flex flex-col gap-5 ${contentPadding[edge]} pt-0 desk:pt-6`}
        >
          {children}
        </div>
      </div>
    </>
  );
}

/**
 * Header row: small label + index on the left half, the section's H2 and its
 * lead copy on the right half. Same geometry as ChallengeBlock's header.
 */
export function SectionHeader({
  label,
  labelId,
  index,
  heading,
  edge = "inset",
  children,
}: {
  label: string;
  labelId: string;
  /** "01 / 06"-style counter, left out for non-service sections. */
  index?: { current: number; total: number };
  heading: string;
  edge?: SectionEdge;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid desk:grid-cols-2">
      <div
        className={`flex items-start justify-between gap-6 ${labelPadding[edge]} desk:border-r-[0.5px] desk:border-hairline`}
      >
        <p
          id={labelId}
          className="text-[16px] font-medium leading-[1.3] tracking-[-0.01em] text-white"
        >
          {label}
        </p>
        {index && (
          <p className="font-mono text-[12px] leading-none text-white">
            {String(index.current).padStart(2, "0")}
            <span className="text-white/40">
              {" "}
              / {String(index.total).padStart(2, "0")}
            </span>
          </p>
        )}
      </div>
      <div
        className={`flex flex-col gap-5 ${contentPadding[edge]} pt-0 desk:pt-6`}
      >
        <h2 className="max-w-[18ch] text-balance text-[24px] font-medium leading-tight tracking-display text-white desk:text-[48px]">
          {noBreakHyphens(heading)}
        </h2>
        {children}
      </div>
    </div>
  );
}
