/**
 * Q&A section layout from the Figma template: uppercase heading in the left
 * half, full-width hairline right below it, then the content column on the
 * right half (its left edge on the vertical center rule). Heights are fully
 * content-driven — the blocks grow/shrink with their copy. Padding: 24px
 * around the heading, 24px top/bottom + 12px sides on the content column.
 */
export function SectionShell({
  heading,
  children,
  topRule = false,
}: {
  heading: string;
  children: React.ReactNode;
  /** Full-width hairline above the section (Figma: the FAQ block). */
  topRule?: boolean;
}) {
  return (
    <section
      className={`w-full ${topRule ? "border-t-[0.5px] border-hairline" : ""}`}
    >
      {/* Without a top rule, 8px top padding + the 16px block gap above the
          section = 24px of visual space above the heading, equal to the 24px
          below it. With a rule, the heading needs the full 24px under it. */}
      <div className={`p-6 desk:w-1/2 ${topRule ? "" : "pt-2"}`}>
        <h2 className="tracking-display text-balance text-[24px] font-medium leading-none text-white desk:text-[48px]">
          {heading}
        </h2>
      </div>
      <div
        aria-hidden="true"
        className="hidden w-full border-t-[0.5px] border-hairline desk:block"
      />
      <div className="flex desk:justify-end">
        <div className="flex w-full flex-col gap-5 px-6 pb-6 desk:w-1/2 desk:px-3 desk:py-6">
          {children}
        </div>
      </div>
    </section>
  );
}
