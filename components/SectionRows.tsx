/**
 * The label | content rows behind /yc (staging only), its ProcessSection and
 * BlogFaq's grid variant: CaseStudyStory ChallengeBlock's geometry.
 */

/** Keeps hyphenated words ("AI-native") and ranges ("1–3") whole when a line wraps. */
export function noBreakHyphens(text: string) {
  return text.split(/(\S+[-–]\S+)/).map((part, i) =>
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
 * "inset" (default) pads every cell 24px, for a full-bleed main. "flush"
 * drops the outer side padding so the text lines up with the edge of a
 * LeftNav-shell column.
 * "bleed" keeps flush's text positions, but the section is pulled out by
 * `bleedMargin` so its hairlines run from the shell's divider to the
 * viewport edge with no gap; the cells pad that distance back.
 */
export type SectionEdge = "inset" | "flush" | "bleed";

/** The LeftNav shell's divider gap (mx-4) and outer padding (p-5), undone. */
export const bleedMargin = "desk:-ml-4 desk:-mr-5";

/** Padding of a row's left-hand (label or heading) cell. */
export const labelPadding: Record<SectionEdge, string> = {
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

/**
 * A section's index label: "01 — Raised" in small uppercase mono, the number
 * in white and the name in white/40 (/yc). Sits above a section's H2.
 */
export function SectionIndex({
  index,
  label,
}: {
  index: number;
  label: string;
}) {
  return (
    <p className="font-mono text-[12px] uppercase leading-none tracking-[0.06em] text-white/40">
      <span className="text-white">{String(index).padStart(2, "0")}</span>
      {" — "}
      {label}
    </p>
  );
}

/**
 * Registration marks where a section's top rule crosses the vertical rules:
 * small hairline crosses, desk only. The section needs `relative`. `start`
 * marks its left edge, which is only a rule on the "bleed" edge (the LeftNav
 * divider); a full-width section (/yc, "inset") sets it false, since a cross
 * centred on the viewport edge would overflow the page. The same reason
 * leaves out a mark at the right edge.
 */
export function RegMarks({
  centre = true,
  start = true,
}: {
  centre?: boolean;
  start?: boolean;
}) {
  const mark =
    "pointer-events-none absolute top-0 hidden size-[11px] -translate-x-1/2 -translate-y-1/2 text-white/50 desk:block";
  const cross = (
    <svg viewBox="0 0 11 11" fill="none" className="size-full">
      <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
  return (
    <>
      {start && (
        <span aria-hidden="true" className={`${mark} left-0`}>
          {cross}
        </span>
      )}
      {centre && (
        <span aria-hidden="true" className={`${mark} left-1/2`}>
          {cross}
        </span>
      )}
    </>
  );
}

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
  eyebrow,
  aside,
  children,
}: {
  heading: string;
  headingId: string;
  edge?: SectionEdge;
  /** Small label above the H2 (SectionIndex on /yc). */
  eyebrow?: React.ReactNode;
  /** Content for the heading row's right half, bottom-aligned on the H2's
      last line from desk (a child with desk:mb-auto rises to the top line).
      Below desk it stacks under the H2. /yc uses it so no heading row is
      left with an empty half. */
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="grid desk:grid-cols-2">
        <div
          className={`flex flex-col gap-5 ${labelPadding[edge]} desk:border-r-[0.5px] desk:border-hairline`}
        >
          {eyebrow}
          <h2
            id={headingId}
            className="text-balance text-[24px] font-medium leading-tight tracking-display text-white desk:text-[48px]"
          >
            {noBreakHyphens(heading)}
          </h2>
        </div>
        {aside && (
          <div
            className={`flex flex-col gap-5 ${contentPadding[edge]} pt-0 desk:justify-end desk:pt-6`}
          >
            {aside}
          </div>
        )}
      </div>
      {/* No lead copy: the heading row stands alone and the caller's own
          top rule (its rows) closes it. */}
      {children && (
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
      )}
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
